import { Check } from "lucide-react";
import { ETAPES_DOSSIER } from "../types/api";
import type { HistoriqueStatut, StatutDossier } from "../types/api";

interface TimelineProps {
  statutActuel: StatutDossier;
  historique?: HistoriqueStatut[];
}

export default function Timeline({ statutActuel, historique = [] }: TimelineProps) {
  const atteintes = new Set(historique.map((h) => h.nouveau_statut));
  const indexActuel = ETAPES_DOSSIER.findIndex((e) => e.key === statutActuel);

  return (
    <ol className="flex flex-col gap-0">
      {ETAPES_DOSSIER.map((etape, index) => {
        const estComplete = atteintes.has(etape.key) || index < indexActuel;
        const estActuelle = etape.key === statutActuel;
        const estFuture = !estComplete && !estActuelle;
        const estDerniere = index === ETAPES_DOSSIER.length - 1;

        return (
          <li key={etape.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  estActuelle
                    ? "bg-gold-500 text-white"
                    : estComplete
                    ? "bg-navy-950 text-white"
                    : "border-2 border-slate-200 bg-white text-slate-300"
                }`}
              >
                {estComplete && !estActuelle ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              {!estDerniere && (
                <span
                  className={`w-0.5 flex-1 ${
                    estComplete ? "bg-navy-950" : "bg-slate-200"
                  }`}
                  style={{ minHeight: "2.25rem" }}
                />
              )}
            </div>
            <div className={estDerniere ? "pb-0" : "pb-8"}>
              <p
                className={`text-sm font-semibold ${
                  estFuture ? "text-slate-400" : "text-navy-950"
                }`}
              >
                {etape.label}
              </p>
              {estActuelle && (
                <p className="mt-0.5 text-xs font-medium text-gold-500">
                  Étape en cours
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
