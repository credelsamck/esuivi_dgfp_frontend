import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import AgentLayout from "../../layouts/AgentLayout";
import StatCard from "../../components/StatCard";
import { DossierStatutBadge } from "../../components/StatutBadge";
import api from "../../services/api";
import type { AgentDashboard } from "../../types/agent";

export default function TableauDeBordAgent() {
  const [data, setData] = useState<AgentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<AgentDashboard>("/agent/dashboard")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Impossible de charger votre tableau de bord.");
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
      <h1 className="text-3xl font-bold text-navy-950">Tableau de bord</h1>
      <p className="mt-1 text-slate-500">
        Vue d'ensemble de vos dossiers et réclamations.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <StatCard
            icon={Folder}
            iconBg="bg-blue-500"
            label="Total des dossiers"
            value={data?.total ?? 0}
          />
          <StatCard
            icon={Clock}
            iconBg="bg-gold-500"
            label="En cours"
            value={data?.en_cours ?? 0}
          />
          <StatCard
            icon={CheckCircle2}
            iconBg="bg-emerald-500"
            label="Prêts"
            value={data?.valides ?? 0}
          />
          <StatCard
            icon={XCircle}
            iconBg="bg-red-500"
            label="Rejetés"
            value={data?.rejetes ?? 0}
          />
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-950">
            Derniers dossiers
          </h2>
          <Link
            to="/agent/dossiers"
            className="flex items-center gap-1 text-sm font-semibold text-navy-950"
          >
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4">
          {!loading && (!data?.derniers_dossiers?.length ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Vous n'avez actuellement aucun dossier à suivre.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.derniers_dossiers.map((dossier) => (
                <li
                  key={dossier.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-semibold text-navy-950">
                      {dossier.numero_dossier}
                    </p>
                    <p className="text-sm text-slate-500">
                      {dossier.type_demande}
                    </p>
                  </div>
                  <DossierStatutBadge statut={dossier.statut} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </AgentLayout>
  );
}

