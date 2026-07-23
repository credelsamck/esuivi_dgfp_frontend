import type { Dossier } from "./api";

export interface AgentDashboard {
  total: number;
  en_cours: number;
  valides: number;
  rejetes: number;
  derniers_dossiers: Dossier[];
}
