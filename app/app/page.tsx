"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      supabase.from("subscriptions").select("plan,status").eq("user_id", user.id).single().then(({ data }) => {
        if (data) setSubscription(data);
      });
    });
  }, []);
  // Form fields
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
    animalType: lang === "fr" ? "Type d'animal" : "Animal type",
    petName: lang === "fr" ? "Nom de l'animal" : "Pet name",
    breed: lang === "fr" ? "Race" : "Breed",
    age: lang === "fr" ? "Âge" : "Age",
    weight: lang === "fr" ? "Poids" : "Weight",
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
    placeholderAnimal: lang === "fr" ? "Chien, chat, lapin…" : "Dog, cat, rabbit…",
    placeholderPetName: lang === "fr" ? "Buddy" : "Buddy",
    placeholderBreed: lang === "fr" ? "Labrador, Persan…" : "Labrador, Persian…",
    placeholderAge: lang === "fr" ? "3 ans" : "3 years",
    placeholderWeight: lang === "fr" ? "12 kg" : "12 kg",
    placeholderSymptoms: lang === "fr" ? "Décrivez ce que vous avez observé — comportement, signes physiques, durée…" : "Describe what you've observed — behaviour, physical signs, duration…",
    placeholderSearch: lang === "fr" ? "Rechercher par animal, espèce ou symptômes…" : "Search by pet, animal, or symptoms…",
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
    };
    setCaseHistory((prev) => {
      const updated = [newCase, ...prev];
      localStorage.setItem("caseHistory", JSON.stringify(updated));
      return updated;
    });
    // Also save to Supabase
    console.log("Saving case to Supabase...");
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log("User for case save:", user?.id);
      if (user) {
        supabase.from("cases").insert({
          user_id: user.id,
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
        }).then(({ error }) => { if (error) console.error("Case save error:", error); });
      }
    });
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
    setFollowUpQuestions([]);
    setFollowUpAnswers("");
  };

  const handleSubmit = async () => {
    if (!animal.trim() || !symptoms.trim()) {
      setError(t.errorRequired);
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/backend/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal: animal.trim(),
          symptoms: symptoms.trim(),
          pet_name: petName.trim(),
          breed: breed.trim(),
          age: age.trim(),
          weight: weight.trim(),
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
      const res = await fetch("/backend/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          animal: animal.trim(),
          symptoms: symptoms.trim(),
          follow_up_answers: followUpAnswers.trim(),
          pet_name: petName.trim(),
          breed: breed.trim(),
          age: age.trim(),
          weight: weight.trim(),
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

  const buildReportHTML = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }) => {
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

  <div class="disclaimer">${data.disclaimer || "This report is not a substitute for professional veterinary advice. Always consult a licensed veterinarian."}</div>
</body>
</html>`;
  };

  const printReport = (data: ApiResult | CaseHistoryItem, petData: { petName: string; animal: string; breed: string; age: string; weight: string }) => {
    const html = buildReportHTML(data, petData);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
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

            {/* Emergency banner */}
            {result?.urgency === "high" && (
              <div className="alert alert-emergency">
                <strong>🚨 Emergency: Seek immediate veterinary care</strong>
                This case has been flagged as high urgency based on the symptoms provided.
                <ul>
                  <li>Contact a veterinarian immediately</li>
                  <li>Do not give medication unless instructed</li>
                  <li>Keep the animal calm and safe</li>
                  <li>Prepare to visit the nearest clinic</li>
                </ul>
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

                {result.disclaimer && (
                  <p className="disclaimer">{result.disclaimer}</p>
                )}

                <div className="btn-row" style={{ marginTop: 20 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => printReport(result, { petName, animal, breed, age, weight })}
                  >
                    🖨 Print report
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadPDF(result, { petName, animal, breed, age, weight })}
                  >
                    ↓ Download report
                  </button>
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
                      placeholder="Buddy"
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
                              ["Name", item.petName],
                              ["Animal", item.animal],
                              ["Breed", item.breed],
                              ["Age", item.age],
                              ["Weight", item.weight],
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
                              })}
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