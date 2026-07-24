import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import GestionnaireLayout from "../../layouts/GestionnaireLayout";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { DossierStatutBadge } from "../../components/StatutBadge";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import type {
  Agent,
  Dossier,
  PaginatedResponse,
  StatutDossier,
} from "../../types/api";
import { ETAPES_DOSSIER } from "../../types/api";

const STATUTS_FILTRE: { value: string; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  ...ETAPES_DOSSIER.map((e) => ({ value: e.key, label: e.label })),
  { value: "rejete", label: "Rejeté" },
];

export default function GestionDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [recherche, setRecherche] = useState("");
  const [statutFiltre, setStatutFiltre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dossierSelectionne, setDossierSelectionne] = useState<Dossier | null>(
    null
  );
  const [nouveauStatut, setNouveauStatut] = useState<StatutDossier>(
    "numerisation"
  );
  const [enregistrement, setEnregistrement] = useState(false);

  // --- Ajout d'un dossier ---
  const [modalAjoutOuverte, setModalAjoutOuverte] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState("");
  const [typeDemande, setTypeDemande] = useState("");
  const [erreurAjout, setErreurAjout] = useState("");
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  const charger = () => {
    setLoading(true);
    setError("");
    api
      .get<PaginatedResponse<Dossier>>("/gestionnaire/dossiers", {
        params: {
          recherche: recherche || undefined,
          statut: statutFiltre || undefined,
          page,
        },
      })
      .then((res) => {
        setDossiers(res.data.data);
        setLastPage(res.data.last_page);
      })
      .catch(() => setError("Impossible de charger les dossiers."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statutFiltre]);

  const ouvrirModal = (dossier: Dossier) => {
    setDossierSelectionne(dossier);
    setNouveauStatut(dossier.statut);
  };

  const enregistrerStatut = async () => {
    if (!dossierSelectionne) return;
    setEnregistrement(true);
    try {
      await api.put(`/gestionnaire/dossiers/${dossierSelectionne.id}/statut`, {
        statut: nouveauStatut,
      });
      setDossierSelectionne(null);
      charger();
    } catch (err: any) {
      setError(extraireErreur(err, "Impossible de mettre à jour le statut du dossier."));
    } finally {
      setEnregistrement(false);
    }
  };

  const ouvrirModalAjout = () => {
    setAgentId("");
    setTypeDemande("");
    setErreurAjout("");
    setModalAjoutOuverte(true);

    if (agents.length === 0) {
      api
        .get<Agent[]>("/gestionnaire/agents")
        .then((res) => setAgents(res.data))
        .catch(() =>
          setErreurAjout("Impossible de charger la liste des agents.")
        );
    }
  };

  const soumettreAjout = async (e: FormEvent) => {
    e.preventDefault();
    if (!agentId) {
      setErreurAjout("Veuillez sélectionner un agent.");
      return;
    }

    setAjoutEnCours(true);
    setErreurAjout("");
    try {
      await api.post("/gestionnaire/dossiers", {
        user_id: agentId,
        type_demande: typeDemande,
      });
      setModalAjoutOuverte(false);
      setPage(1);
      charger();
    } catch (err: any) {
      setErreurAjout(extraireErreur(err, "Impossible de créer le dossier."));
    } finally {
      setAjoutEnCours(false);
    }
  };

  return (
    <GestionnaireLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-950">
            Gestion des dossiers
          </h1>
          <p className="mt-1 text-slate-500">
            Consultez, filtrez et mettez à jour le statut des dossiers.
          </p>
        </div>
        <Button onClick={ouvrirModalAjout}>
          <Plus className="h-4 w-4" />
          Ajouter un dossier
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Rechercher (n° dossier, agent…)"
          className="min-w-[280px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              charger();
            }
          }}
        />
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
          value={statutFiltre}
          onChange={(e) => {
            setPage(1);
            setStatutFiltre(e.target.value);
          }}
        >
          {STATUTS_FILTRE.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-6 py-4 font-semibold">N° Dossier</th>
              <th className="px-6 py-4 font-semibold">Agent</th>
              <th className="px-6 py-4 font-semibold">Type de demande</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold">Mise à jour</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Chargement…
                </td>
              </tr>
            ) : dossiers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Aucun dossier à afficher.
                </td>
              </tr>
            ) : (
              dossiers.map((dossier) => (
                <tr key={dossier.id}>
                  <td className="px-6 py-4 font-medium text-navy-950">
                    {dossier.numero_dossier}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {dossier.user ? `${dossier.user.prenom} ${dossier.user.nom}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {dossier.type_demande}
                  </td>
                  <td className="px-6 py-4">
                    <DossierStatutBadge statut={dossier.statut} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(dossier.updated_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => ouvrirModal(dossier)}
                      className="text-sm font-semibold text-navy-950 hover:underline"
                    >
                      Modifier le statut
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {lastPage > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                p === page
                  ? "bg-navy-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal changement de statut */}
      <Modal
        open={!!dossierSelectionne}
        onClose={() => setDossierSelectionne(null)}
        title={`Dossier ${dossierSelectionne?.numero_dossier ?? ""}`}
      >
        <label className="text-sm font-medium text-slate-800">
          Nouveau statut
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
          value={nouveauStatut}
          onChange={(e) => setNouveauStatut(e.target.value as StatutDossier)}
        >
          {ETAPES_DOSSIER.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
            </option>
          ))}
          <option value="rejete">Rejeté</option>
        </select>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDossierSelectionne(null)}>
            Annuler
          </Button>
          <Button onClick={enregistrerStatut} disabled={enregistrement}>
            {enregistrement ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </Modal>

      {/* Modal ajout de dossier */}
      <Modal
        open={modalAjoutOuverte}
        onClose={() => setModalAjoutOuverte(false)}
        title="Ajouter un dossier"
      >
        <form onSubmit={soumettreAjout} className="flex flex-col gap-4">
          {erreurAjout && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {erreurAjout}
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-slate-800">
              Agent concerné <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              <option value="">Sélectionnez un agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.prenom} {agent.nom}
                  {agent.matricule ? ` — ${agent.matricule}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">
              Type de demande <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Avancement de grade"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
              value={typeDemande}
              onChange={(e) => setTypeDemande(e.target.value)}
            />
          </div>

          <p className="text-xs text-slate-400">
            Le numéro de dossier est généré automatiquement. Le statut initial
            sera "Numérisation".
          </p>

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalAjoutOuverte(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={ajoutEnCours}>
              {ajoutEnCours ? "Création…" : "Créer le dossier"}
            </Button>
          </div>
        </form>
      </Modal>
    </GestionnaireLayout>
  );
}
