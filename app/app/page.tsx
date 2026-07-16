"use client";
import AppNav from "@/components/AppNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { classifyAnimal } from "@/lib/classify-animal";

// ── Types ────────────────────────────────────────────────────────────────────

type SoapNote = {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
};

type ApiResult = {
  animal?: string;
  symptoms?: string;
  breed?: string;
  status: string;
  case_id?: string;
  follow_up_questions?: string[];
  urgency?: string;
  recommendation?: string;
  possible_causes?: string[];
  disclaimer?: string;
  message?: string;
  detail?: string;
  sources?: string[];
  soap_note?: SoapNote;
  drug_notes?: string[];
};

type CaseHistoryItem = {
  id: number;
  animal: string;
  symptoms: string;
  petName?: string;
  breed?: string;
  age?: string;
  weight?: string;
  urgency?: string;
  recommendation?: string;
  possible_causes?: string[];
  sources?: string[];
  followUpAnswers?: string;
  soap_note?: SoapNote;
  drug_notes?: string[];
  disclaimer?: string;
  species_type?: string;
  vet_treatment_notes?: string;
  gps_lat?: number | null;
  gps_lng?: number | null;
  createdAt: string;
};

type Tab = "new-case" | "history";

// ── Helpers ──────────────────────────────────────────────────────────────────

function animalEmoji(animal?: string): string {
  const map: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    rabbit: "🐇",
    bird: "🐦",
    fish: "🐠",
    horse: "🐴",
    hamster: "🐹",
  };
  return map[animal?.toLowerCase() ?? ""] ?? "🐾";
}

function urgencyClass(urgency?: string): string {
  if (urgency === "high") return "urgency-high";
  if (urgency === "medium") return "urgency-medium";
  if (urgency === "low") return "urgency-low";
  return "urgency-unknown";
}

