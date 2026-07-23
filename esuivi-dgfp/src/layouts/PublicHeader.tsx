import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

export default function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#fonctionnalites"
            className="text-sm font-medium text-slate-600 hover:text-navy-950"
          >
            Fonctionnalités
          </a>
          <a
            href="#etapes"
            className="text-sm font-medium text-slate-600 hover:text-navy-950"
          >
            Comment ça marche
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/connexion">
            <Button variant="outline">Connexion</Button>
          </Link>
          <Link to="/inscription">
            <Button variant="primary">S'inscrire</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
