import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";
import api from "../../services/api";
import type { AdminDashboard } from "../../types/api";

export default function TableauDeBordAdmin() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    api
      .get<AdminDashboard>("/admin/dashboard")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger le tableau de bord.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-navy-950">Tableau de bord</h1>
      <p className="mt-1 text-slate-500">
        Vue d'ensemble des comptes de la plateforme.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))
        ) : (
          <>
            <StatCard
              icon={Users}
              iconBg="bg-blue-500"
              label="Agents"
              value={data?.total_agents ?? 0}
            />
            <StatCard
              icon={ShieldCheck}
              iconBg="bg-purple-500"
              label="Gestionnaires"
              value={data?.total_gestionnaires ?? 0}
            />
            <StatCard
              icon={UserCheck}
              iconBg="bg-emerald-500"
              label="Comptes actifs"
              value={data?.comptes_actifs ?? 0}
            />
            <StatCard
              icon={UserX}
              iconBg="bg-red-500"
              label="Comptes inactifs"
              value={data?.comptes_inactifs ?? 0}
            />
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/admin/utilisateurs")}
        className="mt-8 flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950">
          <Users className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="font-bold text-navy-950">Gestion des utilisateurs</p>
          <p className="text-sm text-slate-500">
            Créer, modifier ou désactiver des comptes agents et gestionnaires.
          </p>
        </div>
      </button>
    </AdminLayout>
  );
}
