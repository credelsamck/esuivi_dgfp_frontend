import type { StatutDossier, StatutReclamation } from "../types/api";
import { ETAPES_DOSSIER } from "../types/api";

const DOSSIER_LABELS: Record<StatutDossier, string> = {
  numerisation: "Numérisation",
  indexation: "Indexation",
  en_cours_traitement: "En cours de traitement",
  mandatement: "Mandatement",
  validation: "Validation",
  approuve_dg: "Approuvé par le DG",
  pret: "Prêt",
  rejete: "Rejeté",
};

const RECLAMATION_LABELS: Record<StatutReclamation, string> = {
  en_attente: "En attente",
  validee: "Validée",
  rejetee: "Rejetée",
};

function toneClasses(tone: "success" | "warning" | "danger" | "neutral") {
  switch (tone) {
    case "success":
      return "bg-emerald-50 text-emerald-700";
    case "warning":
      return "bg-amber-50 text-amber-700";
    case "danger":
      return "bg-red-50 text-red-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function DossierStatutBadge({ statut }: { statut: StatutDossier }) {
  const tone =
    statut === "rejete"
      ? "danger"
      : statut === "pret"
      ? "success"
      : "warning";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses(
        tone
      )}`}
    >
      {DOSSIER_LABELS[statut]}
    </span>
  );
}

export function ReclamationStatutBadge({
  statut,
}: {
  statut: StatutReclamation;
}) {
  const tone =
    statut === "validee"
      ? "success"
      : statut === "rejetee"
      ? "danger"
      : "warning";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses(
        tone
      )}`}
    >
      {RECLAMATION_LABELS[statut]}
    </span>
  );
}

export { DOSSIER_LABELS, RECLAMATION_LABELS, ETAPES_DOSSIER };
