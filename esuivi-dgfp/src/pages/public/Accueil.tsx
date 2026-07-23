import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Mail, Clock, Folder, Flag } from "lucide-react";
import PublicHeader from "../../layouts/PublicHeader";
import Button from "../../components/Button";

const FEATURES = [
  {
    icon: Folder,
    iconBg: "bg-blue-500",
    title: "Suivi de dossier",
    description:
      "Visualisez en temps réel l'avancement de chaque dossier, étape par étape.",
  },
  {
    icon: Flag,
    iconBg: "bg-gold-500",
    title: "Réclamations",
    description:
      "Signalez une anomalie en quelques clics et suivez son traitement.",
  },
  {
    icon: Mail,
    iconBg: "bg-purple-500",
    title: "Notifications email",
    description:
      "Recevez un email dès que votre dossier passe à l'étape suivante.",
  },
];

const ETAPES = [
  {
    numero: "01",
    titre: "Créez votre compte",
    description:
      "Inscrivez-vous avec votre matricule et vos informations personnelles.",
  },
  {
    numero: "02",
    titre: "Accédez à votre tableau de bord",
    description: "Retrouvez tous vos dossiers en cours dans un espace unique.",
  },
  {
    numero: "03",
    titre: "Suivez et réclamez",
    description:
      "Consultez l'avancement en direct et soumettez une réclamation si besoin.",
  },
];

export default function Accueil() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PublicHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          Service officiel — DGFP
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight text-navy-950 md:text-6xl">
          Suivez votre dossier de carrière,{" "}
          <span className="relative">
            en toute simplicité.
            <span className="absolute -bottom-1 left-0 h-1 w-full bg-gold-500" />
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-500">
          eSuivi-DGFP permet aux agents de l'État de consulter en temps réel
          l'état d'avancement de leurs dossiers et de déposer une réclamation
          en cas d'anomalie — sans se déplacer.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/inscription">
            <Button variant="primary" className="px-6 py-3.5 text-base">
              Créer mon compte
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/connexion">
            <Button variant="outline" className="px-6 py-3.5 text-base">
              J'ai déjà un compte
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-navy-950" />
            Authentification sécurisée
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-navy-950" />
            Notifications par email
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-navy-950" />
            Disponible 24 h / 24
          </span>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg}`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="etapes" className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-500">
            Comment ça marche
          </span>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold text-navy-950">
            Trois étapes pour reprendre la main sur vos dossiers
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ETAPES.map((etape) => (
              <div
                key={etape.numero}
                className="rounded-2xl border border-slate-100 bg-[#F8F9FA] p-8"
              >
                <span className="text-4xl font-extrabold text-navy-950">
                  {etape.numero}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-950">
                  {etape.titre}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {etape.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2026 DGFP — Direction Générale de la Fonction Publique
      </footer>
    </div>
  );
}
