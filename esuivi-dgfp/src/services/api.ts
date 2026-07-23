import axios from "axios";

// À adapter selon l'environnement de déploiement du backend Laravel
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// URL de base du serveur Laravel (sans le /api), utilisée pour construire
// les liens vers les fichiers stockés publiquement (ex: storage/reclamations/...)
export const STORAGE_BASE_URL =
  import.meta.env.VITE_STORAGE_BASE_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");

export function urlFichierStockage(cheminRelatif: string): string {
  return `${STORAGE_BASE_URL}/storage/${cheminRelatif}`;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attache le token Sanctum à chaque requête sortante
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirige vers la connexion appropriée en cas de 401 (token invalide/expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const role = localStorage.getItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      if (role === "gestionnaire" || role === "admin") {
        window.location.href = "/connexion-personnel";
      } else {
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
