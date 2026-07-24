// Types correspondant aux réponses de l'API Laravel eSuivi-DGFP

export type Role = "agent" | "gestionnaire" | "admin";

export type StatutDossier =
  | "numerisation"
  | "indexation"
  | "en_cours_traitement"
  | "mandatement"
  | "validation"
  | "approuve_dg"
  | "pret"
  | "rejete";

export type StatutReclamation = "en_attente" | "validee" | "rejetee";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  matricule?: string;
  telephone?: string;
  statut_compte: "actif" | "inactif";
}

export interface HistoriqueStatut {
  nouveau_statut: StatutDossier;
  created_at: string;
}

export interface Dossier {
  id: number;
  numero_dossier: string;
  type_demande: string;
  statut: StatutDossier;
  updated_at: string;
  user?: { nom: string; prenom: string };
  historique_statuts?: HistoriqueStatut[];
}

export interface Reclamation {
  id: number;
  numero_reclamation: string;
  statut: StatutReclamation;
  description?: string;
  piece_jointe?: string;
  reponse_admin?: string;
  dossier?: Dossier;
  user?: { nom: string; prenom: string };
  created_at?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  role?: Role;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
}

export interface GestionnaireDashboard {
  dossiers_en_cours: number;
  reclamations_en_attente: number;
}

export interface AdminDashboard {
  total_agents: number;
  total_gestionnaires: number;
  comptes_actifs: number;
  comptes_inactifs: number;
}

export interface Agent {
  id: number;
  nom: string;
  prenom: string;
  matricule?: string;
}

export const ETAPES_DOSSIER: { key: StatutDossier; label: string }[] = [
  { key: "numerisation", label: "Numérisation" },
  { key: "indexation", label: "Indexation" },
  { key: "en_cours_traitement", label: "En cours de traitement" },
  { key: "mandatement", label: "Mandatement" },
  { key: "validation", label: "Validation" },
  { key: "approuve_dg", label: "Approuvé par le Directeur Général" },
  { key: "pret", label: "Prêt" },
];
