import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import AgentLayout from "../../layouts/AgentLayout";
import FormStep from "../../components/FormStep";
import Button from "../../components/Button";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import type { Dossier, Reclamation } from "../../types/api";

const TAILLE_MAX_OCTETS = 5 * 1024 * 1024; // 5 Mo
const TYPES_ACCEPTES = ["application/pdf", "image/png", "image/jpeg"];
const DESCRIPTION_MAX = 1000;

interface ReclamationResponse {
  message: string;
  reclamation: Pick<Reclamation, "numero_reclamation" | "statut">;
}

export default function NouvelleReclamation() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [dossierId, setDossierId] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingDossiers, setLoadingDossiers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Dossier[]>("/agent/dossiers")
      .then((res) => setDossiers(res.data))
      .catch(() =>
        setErrors((prev) => ({
          ...prev,
          global: "Impossible de charger la liste de vos dossiers.",
        }))
      )
      .finally(() => setLoadingDossiers(false));
  }, []);

  const handleFichierChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > TAILLE_MAX_OCTETS) {
      setErrors((prev) => ({
        ...prev,
        fichier: "Le fichier dépasse la taille maximale autorisée de 5 Mo.",
      }));
      setFichier(null);
      e.target.value = "";
      return;
    }

    if (!TYPES_ACCEPTES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        fichier: "Format non pris en charge. Utilisez PDF, PNG, JPG ou JPEG.",
      }));
      setFichier(null);
      e.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, fichier: "" }));
    setFichier(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!dossierId) {
      setErrors({ dossier: "Veuillez sélectionner un dossier." });
      return;
    }

    if (!fichier) {
      setErrors({ fichier: "Veuillez joindre un fichier (obligatoire)." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("dossier_id", dossierId);
      if (fichier) formData.append("piece_jointe", fichier);
      formData.append("description", description);

      const { data } = await api.post<ReclamationResponse>(
        "/agent/reclamations",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/agent/reclamations/confirmation", {
        state: {
          message: data.message,
          numero_reclamation: data.reclamation.numero_reclamation,
        },
      });
    } catch (err: any) {
      setErrors({
        global: extraireErreur(
          err,
          "Une erreur est survenue lors de l'envoi de la réclamation."
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AgentLayout>
      <h1 className="text-3xl font-bold text-navy-950">Nouvelle réclamation</h1>
      <p className="mt-1 text-slate-500">
        Signalez un problème concernant l'un de vos dossiers.
      </p>

      {errors.global && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.global}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <FormStep numero={1} titre="Identification du dossier">
          <label className="text-sm font-medium text-slate-800">
            Dossier concerné
          </label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
            value={dossierId}
            onChange={(e) => setDossierId(e.target.value)}
            disabled={loadingDossiers}
          >
            <option value="">Sélectionnez un dossier</option>
            {dossiers.map((dossier) => (
              <option key={dossier.id} value={dossier.id}>
                {dossier.numero_dossier} — {dossier.type_demande}
              </option>
            ))}
          </select>
          {errors.dossier && (
            <p className="mt-1.5 text-xs text-red-500">{errors.dossier}</p>
          )}
        </FormStep>

        <FormStep numero={2} titre="Pièce jointe">
          <label
            htmlFor="piece-jointe"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center hover:border-navy-950/30"
          >
            <Upload className="h-6 w-6 text-navy-950" />
            <span className="font-medium text-navy-950">
              {fichier ? fichier.name : "Cliquez pour sélectionner un fichier"}
            </span>
            <span className="text-xs text-slate-400">
              PDF, PNG, JPG, JPEG — 5 Mo max
            </span>
            <input
              id="piece-jointe"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFichierChange}
            />
          </label>
          {errors.fichier && (
            <p className="mt-1.5 text-xs text-red-500">{errors.fichier}</p>
          )}
        </FormStep>

        <FormStep numero={3} titre="Description">
          <textarea
            rows={5}
            maxLength={DESCRIPTION_MAX}
            placeholder="Décrivez le problème rencontré…"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="mt-1.5 text-right text-xs text-slate-400">
            {description.length} / {DESCRIPTION_MAX}
          </p>
        </FormStep>

        <Button type="submit" disabled={submitting} className="self-start px-8">
          {submitting ? "Envoi en cours…" : "Envoyer la réclamation"}
        </Button>
      </form>
    </AgentLayout>
  );
}
