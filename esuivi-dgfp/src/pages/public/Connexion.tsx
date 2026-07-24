import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../../layouts/AuthSplitLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import { useAuth } from "../../services/auth";
import type { LoginResponse } from "../../types/api";

export default function Connexion() {
  const [identifiant, setIdentifiant] = useState("");
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
      const { data } = await api.post<LoginResponse>("/login", {
        identifiant,
        password,
      });
      login(data.user, data.token, "agent");
      navigate("/agent/tableau-de-bord");
    } catch (err: any) {
      setError(extraireErreur(err, "Identifiants incorrects."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      eyebrow="Bienvenue"
      title="Suivez vos dossiers de carrière en toute transparence."
      subtitle="Un accès sécurisé à vos informations, disponible partout, à tout moment."
    >
      <h2 className="text-2xl font-bold text-navy-950">Se connecter</h2>
      <p className="mt-2 text-sm text-slate-500">
        Accédez à votre espace personnel pour suivre vos dossiers.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Input
          label="Email ou matricule"
          required
          placeholder="Votre adresse mail ou matricule"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
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

        <p className="text-center text-sm text-slate-500">
          Vous n'avez pas de compte ?{" "}
          <Link to="/inscription" className="font-semibold text-navy-950">
            S'inscrire
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
