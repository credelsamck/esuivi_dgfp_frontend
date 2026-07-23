import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Folder, AlertTriangle, HelpCircle, Shield } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../services/auth";

const NAV_ITEMS = [
  { to: "/gestionnaire/tableau-de-bord", label: "Tableau de bord", icon: Home },
  { to: "/gestionnaire/dossiers", label: "Gestion des dossiers", icon: Folder },
  {
    to: "/gestionnaire/reclamations",
    label: "Gestion des réclamations",
    icon: AlertTriangle,
  },
];

export default function GestionnaireLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-[76px] items-center justify-between px-6">
          <Logo to="/gestionnaire/tableau-de-bord" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Gestionnaire DGFP</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950">
              <HelpCircle className="h-4 w-4 text-white" />
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-76px)] w-64 border-r border-slate-200 px-4 py-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Espace
          </p>
          <p className="mb-4 px-4 text-sm font-bold text-navy-950">
            Gestionnaire DGFP
          </p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-navy-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin/tableau-de-bord"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-navy-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Shield className="h-4 w-4" />
                Administration
              </NavLink>
            )}
          </nav>
        </aside>

        <main className="flex-1 bg-[#F8F9FA] px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
