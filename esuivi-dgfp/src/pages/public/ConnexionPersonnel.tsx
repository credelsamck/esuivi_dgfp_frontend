import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import { useAuth } from "../../services/auth";
import type { LoginResponse } from "../../types/api";

export default function ConnexionPersonnel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/admin/login", {
        email,
        password,
      });
      const role = data.role ?? data.user.role;
      login(data.user, data.token, role);

      if (role === "gestionnaire") {
        navigate("/gestionnaire/tableau-de-bord");
      } else {
        navigate("/admin/tableau-de-bord");
      }
    } catch (err: any) {
      setError(extraireErreur(err, "Identifiants incorrects."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-navy-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-6 pt-20">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <Lock className="h-3.5 w-3.5" />
          Accès restreint
        </span>

        <h1 className="mt-5 text-3xl font-bold text-navy-950">
          Connexion personnel DGFP
        </h1>
        <p className="mt-2 text-slate-500">
          Authentifiez-vous avec vos identifiants.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            required
            placeholder="Votre adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading} className="mt-2">
            {loading ? "Connexion en cours…" : "Se connecter"}
          </Button>

          <p className="text-center text-xs text-slate-400">
            * Champs obligatoires
          </p>
        </form>
      </main>
    </div>
  );
}
