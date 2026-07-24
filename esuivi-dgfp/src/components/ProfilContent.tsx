import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Phone, Hash } from "lucide-react";
import api from "../services/api";
import type { User } from "../types/api";

export default function ProfilContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<User>("/me")
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger votre profil.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (error || !user) {
    return (
      <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
        {error || "Profil introuvable."}
      </p>
    );
  }

  const champs = [
    { icon: UserIcon, label: "Nom complet", value: `${user.prenom} ${user.nom}` },
    { icon: Mail, label: "Email", value: user.email },
    ...(user.matricule
      ? [{ icon: Hash, label: "Matricule", value: user.matricule }]
      : []),
    ...(user.telephone
      ? [{ icon: Phone, label: "Téléphone", value: user.telephone }]
      : []),
  ];

  return (
    <div className="mt-8 max-w-xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-950 text-xl font-bold text-white">
          {user.prenom[0]}
          {user.nom[0]}
        </span>
        <div>
          <p className="text-lg font-bold text-navy-950">
            {user.prenom} {user.nom}
          </p>
          <span
            className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              user.statut_compte === "actif"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {user.statut_compte === "actif" ? "Compte actif" : "Compte inactif"}
          </span>
        </div>
      </div>

      <dl className="mt-6 flex flex-col gap-4">
        {champs.map((champ) => (
          <div key={champ.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <champ.icon className="h-4 w-4 text-slate-500" />
            </span>
            <div>
              <dt className="text-xs text-slate-400">{champ.label}</dt>
              <dd className="text-sm font-medium text-navy-950">
                {champ.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-xs text-slate-400">
        La modification de ces informations n'est pas encore disponible.
      </p>
    </div>
  );
}
