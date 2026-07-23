import { useEffect, useState } from "react";
import GestionnaireLayout from "../../layouts/GestionnaireLayout";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { ReclamationStatutBadge } from "../../components/StatutBadge";
import api, { urlFichierStockage } from "../../services/api";
import type { PaginatedResponse, Reclamation } from "../../types/api";

const STATUTS_FILTRE = [
  { value: "", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "validee", label: "Validée" },
  { value: "rejetee", label: "Rejetée" },
];

export default function GestionReclamations() {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [statutFiltre, setStatutFiltre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectionnee, setSelectionnee] = useState<Reclamation | null>(null);
  const [detail, setDetail] = useState<Reclamation | null>(null);
  const [chargementDetail, setChargementDetail] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);

  const charger = () => {
    setLoading(true);
    setError("");
    api
      .get<PaginatedResponse<Reclamation>>("/gestionnaire/reclamations", {
        params: { statut: statutFiltre || undefined, page },
      })
      .then((res) => {
        setReclamations(res.data.data);
        setLastPage(res.data.last_page);
      })
      .catch(() => setError("Impossible de charger les réclamations."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statutFiltre]);

  const ouvrirDetail = (rec: Reclamation) => {
    setSelectionnee(rec);
    setDetail(null);
    setCommentaire("");
    setChargementDetail(true);
    api
      .get<Reclamation>(`/gestionnaire/reclamations/${rec.id}`)
      .then((res) => setDetail(res.data))
      .catch(() => setError("Impossible de charger le détail de la réclamation."))
      .finally(() => setChargementDetail(false));
  };

  const traiter = async (statut: "validee" | "rejetee") => {
    if (!selectionnee) return;
    setEnregistrement(true);
    try {
      await api.put(`/gestionnaire/reclamations/${selectionnee.id}`, {
        statut,
        reponse_admin: commentaire || undefined,
      });
      setSelectionnee(null);
      charger();
    } catch {
      setError("Impossible de traiter la réclamation.");
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <GestionnaireLayout>
      <h1 className="text-3xl font-bold text-navy-950">
        Gestion des réclamations
      </h1>
      <p className="mt-1 text-slate-500">
        Consultez et traitez les réclamations soumises par les agents.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
          value={statutFiltre}
          onChange={(e) => setStatutFiltre(e.target.value)}
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
              <th className="px-6 py-4 font-semibold">N° Réclamation</th>
              <th className="px-6 py-4 font-semibold">Agent</th>
              <th className="px-6 py-4 font-semibold">Dossier</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
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
            ) : reclamations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Aucune réclamation à afficher.
                </td>
              </tr>
            ) : (
              reclamations.map((rec) => (
                <tr key={rec.id}>
                  <td className="px-6 py-4 font-medium text-navy-950">
                    {rec.numero_reclamation}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {rec.user ? `${rec.user.prenom} ${rec.user.nom}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {rec.dossier?.numero_dossier ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {rec.created_at
                      ? new Date(rec.created_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <ReclamationStatutBadge statut={rec.statut} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => ouvrirDetail(rec)}
                      className="text-sm font-semibold text-navy-950 hover:underline"
                    >
                      Voir le détail
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

      <Modal
        open={!!selectionnee}
        onClose={() => setSelectionnee(null)}
        title={`Réclamation ${selectionnee?.numero_reclamation ?? ""}`}
      >
        {chargementDetail ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Chargement du détail…
          </p>
        ) : detail ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Agent
              </p>
              <p className="text-sm text-navy-950">
                {detail.user ? `${detail.user.prenom} ${detail.user.nom}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Dossier concerné
              </p>
              <p className="text-sm text-navy-950">
                {detail.dossier?.numero_dossier ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Description
              </p>
              <p className="text-sm text-slate-600">
                {detail.description || "Aucune description fournie."}
              </p>
            </div>
            {detail.piece_jointe && (
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Pièce jointe
                </p>
                <a
                  href={urlFichierStockage(detail.piece_jointe)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-navy-950 hover:underline"
                >
                  Consulter la pièce jointe
                </a>
              </div>
            )}

            {detail.statut === "en_attente" && (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Réponse à l'agent…"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    disabled={enregistrement}
                    onClick={() => traiter("rejetee")}
                  >
                    Rejeter
                  </Button>
                  <Button
                    disabled={enregistrement}
                    onClick={() => traiter("validee")}
                  >
                    {enregistrement ? "Traitement…" : "Valider"}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </GestionnaireLayout>
  );
}
