import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, AlertTriangle } from "lucide-react";
import GestionnaireLayout from "../../layouts/GestionnaireLayout";
import StatCard from "../../components/StatCard";
import api from "../../services/api";
import type { GestionnaireDashboard } from "../../types/api";

export default function TableauDeBordGestionnaire() {
  const [data, setData] = useState<GestionnaireDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    api
      .get<GestionnaireDashboard>("/gestionnaire/dashboard")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Impossible de charger le tableau de bord.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GestionnaireLayout>
      <h1 className="text-3xl font-bold text-navy-950">Tableau de bord</h1>
      <p className="mt-1 text-slate-500">
        Vue d'ensemble des dossiers et réclamations à traiter.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {loading ? (
          <>
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </>
        ) : (
          <>
            <StatCard
              icon={Folder}
              iconBg="bg-blue-500"
              label="Dossiers en cours"
              value={data?.dossiers_en_cours ?? 0}
              onClick={() => navigate("/gestionnaire/dossiers")}
            />
            <StatCard
              icon={AlertTriangle}
              iconBg="bg-gold-500"
              label="Réclamations en attente"
              value={data?.reclamations_en_attente ?? 0}
              onClick={() => navigate("/gestionnaire/reclamations")}
            />
          </>
        )}
      </div>
    </GestionnaireLayout>
  );
}
