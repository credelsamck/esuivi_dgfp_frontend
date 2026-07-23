import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Folder, AlertTriangle, User, HelpCircle } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../services/auth";

const NAV_ITEMS = [
  { to: "/agent/tableau-de-bord", label: "Tableau de bord", icon: Home },
  { to: "/agent/dossiers", label: "Mes dossiers", icon: Folder },
  { to: "/agent/reclamations/nouvelle", label: "Réclamations", icon: AlertTriangle },
];

export default function AgentLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-[76px] items-center justify-between px-6">
          <Logo to="/agent/tableau-de-bord" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {user?.matricule
                ? `Matricule ${user.matricule}`
                : "Matricule non renseigné"}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950">
              <HelpCircle className="h-4 w-4 text-white" />
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-76px)] w-60 border-r border-slate-200 bg-white px-4 py-6">
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
            <span className="mt-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300">
              <User className="h-4 w-4" />
              Mon profil
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Bientôt
              </span>
            </span>
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
