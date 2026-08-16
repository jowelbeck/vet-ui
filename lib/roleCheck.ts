import { supabase } from "@/lib/supabase";

export type Role = "admin" | "vet" | "nurse" | "technician" | "receptionist";

const ROLE_ACCESS: Record<string, Role[]> = {
  cases: ["admin", "vet", "nurse", "technician"],
  patients: ["admin", "vet", "nurse", "technician", "receptionist"],
  appointments: ["admin", "vet", "nurse", "technician", "receptionist"],
  billing: ["admin", "receptionist"],
  pharmacy: ["admin", "vet", "nurse", "technician"],
  lab: ["admin", "vet", "nurse", "technician"],
  analytics: ["admin", "vet"],
  team: ["admin"],
};

export async function getCurrentUserRole(): Promise<Role | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check if user is the clinic owner (always admin)
  const { data: clinic } = await supabase
    .from("clinics")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (clinic) return "admin";

  // Otherwise check clinic_members table for invited role
  const { data: member } = await supabase
    .from("clinic_members")
    .select("role")
    .eq("email", user.email)
    .eq("status", "active")
    .maybeSingle();

  return (member?.role as Role) || null;
}

export function hasAccess(module: string, role: Role | null): boolean {
  if (!role) return false;
  return ROLE_ACCESS[module]?.includes(role) ?? false;
}
export async function isTrialExpired(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (user.email === "demo@vetsai.vet") return false; // demo account never expires

  const { data: clinic } = await supabase
    .from("clinics")
    .select("created_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!clinic) return false;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (sub) return false; // has an active paid plan, never expired

  const trialEnds = new Date(clinic.created_at);
  trialEnds.setDate(trialEnds.getDate() + 30);
  return new Date() > trialEnds;
}
