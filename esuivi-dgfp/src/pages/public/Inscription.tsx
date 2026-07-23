import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../../layouts/AuthSplitLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import { useAuth } from "../../services/auth";
import type { LoginResponse } from "../../types/api";

interface FormState {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  telephone: string;
  password: string;
  password_confirmation: string;
}

const initialState: FormState = {
  nom: "",
  prenom: "",
  matricule: "",
  email: "",
  telephone: "",
  password: "",
  password_confirmation: "",
};

export default function Inscription() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.password_confirmation) {
      setErrors({
        password_confirmation:
          "La confirmation ne correspond pas au mot de passe.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/register", form);
      login(data.user, data.token, "agent");
      navigate("/agent/tableau-de-bord");
    } catch (err: any) {
      const message = extraireErreur(
        err,
        "Une erreur est survenue lors de l'inscription."
      );
      setErrors({ global: message });
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
      <h2 className="text-2xl font-bold text-navy-950">Créer votre compte</h2>
      <p className="mt-2 text-sm text-slate-500">
        Renseignez vos informations pour accéder à votre espace personnel.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        {errors.global && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {errors.global}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nom"
            required
            placeholder="Votre nom de famille"
            value={form.nom}
            onChange={handleChange("nom")}
          />
          <Input
            label="Prénom"
            required
            placeholder="Vos prénoms"
            value={form.prenom}
            onChange={handleChange("prenom")}
          />
        </div>

        <Input
          label="Matricule"
          required
          placeholder="Votre numéro matricule"
          value={form.matricule}
          onChange={handleChange("matricule")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            required
            placeholder="Votre adresse mail"
            value={form.email}
            onChange={handleChange("email")}
          />
          <Input
            label="Téléphone"
            required
            placeholder="Votre numéro de téléphone"
            value={form.telephone}
            onChange={handleChange("telephone")}
          />
        </div>

        <Input
          label="Mot de passe"
          type="password"
          required
          value={form.password}
          onChange={handleChange("password")}
        />

        <Input
          label="Confirmation du mot de passe"
          type="password"
          required
          placeholder="Retapez votre mot de passe"
          value={form.password_confirmation}
          onChange={handleChange("password_confirmation")}
          error={errors.password_confirmation}
        />

        <Button type="submit" fullWidth disabled={loading} className="mt-2">
          {loading ? "Inscription en cours…" : "S'inscrire"}
        </Button>

        <p className="text-center text-xs text-slate-400">
          * Champs obligatoires
        </p>

        <p className="text-center text-sm text-slate-500">
          Vous avez déjà un compte ?{" "}
          <Link to="/connexion" className="font-semibold text-navy-950">
            Se connecter
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
