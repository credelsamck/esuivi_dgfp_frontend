import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import AgentLayout from "../../layouts/AgentLayout";
import Timeline from "../../components/Timeline";
import api from "../../services/api";
import type { Dossier } from "../../types/api";

export default function MesDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<Dossier[]>("/agent/dossiers")
      .then((res) => {
        if (!cancelled) setDossiers(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger vos dossiers.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AgentLayout>
      <h1 className="text-3xl font-bold text-navy-950">Mes dossiers</h1>
      <p className="mt-1 text-slate-500">
        Suivez en temps réel l'avancement de vos dossiers de carrière.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-8 flex flex-col gap-5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : dossiers.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FolderOpen className="h-6 w-6 text-slate-400" />
          </span>
          <p className="mt-4 text-slate-400">
            Vous n'avez actuellement aucun dossier à suivre.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {dossiers.map((dossier) => (
            <div
              key={dossier.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-lg font-bold text-navy-950">
                    {dossier.numero_dossier}
                  </p>
                  <p className="text-sm text-slate-500">
                    {dossier.type_demande}
                  </p>
                </div>

                {dossier.statut === "rejete" && (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    Rejeté
                  </span>
                )}
              </div>

              <div className="pt-6">
                {dossier.statut === "rejete" ? (
                  <p className="text-sm text-slate-500">
                    Ce dossier a été rejeté. Vous pouvez déposer une
                    réclamation si vous estimez qu'il s'agit d'une erreur.
                  </p>
                ) : (
                  <Timeline
                    statutActuel={dossier.statut}
                    historique={dossier.historique_statuts}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AgentLayout>
  );
}