function cap(s?: string): string {
  if (!s) return "Unknown";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { getCurrentUserRole, hasAccess } = await import("@/lib/roleCheck");
      const role = await getCurrentUserRole();
      const isDemoUser = user.email === "demo@vetsai.vet";
      if (!isDemoUser && !hasAccess("cases", role)) {
        router.push("/patients");
        return;
      }
      supabase.from("subscriptions").select("plan,status").eq("user_id", user.id).single().then(({ data }) => {
        if (data) setSubscription(data);
      });
    });
  }, []);
  // Form fields
  const [speciesType, setSpeciesType] = useState("pets");
  const [vaccinationHistory, setVaccinationHistory] = useState<string[]>([]);
  const [flockSize, setFlockSize] = useState("");
  const [birdsDead, setBirdsDead] = useState("");
  const [caseFilterType, setCaseFilterType] = useState("all");
  const [animal, setAnimal] = useState("");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // UI state
  const [tab, setTab] = useState<Tab>("new-case");
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [subscription, setSubscription] = useState<{plan: string, status: string} | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("vetsai_lang");
    if (saved === "fr") setLang("fr");
  }, []);
  const toggleLang = (newLang: "en" | "fr") => {
    setLang(newLang);
    localStorage.setItem("vetsai_lang", newLang);
  };
  const t = {
    newCase: lang === "fr" ? "Nouveau cas" : "New case",
    caseHistory: lang === "fr" ? "Historique" : "Case history",
    patientInfo: lang === "fr" ? "Informations patient" : "Patient information",
    animalType: lang === "fr" ? (speciesType === "poultry" ? "Type d'oiseau" : speciesType === "livestock" ? "Type d'animal" : "Type d'animal") : (speciesType === "poultry" ? "Bird type" : speciesType === "livestock" ? "Animal type" : "Animal type"),
    petName: lang === "fr" ? (speciesType === "poultry" ? "Nom de la ferme" : speciesType === "livestock" ? "Identifiant / Boucle" : "Nom de l'animal") : (speciesType === "poultry" ? "Farm name" : speciesType === "livestock" ? "Animal ID / Tag" : "Pet name"),
    breed: lang === "fr" ? (speciesType === "poultry" ? "Race / Souche" : speciesType === "livestock" ? "Race" : "Race") : (speciesType === "poultry" ? "Breed / Strain" : speciesType === "livestock" ? "Breed" : "Breed"),
    age: lang === "fr" ? "Âge" : "Age",
    weight: lang === "fr" ? (speciesType === "poultry" ? "Oiseaux affectés" : "Poids") : (speciesType === "poultry" ? "Birds affected" : "Weight"),
    symptoms: lang === "fr" ? "Symptômes" : "Symptoms",
    analyzeCase: lang === "fr" ? "Analyser le cas" : "Analyze case",
    clear: lang === "fr" ? "Effacer" : "Clear",
    analyzing: lang === "fr" ? "⏳ Analyse en cours…" : "⏳ Analyzing…",
    logout: lang === "fr" ? "Déconnexion" : "Log out",
    patients: lang === "fr" ? "Patients" : "Patients",
    team: lang === "fr" ? "Équipe" : "Team",
    appointments: lang === "fr" ? "Rendez-vous" : "Appointments",
    billing: lang === "fr" ? "Facturation" : "Billing",
    analytics: lang === "fr" ? "Analytique" : "Analytics",
    qr: lang === "fr" ? "QR" : "QR",
    totalCases: lang === "fr" ? "Total des cas" : "Total cases",
    high: lang === "fr" ? "Élevée" : "High",
    medium: lang === "fr" ? "Moyenne" : "Medium",
    low: lang === "fr" ? "Faible" : "Low",
    placeholderAnimal: lang === "fr" ? (speciesType === "poultry" ? "Poulet, Dinde, Canard…" : speciesType === "livestock" ? "Bovin, Chèvre, Mouton…" : "Chien, chat, lapin…") : (speciesType === "poultry" ? "Chicken, Turkey, Duck…" : speciesType === "livestock" ? "Cattle, Goat, Sheep…" : "Dog, cat, rabbit…"),
    placeholderPetName: lang === "fr" ? (speciesType === "poultry" ? "Ferme Kofi" : speciesType === "livestock" ? "TAG-001" : "Buddy") : (speciesType === "poultry" ? "Kofi Farms" : speciesType === "livestock" ? "TAG-001" : "Buddy"),
    placeholderBreed: lang === "fr" ? (speciesType === "poultry" ? "Poulet de chair, Pondeuse, Noiler…" : speciesType === "livestock" ? "Frisonne, Sahiwal…" : "Labrador, Persan…") : (speciesType === "poultry" ? "Broiler, Layer, Noiler…" : speciesType === "livestock" ? "Friesian, Sahiwal…" : "Labrador, Persian…"),
    placeholderAge: lang === "fr" ? (speciesType === "poultry" ? "4 semaines" : speciesType === "livestock" ? "4 ans" : "3 ans") : (speciesType === "poultry" ? "4 weeks" : speciesType === "livestock" ? "4 years" : "3 years"),
    placeholderWeight: lang === "fr" ? (speciesType === "poultry" ? "ex: 200 oiseaux" : speciesType === "livestock" ? "450 kg" : "12 kg") : (speciesType === "poultry" ? "e.g. 200 birds" : speciesType === "livestock" ? "450 kg" : "12 kg"),
    placeholderSymptoms: lang === "fr" ? "Décrivez ce que vous avez observé — comportement, signes physiques, durée…" : "Describe what you've observed — behaviour, physical signs, duration…",
    placeholderSearch: lang === "fr"
      ? (caseFilterType === "poultry" ? "Rechercher par ferme, oiseau ou symptômes…" : caseFilterType === "livestock" ? "Rechercher par ID, animal ou symptômes…" : "Rechercher par animal, espèce ou symptômes…")
      : (caseFilterType === "poultry" ? "Search by farm, bird type, or symptoms…" : caseFilterType === "livestock" ? "Search by animal ID, breed, or symptoms…" : "Search by pet, animal, or symptoms…"),
    errorRequired: lang === "fr" ? "Le type d'animal et les symptômes sont obligatoires." : "Animal type and symptoms are required.",
    errorFollowUp: lang === "fr" ? "Veuillez répondre aux questions de suivi." : "Please answer the follow-up questions.",
    errorGeneral: lang === "fr" ? "Une erreur s'est produite." : "Something went wrong.",
    successCleared: lang === "fr" ? "Historique des cas effacé." : "Case history cleared.",
    startNewCase: lang === "fr" ? "＋ Nouveau cas" : "＋ Start new case",
    followUpQuestions: lang === "fr" ? "Questions de suivi" : "Follow-up questions",
    yourAnswers: lang === "fr" ? "Vos réponses" : "Your answers",
    submitAnswers: lang === "fr" ? "Soumettre les réponses" : "Submit answers",
    submitting: lang === "fr" ? "Envoi en cours…" : "Submitting…",
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Case flow
  const [result, setResult] = useState<ApiResult | null>(null);
  const [caseId, setCaseId] = useState("");
  const [dbCaseId, setDbCaseId] = useState<string | null>(null);
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [attestingVetName, setAttestingVetName] = useState("");
  const [attestingVetLicense, setAttestingVetLicense] = useState("");
  const [attestationConfirmed, setAttestationConfirmed] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);
  const [locationSource, setLocationSource] = useState<"device_gps" | "manual" | null>(null);
  const [locationCapturing, setLocationCapturing] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState("");

  // History
  const [caseHistory, setCaseHistory] = useState<CaseHistoryItem[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("animal")) setAnimal(params.get("animal") ?? "");
      if (params.get("name")) setPetName(params.get("name") ?? "");
      if (params.get("breed")) setBreed(params.get("breed") ?? "");
      if (params.get("age")) setAge(params.get("age") ?? "");
      if (params.get("weight")) setWeight(params.get("weight") ?? "");
    }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("caseHistory");
      setCaseHistory(saved ? JSON.parse(saved) : []);
    } catch {
      setCaseHistory([]);
    }
    setHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // ── Persistence helpers ────────────────────────────────────────────────────

  const persistHistory = (updated: CaseHistoryItem[]) => {
    setCaseHistory(updated);
    localStorage.setItem("caseHistory", JSON.stringify(updated));
  };

  const saveCase = (data: ApiResult, answers: string) => {
    const newCase: CaseHistoryItem = {
      id: Date.now(),
      animal: data.animal || animal,
      symptoms: data.symptoms || symptoms,
      petName,
      breed,
      age,
      weight,
      urgency: data.urgency,
      recommendation: data.recommendation,
      possible_causes: data.possible_causes ?? [],
      sources: data.sources ?? [],
      followUpAnswers: answers,
      soap_note: data.soap_note,
      drug_notes: data.drug_notes ?? [],
      createdAt: new Date().toISOString(),
      gps_lat: gpsLat,
      gps_lng: gpsLng,
    };
    setCaseHistory((prev) => {
      const updated = [newCase, ...prev];
      localStorage.setItem("caseHistory", JSON.stringify(updated));
      return updated;
    });
    // Also save to Supabase
    console.log("Saving case to Supabase...");
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      console.log("User for case save:", user?.id);
      if (user) {
        // Find-or-create the matching patient record so this case shows up
        // on their ongoing record, not just as an isolated AI analysis.
        let patientId: string | null = null;

        if (newCase.petName && newCase.petName.trim()) {
          const { data: existingPatient } = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", user.id)
            .ilike("name", newCase.petName.trim())
            .ilike("animal", newCase.animal)
            .maybeSingle();

          if (existingPatient) {
            patientId = existingPatient.id;
          } else {
            const { data: newPatient, error: patientError } = await supabase
              .from("patients")
              .insert({
                user_id: user.id,
                name: newCase.petName.trim(),
                animal: newCase.animal,
                species_type: classifyAnimal(newCase.animal),
                breed: newCase.breed || "",
                age: newCase.age || "",
                weight: newCase.weight || "",
                owner_name: "",
                owner_phone: "",
              })
              .select()
              .single();
            if (patientError) {
              console.error("Auto-create patient error:", patientError);
            } else if (newPatient) {
              patientId = newPatient.id;
            }
          }
        }

        supabase.from("cases").insert({
          user_id: user.id,
          patient_id: patientId,
          animal: newCase.animal,
          pet_name: newCase.petName,
          breed: newCase.breed,
          age: newCase.age,
          weight: newCase.weight,
          symptoms: newCase.symptoms,
          urgency: newCase.urgency,
          recommendation: newCase.recommendation,
          soap_note: newCase.soap_note,
          created_at: newCase.createdAt,
          gps_lat: gpsLat,
          gps_lng: gpsLng,
          location_captured_at: (gpsLat !== null || gpsLng !== null) ? new Date().toISOString() : null,
          location_source: locationSource,
        }).select().single().then(({ data: row, error }) => {
          if (error) { console.error("Case save error:", error); return; }
          if (row) setDbCaseId(row.id);
        });
      }
    });
  };

  const saveTreatmentNotes = async () => {
    if (!dbCaseId || !treatmentNotes.trim()) return;
    setSavingNotes(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("cases")
      .update({
        vet_treatment_notes: treatmentNotes.trim(),
        vet_notes_added_by: user?.id,
        vet_notes_added_at: new Date().toISOString(),
      })
      .eq("id", dbCaseId);
    setSavingNotes(false);
    if (error) {
      console.error("Treatment notes save error:", error);
      return;
    }
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  // ── Form actions ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setAnimal("");
    setPetName("");
    setBreed("");
    setAge("");
    setWeight("");
    setSymptoms("");
    setError("");
    setResult(null);
    setCaseId("");
    setDbCaseId(null);
    setTreatmentNotes("");
    setNotesSaved(false);
    setFollowUpQuestions([]);
    setFollowUpAnswers("");
  };

  const captureLocation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setShowManualLocation(true);
        resolve();
        return;
      }
      setLocationCapturing(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLat(position.coords.latitude);
          setGpsLng(position.coords.longitude);
          setLocationSource("device_gps");
          setLocationCapturing(false);
          resolve();
        },
        () => {
          setLocationCapturing(false);
          setShowManualLocation(true);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  const handleSubmit = async () => {
    if (!animal.trim() || !symptoms.trim()) {
      setError(t.errorRequired);
      return;
    }
    await captureLocation();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal: animal.trim(),
        species_type: speciesType,
        vaccination_history: vaccinationHistory.length > 0 ? vaccinationHistory.join(", ") : null,
          symptoms: symptoms.trim(),
          pet_name: petName.trim(),
          breed: breed.trim(),
          age: age.trim(),
          weight: weight.trim(),
          flock_size: flockSize.trim() || null,
          birds_dead: birdsDead.trim() || null,
          language: lang,
        }),
      });
      const data: ApiResult = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Failed to analyze case.");
      if (data.status === "needs_follow_up") {
        setCaseId(data.case_id ?? "");
        setFollowUpQuestions(data.follow_up_questions ?? []);
      } else {
        setResult(data);
        saveCase(data, "");
        setCaseId("");
        setFollowUpQuestions([]);
        setFollowUpAnswers("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUpAnswers.trim()) {
      setError(t.errorFollowUp);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          animal: animal.trim(),
        species_type: speciesType,
          symptoms: symptoms.trim(),
          follow_up_answers: followUpAnswers.trim(),
          pet_name: petName.trim(),
          breed: breed.trim(),
          age: age.trim(),
          weight: weight.trim(),
          flock_size: flockSize.trim() || null,
          birds_dead: birdsDead.trim() || null,
          language: lang,
        }),
      });
      const data: ApiResult = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Failed to submit follow-up.");
      if (data.status === "completed") {
        setResult(data);
        saveCase(data, followUpAnswers);
        setCaseId("");
        setFollowUpQuestions([]);
        setFollowUpAnswers("");
      } else {
        setFollowUpQuestions(data.follow_up_questions ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  // ── Import / Export ────────────────────────────────────────────────────────

  const exportCases = () => {
    const blob = new Blob([JSON.stringify(caseHistory, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "veterinary-cases.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCases = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        if (!Array.isArray(imported)) throw new Error("Invalid format");
        if (!window.confirm(`Import ${imported.length} case(s)?`)) {
          e.target.value = "";
          return;
        }
        const valid = imported.filter((i) => i.id && i.animal && i.symptoms);
        const skipped = imported.length - valid.length;
        const merged = [
          ...caseHistory,
          ...valid.filter((n) => !caseHistory.some((x) => x.id === n.id)),
        ];
        persistHistory(merged);
        setSuccessMessage(
          `${valid.length} case(s) imported.${skipped > 0 ? ` ${skipped} skipped.` : ""}`
        );
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const clearHistory = () => {
    if (!window.confirm("Clear all case history?")) return;
    localStorage.removeItem("caseHistory");
    setCaseHistory([]);
    setSuccessMessage(t.successCleared);
  };

  // ── Report generation ──────────────────────────────────────────────────────

  const buildReportHTML = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }, vetNotes: string = "") => {
    const urgencyColor = data.urgency === "high" ? "#dc2626" : data.urgency === "medium" ? "#d97706" : "#2d8653";
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    const soapSection = data.soap_note ? `
      <div class="section">
        <div class="section-title">SOAP Note Draft</div>
        ${(["subjective", "objective", "assessment", "plan"] as const).map(key =>
          data.soap_note![key] ? `
            <div class="soap-key">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div class="soap-val">${data.soap_note![key]}</div>
          ` : ""
        ).join("")}
      </div>` : "";

    const drugSection = (data.drug_notes?.length ?? 0) > 0 ? `
      <div class="section">
        <div class="section-title">Drug &amp; Dosage Notes</div>
        <ul>${data.drug_notes!.map(n => `<li>${n}</li>`).join("")}</ul>
      </div>` : "";

    const causesSection = (data.possible_causes?.length ?? 0) > 0 ? `
      <div class="section">
        <div class="section-title">Possible Causes</div>
        <ul>${data.possible_causes!.map(c => `<li>${c}</li>`).join("")}</ul>
      </div>` : "";

    const sourcesSection = (data.sources?.length ?? 0) > 0 ? `
      <div class="section">
        <div class="section-title">Sources</div>
        <ul>${data.sources!.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>` : "";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>VetsAI Case Report — ${petData.petName || petData.animal}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #1e293b; padding: 40px; max-width: 720px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2d8653; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 700; color: #2d8653; }
    .logo span { font-size: 13px; font-weight: 400; color: #64748b; display: block; margin-top: 2px; }
    .report-date { font-size: 12px; color: #64748b; text-align: right; }
    .urgency-banner { padding: 10px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 600; font-size: 14px; background: ${data.urgency === "high" ? "#fee2e2" : data.urgency === "medium" ? "#fef3c7" : "#d4f0e0"}; color: ${urgencyColor}; border: 1px solid ${urgencyColor}; }
    .pet-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; background: #f8fafc; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
    .pet-field strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 3px; }
    .pet-field span { font-size: 13px; color: #334155; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .section p { font-size: 13px; color: #334155; line-height: 1.6; }
    .section ul { padding-left: 18px; }
    .section li { font-size: 13px; color: #334155; margin-bottom: 4px; line-height: 1.5; }
    .soap-key { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b; margin: 10px 0 4px; }
    .soap-val { font-size: 13px; color: #334155; background: #f8fafc; padding: 8px 12px; border-radius: 6px; line-height: 1.6; }
    .recommendation { font-size: 14px; color: #1e293b; line-height: 1.7; background: #f0faf4; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #2d8653; }
    .disclaimer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; font-style: italic; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><img src="/vetsai-icon.svg" alt="VetsAI" width="28" height="28" style="border-radius:6px;vertical-align:middle;margin-right:8px;"> VetsAI<span>Clinic Operating System</span></div>
    <div class="report-date">Case Report<br/>${date}</div>
  </div>

  <div class="urgency-banner">
    Urgency: ${(data.urgency ?? "unknown").toUpperCase()}
    ${data.urgency === "high" ? " — Seek immediate veterinary care" : ""}
  </div>

  <div class="pet-grid">
    <div class="pet-field"><strong>Name</strong><span>${petData.petName || "—"}</span></div>
    <div class="pet-field"><strong>Animal</strong><span>${petData.animal || "—"}</span></div>
    <div class="pet-field"><strong>Breed</strong><span>${petData.breed || "—"}</span></div>
    <div class="pet-field"><strong>Age</strong><span>${petData.age || "—"}</span></div>
    <div class="pet-field"><strong>Weight</strong><span>${petData.weight || "—"}</span></div>
  </div>

  ${data.recommendation ? `
  <div class="section">
    <div class="section-title">Recommendation</div>
    <div class="recommendation">${data.recommendation}</div>
  </div>` : ""}

  ${causesSection}
  ${drugSection}
  ${soapSection}
  ${sourcesSection}

  ${vetNotes ? `
  <div class="section">
    <div class="section-title">Doctor's Treatment Notes</div>
    <p style="white-space: pre-wrap;">${vetNotes}</p>
  </div>
  ` : ""}
  <div class="disclaimer">${data.disclaimer || "VetsAI Clinical AI — Cross-check all diagnoses, dosages and treatment recommendations against current clinical guidelines and your professional judgment before proceeding. Drug dosages must be verified against patient weight and manufacturer specifications. The attending veterinarian bears full clinical responsibility for treatment decisions."}</div>
</body>
</html>`;
  };

  const printReport = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }, vetNotes: string = "", locLat: number | null = null, locLng: number | null = null, locTime: string | null = null) => {
    const html = buildReportHTML(data, petData, vetNotes);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // WOAH notifiable disease detection
  const WOAH_DISEASES = ['newcastle', 'avian influenza', 'foot and mouth', 'anthrax', 'brucellosis', 'rabies', 'african swine fever', 'lumpy skin', 'peste des petits', 'ppr', 'rift valley', 'contagious bovine', 'cbpp', 'heartwater', 'east coast fever', 'trypanosomiasis', 'highly pathogenic', 'hpai', 'fmd', 'asfv', 'bluetongue', 'sheep pox', 'goat pox', 'equine influenza', 'glanders', 'surra'];
  const isWoahNotifiable = (data: ApiResult | CaseHistoryItem) => {
    const text = [
      ...(data.possible_causes ?? []),
      data.recommendation ?? "",
    ].join(" ").toLowerCase();
    return WOAH_DISEASES.some(d => text.includes(d));
  };

  const buildWoahReportHTML = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }, vetNotes: string = "", locLat: number | null = null, locLng: number | null = null, locTime: string | null = null, vetName: string = "", vetLicense: string = "") => {
    const date = new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const causes = (data.possible_causes ?? []).join(", ");
    return `<!DOCTYPE html>
<html>
<head>
  <title>WOAH Disease Notification Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 700px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1a3d2b; }
    .logo { font-size: 20px; font-weight: 800; color: #1a3d2b; }
    .logo span { display: block; font-size: 11px; color: #64748b; font-weight: 400; letter-spacing: 1px; }
    .woah-badge { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: 1px; }
    h1 { font-size: 18px; color: #1a3d2b; margin: 0 0 4px; }
    .subtitle { font-size: 12px; color: #64748b; margin-bottom: 24px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; }
    .field { background: #f8fafc; padding: 10px 14px; border-radius: 6px; margin-bottom: 8px; font-size: 13px; }
    .field strong { color: #374151; }
    .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #991b1b; margin-bottom: 20px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    .sign-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">VetsAI<span>Clinic Operating System · WOAH-Aligned</span></div>
    <div class="woah-badge">⚠ NOTIFIABLE DISEASE REPORT</div>
  </div>
  <h1>WOAH Disease Notification Report</h1>
  <p class="subtitle">Generated: ${date} · Submitted via VetsAI · vetsai.vet</p>
  <div class="alert">
    ⚠ This case contains findings consistent with a WOAH-notifiable disease. This report should be submitted to your national Chief Veterinary Officer and/or the Ghana Veterinary Council.
  </div>
  <div class="section">
    <div class="section-title">Patient Details</div>
    <div class="field"><strong>Animal name:</strong> ${petData.petName || "—"}</div>
    <div class="field"><strong>Species:</strong> ${petData.animal || "—"}</div>
    <div class="field"><strong>Breed:</strong> ${petData.breed || "—"}</div>
    <div class="field"><strong>Age:</strong> ${petData.age || "—"}</div>
    <div class="field"><strong>Weight:</strong> ${petData.weight || "—"}</div>
  </div>
  <div class="section">
    <div class="section-title">Location &amp; Timing</div>
    <div class="field"><strong>Species:</strong> ${petData.animal || "—"}</div>
    <div class="field"><strong>Date/time recorded:</strong> ${locTime ? new Date(locTime).toLocaleString() : date}</div>
    ${locLat != null && locLng != null ? `
    <div class="field"><strong>GPS coordinates:</strong> ${locLat}, ${locLng}
      (<a href="https://maps.google.com/?q=${locLat},${locLng}" target="_blank">view on map</a>)
    </div>
    ` : `<div class="field"><strong>GPS coordinates:</strong> Not captured</div>`}
  </div>
  <div class="section">
    <div class="section-title">Clinical Findings</div>
    <div class="field"><strong>Urgency level:</strong> ${(data.urgency ?? "unknown").toUpperCase()}</div>
    <div class="field"><strong>Possible diagnoses:</strong> ${causes || "—"}</div>
    <div class="field"><strong>Recommendation:</strong> ${data.recommendation || "—"}</div>
  </div>
  <div class="section">
    <div class="section-title">Reporting Veterinarian</div>
    <div class="sign-box">
      ${vetName ? `<p style="font-size:12px;color:#059669;margin:0 0 12px">✓ Attested electronically by the reporting veterinarian below.</p>` : `<p style="font-size:13px;color:#64748b;margin:0 0 20px">Please complete and sign before submission:</p>`}
      <div class="field"><strong>Name:</strong> ${vetName || "_________________________________"}</div>
      <div class="field"><strong>Licence number:</strong> ${vetLicense || "_________________________________"}</div>
      <div class="field"><strong>Clinic name:</strong> _________________________________</div>
      <div class="field"><strong>Date:</strong> ${date}</div>
      <div class="field"><strong>Signature:</strong> ${vetName ? `${vetName} (electronically attested)` : "_________________________________"}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Submit to</div>
    <div class="field">Ghana Veterinary Council · veterinarycouncil.gov.gh</div>
    <div class="field">Chief Veterinary Officer, Ministry of Food and Agriculture, Ghana</div>
    <div class="field">WOAH WAHIS System · wahis.woah.org</div>
  </div>
  ${vetNotes ? `
  <div class="section">
    <div class="section-title">Doctor's Treatment Notes</div>
    <div class="field" style="white-space: pre-wrap;">${vetNotes}</div>
  </div>
  ` : ""}
  <div class="footer">
    Generated by VetsAI · vetsai.vet · This report supports WOAH disease surveillance obligations under the Terrestrial Animal Health Code.
  </div>
</body>
</html>`;
  };

  const reportToAuthorities = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }, vetNotes: string = "", locLat: number | null = null, locLng: number | null = null, locTime: string | null = null) => {
    const html = buildWoahReportHTML(data, petData, vetNotes, locLat, locLng, locTime, attestingVetName.trim(), attestingVetLicense.trim());
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);

    // Persist that this case was reported, including the attesting vet's
    // details - only meaningful for the live case (dbCaseId), not
    // historical localStorage entries.
    if (dbCaseId) {
      supabase.from("cases").update({
        reported_to_authorities: true,
        reported_at: new Date().toISOString(),
        attesting_vet_name: attestingVetName.trim() || null,
        attesting_vet_license: attestingVetLicense.trim() || null,
        attested_at: new Date().toISOString(),
      }).eq("id", dbCaseId).then(({ error }) => {
        if (error) console.error("Failed to mark case as reported:", error);
      });
    } else {
      console.log("DEBUG: dbCaseId was falsy, update skipped entirely");
    }
  };

  const downloadWoahReport = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }, vetNotes: string = "", locLat: number | null = null, locLng: number | null = null, locTime: string | null = null) => {
    const html = buildWoahReportHTML(data, petData, vetNotes, locLat, locLng, locTime);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WOAH-report-${petData.petName || petData.animal}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }) => {
    const html = buildReportHTML(data, petData);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vetassist-report-${petData.petName || petData.animal}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived values ─────────────────────────────────────────────────────────

  const filteredHistory = caseHistory.filter((item) => {
    if (caseFilterType !== "all" && item.species_type !== caseFilterType) return false;
    const q = searchTerm.toLowerCase();
    return (
      (item.petName ?? "").toLowerCase().includes(q) ||
      item.animal.toLowerCase().includes(q) ||
      item.symptoms.toLowerCase().includes(q)
    );
  });

  const totalCases = caseHistory.length;
  const highCases = caseHistory.filter((c) => c.urgency === "high").length;
  const mediumCases = caseHistory.filter((c) => c.urgency === "medium").length;
  const lowCases = caseHistory.filter((c) => c.urgency === "low").length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AppNav />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green-50: #f0faf4; --green-100: #d4f0e0;
          --green-500: #2d8653; --green-600: #236b42; --green-700: #1a5232;
          --amber-500: #d97706;
          --red-50: #fef2f2; --red-500: #dc2626; --red-600: #b91c1c;
          --slate-50: #f8fafc; --slate-100: #f1f5f9; --slate-200: #e2e8f0;
          --slate-400: #94a3b8; --slate-500: #64748b;
          --slate-700: #334155; --slate-800: #1e293b;
          --white: #ffffff;
          --radius: 10px; --radius-sm: 6px;
          --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
        }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--slate-100); color: var(--slate-800); font-size: 14px; line-height: 1.5; }
        .app { max-width: 860px; margin: 0 auto; padding: 0 16px 48px; }

        /* Header */
        .header { padding: 28px 0 24px; border-bottom: 1px solid var(--slate-200); margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-mark { width: 40px; height: 40px; background: var(--green-500); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .header h1 { font-size: 20px; font-weight: 600; color: var(--slate-800); letter-spacing: -0.3px; }
        .header-sub { font-size: 13px; color: var(--slate-500); margin-top: 1px; }
        .tab-bar { display: flex; gap: 4px; background: var(--slate-200); border-radius: var(--radius-sm); padding: 3px; }
        .tab { padding: 6px 16px; border-radius: 5px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--slate-500); cursor: pointer; transition: all 0.15s; }
        .tab.active { background: var(--white); color: var(--slate-800); box-shadow: var(--shadow); }

        /* Stats */
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
        .stat-card { background: var(--white); border: 1px solid var(--slate-200); border-radius: var(--radius); padding: 14px 16px; }
        .stat-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--slate-400); margin-bottom: 6px; }
        .stat-value { font-size: 26px; font-weight: 700; letter-spacing: -1px; color: var(--slate-800); }
        .stat-card.high .stat-value { color: var(--red-500); }
        .stat-card.medium .stat-value { color: var(--amber-500); }
        .stat-card.low .stat-value { color: var(--green-500); }

        /* Card */
        .card { background: var(--white); border: 1px solid var(--slate-200); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); margin-bottom: 16px; }
        .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--slate-400); margin-bottom: 16px; }

        /* Form */
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .field-full { grid-column: 1 / -1; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 12px; font-weight: 600; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.4px; }
        .field input, .field textarea {
          padding: 9px 12px; border: 1px solid var(--slate-200); border-radius: var(--radius-sm);
          font-size: 14px; color: var(--slate-800); background: var(--slate-50);
          outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical;
          font-family: inherit;
        }
        .field input:focus, .field textarea:focus { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(45,134,83,0.1); background: var(--white); }
        .field textarea { min-height: 90px; }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius-sm); border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .btn-primary { background: var(--green-500); color: var(--white); }
        .btn-primary:hover { background: var(--green-600); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { background: var(--white); color: var(--slate-700); border: 1px solid var(--slate-200); }
        .btn-secondary:hover { background: var(--slate-50); border-color: #cbd5e1; }
        .btn-danger { background: var(--white); color: var(--red-500); border: 1px solid #fecaca; font-size: 12px; padding: 5px 10px; }
        .btn-danger:hover { background: var(--red-50); }
        .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }

        /* Alerts */
        .alert { border-radius: var(--radius); padding: 14px 16px; margin-bottom: 16px; font-size: 13px; }
        .alert-error { background: var(--red-50); border: 1px solid #fecaca; color: var(--red-600); }
        .alert-success { background: var(--green-50); border: 1px solid var(--green-100); color: var(--green-700); }
        .alert-emergency { background: var(--red-50); border: 1px solid var(--red-500); color: var(--red-600); }
        .alert-emergency strong { display: block; font-size: 15px; margin-bottom: 8px; }
        .alert ul { margin: 8px 0 0 18px; }
        .alert li { margin-bottom: 3px; }

        /* Urgency badges */
        .urgency-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .urgency-high { background: #fee2e2; color: var(--red-600); }
        .urgency-medium { background: #fef3c7; color: #92400e; }
        .urgency-low { background: var(--green-100); color: var(--green-700); }
        .urgency-unknown { background: var(--slate-100); color: var(--slate-500); }

        /* Result sections */
        .result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .result-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--slate-100); }
        .result-section h4 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--slate-400); margin-bottom: 10px; }
        .result-section p, .result-section li { font-size: 14px; color: var(--slate-700); line-height: 1.6; }
        .result-section ul { padding-left: 18px; }
        .result-section li { margin-bottom: 4px; }
        .pet-profile { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; background: var(--slate-50); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px; }
        .pet-field { font-size: 13px; color: var(--slate-700); }
        .pet-field strong { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--slate-400); margin-bottom: 2px; }
        .disclaimer { font-size: 12px; color: var(--slate-400); font-style: italic; margin-top: 12px; }

        /* Follow-up */
        .followup-list { list-style: none; padding: 0; margin-bottom: 14px; }
        .followup-list li { padding: 8px 12px; background: var(--slate-50); border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 13px; color: var(--slate-700); border-left: 3px solid var(--green-500); }

        /* Search */
        .search-wrap { position: relative; margin-bottom: 8px; }
        .search-wrap input { width: 100%; padding: 9px 12px 9px 36px; border: 1px solid var(--slate-200); border-radius: var(--radius-sm); font-size: 14px; background: var(--white); outline: none; font-family: inherit; }
        .search-wrap input:focus { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(45,134,83,0.1); }
        .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--slate-400); font-size: 15px; pointer-events: none; }
        .search-meta { font-size: 12px; color: var(--slate-400); margin-bottom: 14px; }

        /* History */
        .history-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .import-label { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; cursor: pointer; background: var(--white); color: var(--slate-700); border: 1px solid var(--slate-200); transition: all 0.15s; font-family: inherit; }
        .import-label:hover { background: var(--slate-50); border-color: #cbd5e1; }
        .case-item { border: 1px solid var(--slate-200); border-radius: var(--radius); margin-bottom: 8px; overflow: hidden; transition: box-shadow 0.15s; background: var(--white); }
        .case-item:hover { box-shadow: var(--shadow-md); }
        .case-header { display: flex; align-items: center; gap: 10px; padding: 13px 16px; cursor: pointer; }
        .case-avatar { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .avatar-high { background: #fee2e2; }
        .avatar-medium { background: #fef3c7; }
        .avatar-low { background: var(--green-100); }
        .avatar-unknown { background: var(--slate-100); }
        .case-info { flex: 1; min-width: 0; }
        .case-name { font-size: 14px; font-weight: 600; color: var(--slate-800); }
        .case-symptoms { font-size: 12px; color: var(--slate-400); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .case-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .case-date { font-size: 12px; color: var(--slate-400); }
        .case-body { padding: 0 16px 16px; border-top: 1px solid var(--slate-100); }
        .case-body-inner { padding-top: 14px; }
        .followup-block { background: var(--slate-50); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap; font-size: 13px; color: var(--slate-700); }
        .empty { text-align: center; padding: 40px 20px; color: var(--slate-400); }
        .empty-icon { font-size: 36px; margin-bottom: 10px; }
        .empty p { font-size: 14px; }

        @media (max-width: 560px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .field-grid { grid-template-columns: 1fr; }
          .tab { padding: 6px 10px; font-size: 12px; }
          .case-right .case-date { display: none; }
        }
      `}</style>

      <div className="app">
        {/* ── Header ── */}
        <header className="header">
          <div className="header-left">
            <img src="/vetsai-icon.svg" alt="VetsAI" width={40} height={40} style={{ borderRadius: "10px", flexShrink: 0 }} />
            <div>
              <h1>VetsAI</h1>
              <div className="header-sub">Clinical decision support {subscription && <span style={{ marginLeft: 8, background: subscription.status === "active" ? "#97bc62" : "#e2e8f0", color: subscription.status === "active" ? "#1a3d2b" : "#64748b", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const }}>{subscription.plan} {subscription.status}</span>}</div><button
              style={{ fontSize: 12, padding: "6px 12px", background: "var(--slate-100)", border: "1px solid var(--slate-200)", borderRadius: 6, cursor: "pointer", color: "var(--slate-500)" }}
              onClick={async () => {
                const { supabase } = await import("@/lib/supabase");
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
            >
              Log out
            </button>
            <button
              onClick={(

              ) => toggleLang(lang === "en" ? "fr" : "en")}
              style={{ fontSize: 12, padding: "5px 10px", background: "var(--slate-100)", border: "1px solid var(--slate-200)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}
            >
              {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
            </div>
          </div>
          <div
  style={{
    display: "flex",
    gap: 10,
  }}
>
  <a
    href="/patients"
    style={{
      fontSize: 13,
      fontWeight: 500,
      color: "var(--slate)",
      textDecoration: "none",
      padding: "5px 10px",
    }}
      >
        📁 {t.patients}
      </a>

      <a
        href="/team"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--slate)",
          textDecoration: "none",
          padding: "5px 10px",
        }}
      >
        👥 {t.team}
            </a>
          <a href="/appointments" style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            📅 {t.appointments}
      </a>

      <a
        href="/lab"
        style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            🔬 Lab
          </a>
          <a
            href="/pharmacy"
        style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            💊 Pharmacy
          </a>
          <a
            href="/billing"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--slate)",
          textDecoration: "none",
          padding: "5px 10px",
        }}
      >
        💳 {t.billing}
            </a>
          <a href="/qr" style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            📱 {t.qr}
      </a>
    </div>
          <a href="/analytics" style={{ fontSize: 13, fontWeight: 500, color: "var(--slate-500)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, background: "var(--slate-100)" }}>
            📊 {t.analytics}
          </a>
          <div className="tab-bar">
            <button
              className={`tab ${tab === "new-case" ? "active" : ""}`}
              onClick={() => setTab("new-case")}
            >
              {t.newCase}
            </button>
            <button
              className={`tab ${tab === "history" ? "active" : ""}`}
              onClick={() => setTab("history")}
            >
              {t.caseHistory}
            </button>
          </div>
        </header>

        {/* ── Stats ── */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">{t.totalCases}</div>
            <div className="stat-value">{totalCases}</div>
          </div>
          <div className="stat-card high">
            <div className="stat-label">🔴 {t.high}</div>
            <div className="stat-value">{highCases}</div>
          </div>
          <div className="stat-card medium">
            <div className="stat-label">🟠 {t.medium}</div>
            <div className="stat-value">{mediumCases}</div>
          </div>
          <div className="stat-card low">
            <div className="stat-label">🟢 {t.low}</div>
            <div className="stat-value">{lowCases}</div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            NEW CASE TAB
            ════════════════════════════════════════ */}
        {tab === "new-case" && (
          <>
            {/* Alerts */}
            {error && (
              <div className="alert alert-error">⚠ {error}</div>
            )}
            {successMessage && (
              <div className="alert alert-success">✓ {successMessage}</div>
            )}

            {/* WOAH-notifiable alert */}
            {result && isWoahNotifiable(result) && (
              <div className="alert alert-emergency" style={{ background: "#fef2f2", border: "2px solid #dc2626" }}>
                <strong>⚠ WOAH-Notifiable Disease Suspected</strong>
                <p style={{ marginTop: 6, marginBottom: 0 }}>
                  One or more possible diagnoses for this case are notifiable under the WOAH Terrestrial Animal Health Code.
                  This case must be reported to your national Chief Veterinary Officer / Veterinary Council using the
                  "Report to Authorities (WOAH)" option below.
                </p>
              </div>
            )}
            {/* Emergency banner */}
            {result?.urgency === "high" && (
              <div className="alert alert-emergency">
                <strong>🚨 High Urgency Case</strong>
                This case has been flagged as high urgency based on the reported symptoms.
                <p style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>
                  <strong>Disclaimer:</strong> This AI-generated assessment is a clinical decision-support tool only and
                  does not replace professional veterinary judgment. The attending veterinarian bears full responsibility
                  for diagnosis, treatment decisions, and any regulatory reporting obligations arising from this case.
                </p>
              </div>
            )}

            {/* Result panel */}
            {result?.status === "completed" && (
              <div className="card">
                <div className="result-header">
                  <div className="card-title" style={{ marginBottom: 0 }}>Assessment</div>
                  <span className={`urgency-badge ${urgencyClass(result.urgency)}`}>
                    {cap(result.urgency)}
                  </span>
                </div>

                <div className="pet-profile">
                  {[
                    ["Name", petName],
                    ["Animal", animal],
                    ["Breed", breed],
                    ["Age", age],
                    ["Weight", weight],
                  ].map(([label, val]) => (
                    <div className="pet-field" key={label}>
                      <strong>{label}</strong>
                      {val || "Unknown"}
                    </div>
                  ))}
                </div>

                {result.recommendation && (
                  <div className="result-section">
                    <h4>Recommendation</h4>
                    <p>{result.recommendation}</p>
                  </div>
                )}

                {(result.possible_causes?.length ?? 0) > 0 && (
                  <div className="result-section">
                    <h4>Possible causes</h4>
                    <ul>
                      {result.possible_causes!.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(result.sources?.length ?? 0) > 0 && (
                  <div className="result-section">
                    <h4>Sources</h4>
                    <ul>
                      {result.sources!.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="result-section">
                  <h4>Location &amp; Timing</h4>
                  <p style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>
                    Species: {animal || "—"}
                  </p>
                  <p style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>
                    Date/time: {new Date().toLocaleString()}
                  </p>
                  {gpsLat != null && gpsLng != null ? (
                    <p style={{ fontSize: 13, color: "#334155" }}>
                      GPS: <a href={`https://maps.google.com/?q=${gpsLat},${gpsLng}`} target="_blank" rel="noopener noreferrer">
                        {gpsLat.toFixed(6)}, {gpsLng.toFixed(6)}
                      </a>
                      {locationSource ? ` (${locationSource === "device_gps" ? "device GPS" : "manual entry"})` : ""}
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, color: "#94a3b8" }}>GPS: Not captured</p>
                  )}
                </div>
                {dbCaseId && (
                  <div className="result-section">
                    <h4>Doctor's Treatment Notes</h4>
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                      Record your actual treatment decision here. This is saved separately from the AI's suggestions above and becomes part of the permanent case record.
                    </p>
                    <textarea
                      value={treatmentNotes}
                      onChange={(e) => setTreatmentNotes(e.target.value)}
                      placeholder="e.g. Administered amoxicillin 20mg/kg BID x7 days, advised owner on hydration..."
                      rows={4}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" as const, resize: "vertical" as const }}
                    />
                    <button
                      onClick={saveTreatmentNotes}
                      disabled={savingNotes || !treatmentNotes.trim()}
                      style={{ marginTop: 8, background: "#1a3d2b", color: "#fff", padding: "8px 18px", borderRadius: 7, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: (savingNotes || !treatmentNotes.trim()) ? 0.5 : 1 }}
                    >
                      {savingNotes ? "Saving…" : notesSaved ? "✓ Saved" : "Save Treatment Notes"}
                    </button>
                  </div>
                )}

                {(result.drug_notes?.length ?? 0) > 0 && (
                  <div className="result-section">
                    <h4>💊 Drug &amp; dosage notes</h4>
                    <ul>
                      {result.drug_notes!.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.soap_note && (
                  <div className="result-section">
                    <h4>📋 SOAP note draft</h4>
                    {(["subjective", "objective", "assessment", "plan"] as const).map((key) =>
                      result.soap_note![key] ? (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", color: "var(--slate-400)", marginBottom: 3 }}>
                            {key}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--slate-700)", background: "var(--slate-50)", padding: "8px 12px", borderRadius: 6, lineHeight: 1.6 }}>
                            {result.soap_note![key]}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                <p className="disclaimer">VetsAI Clinical AI — Cross-check all findings against current clinical guidelines and your professional judgment before proceeding with treatment. Drug dosages should be verified against species weight and manufacturer guidelines.</p>

                <div className="btn-row" style={{ marginTop: 20 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => printReport(result, { petName, animal, breed, age, weight }, treatmentNotes, gpsLat, gpsLng, new Date().toISOString())}
                  >
                    🖨 Print report
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadPDF(result, { petName, animal, breed, age, weight })}
                  >
                    ↓ Download report
                  </button>
                  {isWoahNotifiable(result) && (
                    <div style={{ width: "100%", marginTop: 12, padding: 14, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>
                        Veterinary Attestation (required before reporting)
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <input
                          type="text"
                          placeholder="Full name"
                          value={attestingVetName}
                          onChange={(e) => setAttestingVetName(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}
                        />
                        <input
                          type="text"
                          placeholder="Licence number"
                          value={attestingVetLicense}
                          onChange={(e) => setAttestingVetLicense(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}
                        />
                      </div>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#7f1d1d", marginBottom: 12, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={attestationConfirmed}
                          onChange={(e) => setAttestationConfirmed(e.target.checked)}
                          style={{ marginTop: 2 }}
                        />
                        I attest that I am a licensed veterinary professional and confirm the accuracy of this assessment
                        for the purpose of this WOAH disease notification.
                      </label>
                      <button
                        onClick={() => reportToAuthorities(result, { petName, animal, breed, age, weight }, treatmentNotes, gpsLat, gpsLng, new Date().toISOString())}
                        disabled={!attestingVetName.trim() || !attestingVetLicense.trim() || !attestationConfirmed}
                        style={{
                          background: "#dc2626", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8,
                          fontWeight: 700, fontSize: 13, cursor: (!attestingVetName.trim() || !attestingVetLicense.trim() || !attestationConfirmed) ? "not-allowed" : "pointer",
                          opacity: (!attestingVetName.trim() || !attestingVetLicense.trim() || !attestationConfirmed) ? 0.5 : 1,
                          display: "flex", alignItems: "center", gap: 8,
                        }}
                      >
                        ⚠ Report to Authorities (WOAH)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Follow-up panel */}
            {followUpQuestions.length > 0 && (
              <div className="card">
                <div className="card-title">{t.followUpQuestions}</div>
                <ul className="followup-list">
                  {followUpQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
                <div className="field">
                  <label>{t.yourAnswers}</label>
                  <textarea
                    placeholder="Answer each question above…"
                    value={followUpAnswers}
                    onChange={(e) => setFollowUpAnswers(e.target.value)}
                  />
                </div>
                <div className="btn-row">
                  <button
                    className="btn btn-primary"
                    onClick={handleFollowUp}
                    disabled={loading}
                  >
                    {loading ? t.submitting : t.submitAnswers}
                  </button>
                </div>
              </div>
            )}

            {/* Main form — hide when waiting for follow-up answers */}
            {!caseId && (
              <div className="card">
                <div className="card-title">{t.patientInfo}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["pets", "poultry", "livestock"].map(f => (
                  <button key={f} onClick={() => { setSpeciesType(f); setVaccinationHistory([]); setFlockSize(''); setBirdsDead(''); setAnimal(''); setBreed(''); setAge(''); setWeight(''); setPetName(''); }} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: speciesType === f ? 700 : 400, background: speciesType === f ? "#1a3d2b" : "#e2e8f0", color: speciesType === f ? "#fff" : "#64748b", fontSize: 13 }}>
                    {f === "pets" ? "Pets" : f === "poultry" ? "Poultry" : "Livestock"}
                  </button>
                ))}
              </div>
                <div className="field-grid">
                  <div className="field">
                    <label>
                      {t.animalType} <span style={{ color: "var(--red-500)" }}>*</span>
                    </label>
                    <input
                      placeholder={t.placeholderAnimal}
                      value={animal}
                      onChange={(e) => setAnimal(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.petName}</label>
                    <input
                      placeholder={t.placeholderPetName}
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.breed}</label>
                    <input
                      placeholder={t.placeholderBreed}
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.age}</label>
                    <input
                      placeholder={t.placeholderAge}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.weight}</label>
                    <input
                      placeholder={t.placeholderWeight}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  {(speciesType === "poultry" || speciesType === "pets" || speciesType === "livestock") && (
                    <div className="field field-full">
                      <label>{lang === "fr" ? "Vaccins administres" : "Vaccination history"}</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                        {(speciesType === "pets"
                          ? ["Rabies", "Distemper (CDV)", "Parvovirus (CPV)", "Hepatitis (CAV)", "Leptospirosis", "Bordetella", "Feline Herpesvirus (FHV)", "Feline Calicivirus (FCV)", "Feline Panleukopenia (FPV)", "Not vaccinated", "Unknown"]
                          : speciesType === "poultry"
                          ? ["Newcastle Disease", "Gumboro (IBD)", "Infectious Bronchitis", "Mareks Disease", "Fowlpox", "Avian Influenza", "Not vaccinated", "Unknown"]
                          : ["FMD (Foot & Mouth)", "Anthrax", "Blackleg", "Brucellosis", "PPR", "Lumpy Skin Disease", "Rabies", "Not vaccinated", "Unknown"]
                        ).map(v => (
                          <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", background: vaccinationHistory.includes(v) ? "#e8f5e9" : "#f8fafc", border: "1px solid " + (vaccinationHistory.includes(v) ? "#1a3d2b" : "#e2e8f0"), borderRadius: 6, padding: "5px 10px" }}>
                            <input type="checkbox" checked={vaccinationHistory.includes(v)} onChange={e => setVaccinationHistory(prev => e.target.checked ? [...prev, v] : prev.filter(x => x !== v))} />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {speciesType === "poultry" && (
                    <>
                      <div className="field">
                        <label>{lang === "fr" ? "Taille du troupeau (total)" : "Flock size (total birds)"}</label>
                        <input placeholder="e.g. 500" value={flockSize} onChange={e => setFlockSize(e.target.value)} />
                      </div>
                      <div className="field">
                        <label>{lang === "fr" ? "Oiseaux morts / affectés" : "Birds dead / affected"}</label>
                        <input placeholder="e.g. 45 dead, 120 affected" value={birdsDead} onChange={e => setBirdsDead(e.target.value)} />
                      </div>
                    </>
                  )}
                  <div className="field field-full">
                    <label>
                      {t.symptoms} <span style={{ color: "var(--red-500)" }}>*</span>
                    </label>
                    <textarea
                      placeholder={t.placeholderSymptoms}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </div>
                </div>
                <div className="btn-row">
                  {locationCapturing && (
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>📍 Getting location…</p>
                  )}
                  {gpsLat !== null && gpsLng !== null && (
                    <p style={{ fontSize: 12, color: "#2d6b47", marginBottom: 8 }}>
                      📍 Location captured ({locationSource === "device_gps" ? "GPS" : "manual"})
                    </p>
                  )}
                  {showManualLocation && gpsLat === null && (
                    <div style={{ marginBottom: 10, padding: 10, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                        Couldn't get device location. Enter coordinates manually (optional), or leave blank to submit without location.
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          placeholder="Latitude, e.g. 5.6037"
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          style={{ flex: 1, padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}
                        />
                        <input
                          type="text"
                          placeholder="Longitude, e.g. -0.1870"
                          value={manualLng}
                          onChange={(e) => setManualLng(e.target.value)}
                          style={{ flex: 1, padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const lat = parseFloat(manualLat);
                            const lng = parseFloat(manualLng);
                            if (!isNaN(lat) && !isNaN(lng)) {
                              setGpsLat(lat);
                              setGpsLng(lng);
                              setLocationSource("manual");
                            }
                          }}
                          style={{ padding: "8px 14px", background: "#1a3d2b", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? t.analyzing : t.analyzeCase}
                  </button>
                  <button className="btn btn-secondary" onClick={resetForm}>
                    Clear
                  </button>
                </div>
              </div>
            )}

            {(result || caseId) && (
              <button className="btn btn-secondary" onClick={resetForm}>
                {t.startNewCase}
              </button>
            )}
          </>
        )}

        {/* ════════════════════════════════════════
            HISTORY TAB
            ════════════════════════════════════════ */}
        {tab === "history" && (
          <div className="card">
            {/* Alerts inside history tab */}
            {successMessage && (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                ✓ {successMessage}
              </div>
            )}

            <div className="history-actions">
              <button className="btn btn-secondary" onClick={exportCases}>
                ↓ Export
              </button>
              <label className="import-label" htmlFor="importCases">
                ↑ Import
              </label>
              <input
                id="importCases"
                type="file"
                accept=".json"
                onChange={handleImportCases}
                style={{ display: "none" }}
              />
              <button
                className="btn btn-secondary"
                style={{ color: "var(--red-500)", borderColor: "#fecaca" }}
                onClick={clearHistory}
              >
                Clear all
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["all", "pets", "poultry", "livestock"].map(f => (
                <button key={f} onClick={() => setCaseFilterType(f)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: caseFilterType === f ? 700 : 400, background: caseFilterType === f ? "#1a3d2b" : "#e2e8f0", color: caseFilterType === f ? "#fff" : "#64748b", fontSize: 13 }}>
                  {f === "all" ? "All" : f === "pets" ? "🐾 Pets" : f === "poultry" ? "🐔 Poultry" : "🐄 Livestock"}
                </button>
              ))}
            </div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                placeholder={t.placeholderSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="search-meta">
              Showing {filteredHistory.length} of {caseHistory.length} case
              {caseHistory.length !== 1 ? "s" : ""}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    marginLeft: 8,
                    background: "none",
                    border: "none",
                    color: "var(--green-500)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {!historyLoaded ? (
              <p style={{ color: "var(--slate-400)", fontSize: 14 }}>
                Loading history…
              </p>
            ) : filteredHistory.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <p>
                  {caseHistory.length === 0
                    ? "No cases yet. Start by analyzing a new case."
                    : "No cases match your search."}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const u = item.urgency ?? "unknown";
                const isOpen = expandedCase === item.id;
                const date = new Date(item.createdAt).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" }
                );
                return (
                  <div className="case-item" key={item.id}>
                    <div
                      className="case-header"
                      onClick={() =>
                        setExpandedCase(isOpen ? null : item.id)
                      }
                    >
                      <div className={`case-avatar avatar-${u}`}>
                        {animalEmoji(item.animal)}
                      </div>
                      <div className="case-info">
                        <div className="case-name">
                          {item.petName || item.animal}
                        </div>
                        <div className="case-symptoms">{item.symptoms}</div>
                      </div>
                      <div className="case-right">
                        <span className={`urgency-badge ${urgencyClass(u)}`}>
                          {cap(u)}
                        </span>
                        <span className="case-date">{date}</span>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!window.confirm("Delete this case?")) return;
                            const updated = caseHistory.filter(
                              (c) => c.id !== item.id
                            );
                            persistHistory(updated);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="case-body">
                        <div className="case-body-inner">
                          <div className="pet-profile">
                            {[
                              [item.species_type === "poultry" ? (lang === "fr" ? "Nom de la ferme" : "Farm name") : item.species_type === "livestock" ? (lang === "fr" ? "Identifiant" : "Animal ID") : (lang === "fr" ? "Nom" : "Name"), item.petName],
                              [item.species_type === "poultry" ? (lang === "fr" ? "Type d'oiseau" : "Bird type") : (lang === "fr" ? "Animal" : "Animal"), item.animal],
                              [item.species_type === "poultry" ? (lang === "fr" ? "Race / Souche" : "Breed / Strain") : (lang === "fr" ? "Race" : "Breed"), item.breed],
                              [item.species_type === "poultry" ? (lang === "fr" ? "Taille du troupeau" : "Flock size") : (lang === "fr" ? "Âge" : "Age"), item.age],
                              [item.species_type === "poultry" ? (lang === "fr" ? "Oiseaux affectés" : "Birds affected") : (lang === "fr" ? "Poids" : "Weight"), item.weight],
                            ].map(([label, val]) => (
                              <div className="pet-field" key={label}>
                                <strong>{label}</strong>
                                {val || "—"}
                              </div>
                            ))}
                          </div>

                          <div className="result-section">
                            <h4>Recommendation</h4>
                            <p>{item.recommendation || "—"}</p>
                          </div>

                          {(item.possible_causes?.length ?? 0) > 0 && (
                            <div className="result-section">
                              <h4>Possible causes</h4>
                              <ul>
                                {item.possible_causes!.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(item.sources?.length ?? 0) > 0 && (
                            <div className="result-section">
                              <h4>Sources</h4>
                              <ul>
                                {item.sources!.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(item.drug_notes?.length ?? 0) > 0 && (
                            <div className="result-section">
                              <h4>💊 Drug &amp; dosage notes</h4>
                              <ul>
                                {item.drug_notes!.map((note, i) => (
                                  <li key={i}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.soap_note && (
                            <div className="result-section">
                              <h4>📋 SOAP note draft</h4>
                              {(["subjective", "objective", "assessment", "plan"] as const).map((key) =>
                                item.soap_note![key] ? (
                                  <div key={key} style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", color: "var(--slate-400)", marginBottom: 3 }}>
                                      {key}
                                    </div>
                                    <div style={{ fontSize: 13, color: "var(--slate-700)", background: "var(--slate-50)", padding: "8px 12px", borderRadius: 6, lineHeight: 1.6 }}>
                                      {item.soap_note![key]}
                                    </div>
                                  </div>
                                ) : null
                              )}
                            </div>
                          )}

                          {item.followUpAnswers && (
                            <div className="result-section">
                              <h4>Follow-up answers</h4>
                              <div className="followup-block">
                                {item.followUpAnswers}
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              marginTop: 12,
                              fontSize: 12,
                              color: "var(--slate-400)",
                            }}
                          >
                            {new Date(item.createdAt).toLocaleString()}
                          </div>

                          <div className="btn-row" style={{ marginTop: 14 }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => printReport(item, {
                                petName: item.petName || "",
                                animal: item.animal,
                                breed: item.breed || "",
                                age: item.age || "",
                                weight: item.weight || "",
                              }, item.vet_treatment_notes ?? "", item.gps_lat ?? null, item.gps_lng ?? null, item.createdAt)}
                            >
                              🖨 Print report
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => downloadPDF(item, {
                                petName: item.petName || "",
                                animal: item.animal,
                                breed: item.breed || "",
                                age: item.age || "",
                                weight: item.weight || "",
                              })}
                            >
                              ↓ Download report
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}