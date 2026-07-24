import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, User, LogOut } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../services/auth";

const NAV_ITEMS = [
  { to: "/admin/tableau-de-bord", label: "Tableau de bord", icon: Home },
  { to: "/admin/utilisateurs", label: "Gestion des utilisateurs", icon: Users },
  { to: "/admin/profil", label: "Mon profil", icon: User },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/connexion-personnel");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-[76px] items-center justify-between px-6">
          <Logo to="/admin/tableau-de-bord" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Administrateur</span>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-76px)] w-64 border-r border-slate-200 px-4 py-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Espace
          </p>
          <p className="mb-4 px-4 text-sm font-bold text-navy-950">
            Administrateur
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
          </nav>
        </aside>

        <main className="flex-1 bg-[#F8F9FA] px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
