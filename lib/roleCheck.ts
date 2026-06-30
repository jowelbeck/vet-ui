import { supabase } from "@/lib/supabase";

export type Role = "admin" | "vet" | "nurse" | "technician" | "receptionist";

const ROLE_ACCESS: Record<string, Role[]> = {
  cases: ["admin", "vet", "nurse"],
  patients: ["admin", "vet", "nurse", "technician", "receptionist"],
  appointments: ["admin", "vet", "nurse", "receptionist"],
  billing: ["admin", "receptionist"],
  pharmacy: ["admin", "vet", "nurse", "technician"],
  lab: ["admin", "vet", "nurse", "technician"],
  analytics: ["admin", "vet"],
  team: ["admin"],
};

export async function getCurrentUserRole(): Promise<Role | null> {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("roleCheck: user =", user?.email, user?.id);
  if (!user) return null;

  // Check if user is the clinic owner (always admin)
  const { data: clinic } = await supabase
    .from("clinics")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("roleCheck: clinic =", clinic);
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
