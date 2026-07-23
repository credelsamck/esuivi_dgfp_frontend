import { useEffect, useState, type FormEvent } from "react";
import { Plus, Power, Trash2 } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
import { extraireErreur } from "../../services/errors";
import type { PaginatedResponse, User } from "../../types/api";

interface FormState {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  telephone: string;
  password: string;
  role: "agent" | "gestionnaire";
}

const emptyForm: FormState = {
  nom: "",
  prenom: "",
  matricule: "",
  email: "",
  telephone: "",
  password: "",
  role: "agent",
};

export default function GestionUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [recherche, setRecherche] = useState("");
  const [role, setRole] = useState("");
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOuverte, setModalOuverte] = useState(false);
  const [utilisateurEnEdition, setUtilisateurEnEdition] = useState<User | null>(
    null
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [enregistrement, setEnregistrement] = useState(false);

  const [aSupprimer, setASupprimer] = useState<User | null>(null);

  const charger = () => {
    setLoading(true);
    setError("");
    api
      .get<PaginatedResponse<User>>("/admin/utilisateurs", {
        params: {
          recherche: recherche || undefined,
          role: role || undefined,
          statut: statut || undefined,
          page,
        },
      })
      .then((res) => {
        setUtilisateurs(res.data.data);
        setLastPage(res.data.last_page);
      })
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, statut]);

  const ouvrirAjout = () => {
    setUtilisateurEnEdition(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOuverte(true);
  };

  const ouvrirEdition = (u: User) => {
    setUtilisateurEnEdition(u);
    setForm({
      nom: u.nom,
      prenom: u.prenom,
      matricule: u.matricule || "",
      email: u.email,
      telephone: u.telephone || "",
      password: "",
      role: u.role === "gestionnaire" ? "gestionnaire" : "agent",
    });
    setFormErrors({});
    setModalOuverte(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setEnregistrement(true);
    try {
      if (utilisateurEnEdition) {
        await api.put(`/admin/utilisateurs/${utilisateurEnEdition.id}`, form);
      } else {
        await api.post("/admin/utilisateurs", form);
      }
      setModalOuverte(false);
      charger();
    } catch (err: any) {
      setFormErrors({
        global: extraireErreur(
          err,
          "Une erreur est survenue lors de l'enregistrement."
        ),
      });
    } finally {
      setEnregistrement(false);
    }
  };

  const basculerStatut = async (u: User) => {
    try {
      await api.put(`/admin/utilisateurs/${u.id}/statut`);
      charger();
    } catch {
      setError("Impossible de mettre à jour le statut du compte.");
    }
  };

  const confirmerSuppression = async () => {
    if (!aSupprimer) return;
    try {
      await api.delete(`/admin/utilisateurs/${aSupprimer.id}`);
      setASupprimer(null);
      charger();
    } catch {
      setError("Impossible de supprimer cet utilisateur.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-950">
            Gestion des utilisateurs
          </h1>
          <p className="mt-1 text-slate-500">
            Créez, modifiez et gérez les comptes agents et gestionnaires.
          </p>
        </div>
        <Button onClick={ouvrirAjout}>
          <Plus className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Rechercher (nom, matricule, email…)"
          className="min-w-[260px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
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
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
        >
          <option value="">Tous les rôles</option>
          <option value="agent">Agent</option>
          <option value="gestionnaire">Gestionnaire</option>
        </select>
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
          value={statut}
          onChange={(e) => {
            setPage(1);
            setStatut(e.target.value);
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
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
              <th className="px-6 py-4 font-semibold">Matricule</th>
              <th className="px-6 py-4 font-semibold">Nom</th>
              <th className="px-6 py-4 font-semibold">Prénom</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Rôle</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  Chargement…
                </td>
              </tr>
            ) : utilisateurs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  Aucun utilisateur à afficher.
                </td>
              </tr>
            ) : (
              utilisateurs.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 text-slate-600">
                    {u.matricule || "—"}
                  </td>
                  <td className="px-6 py-4 font-medium text-navy-950">
                    {u.nom}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{u.prenom}</td>
                  <td className="px-6 py-4 text-slate-600">{u.email}</td>
                  <td className="px-6 py-4 capitalize text-slate-600">
                    {u.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        u.statut_compte === "actif"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.statut_compte === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => ouvrirEdition(u)}
                        className="text-sm font-semibold text-navy-950 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => basculerStatut(u)}
                        title={
                          u.statut_compte === "actif"
                            ? "Désactiver"
                            : "Activer"
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-950"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setASupprimer(u)}
                        title="Supprimer"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

      {/* Modal ajout / édition */}
      <Modal
        open={modalOuverte}
        onClose={() => setModalOuverte(false)}
        title={
          utilisateurEnEdition ? "Modifier l'utilisateur" : "Ajouter un utilisateur"
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formErrors.global && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {formErrors.global}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
            <Input
              label="Prénom"
              required
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>

          <Input
            label="Matricule"
            required
            disabled={!!utilisateurEnEdition}
            value={form.matricule}
            onChange={(e) => setForm({ ...form, matricule: e.target.value })}
          />
          {utilisateurEnEdition && (
            <p className="-mt-2 text-xs text-slate-400">
              Le matricule ne peut pas être modifié.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Téléphone"
              required
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </div>

          {!utilisateurEnEdition && (
            <Input
              label="Mot de passe"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <div>
            <label className="text-sm font-medium text-slate-800">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-navy-950 focus:ring-2 focus:ring-navy-950/10"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as "agent" | "gestionnaire",
                })
              }
            >
              <option value="agent">Agent</option>
              <option value="gestionnaire">Gestionnaire</option>
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOuverte(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={enregistrement}>
              {enregistrement ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmation suppression */}
      <Modal
        open={!!aSupprimer}
        onClose={() => setASupprimer(null)}
        title="Supprimer l'utilisateur"
      >
        <p className="text-sm text-slate-600">
          Êtes-vous sûr de vouloir supprimer le compte de{" "}
          <span className="font-semibold text-navy-950">
            {aSupprimer?.prenom} {aSupprimer?.nom}
          </span>{" "}
          ? Cette action est irréversible.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setASupprimer(null)}>
            Annuler
          </Button>
          <Button
            onClick={confirmerSuppression}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
