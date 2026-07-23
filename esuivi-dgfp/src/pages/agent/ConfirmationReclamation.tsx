import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AgentLayout from "../../layouts/AgentLayout";
import Button from "../../components/Button";

interface ConfirmationState {
  message: string;
  numero_reclamation: string;
}

export default function ConfirmationReclamation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  if (!state) {
    return <Navigate to="/agent/tableau-de-bord" replace />;
  }

  return (
    <AgentLayout>
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-100 bg-white px-8 py-16 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </span>

        <h1 className="mt-6 text-2xl font-bold text-navy-950">
          Réclamation envoyée
        </h1>
        <p className="mt-2 text-slate-500">{state.message}</p>

        <p className="mt-6 rounded-xl bg-slate-50 px-6 py-3 text-sm text-slate-600">
          Numéro de réclamation :{" "}
          <span className="font-bold text-navy-950">
            {state.numero_reclamation}
          </span>
        </p>

        <Link to="/agent/tableau-de-bord" className="mt-8">
          <Button variant="primary" className="px-8">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    </AgentLayout>
  );
}
