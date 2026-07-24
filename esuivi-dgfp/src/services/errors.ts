// Extrait un message d'erreur lisible depuis une réponse d'erreur axios/Laravel.
// Gère le format 422 ({ errors: { champ: ["message"] } }), le format simple
// ({ message: "..." }), et le cas où le backend est injoignable (pas de réponse du tout).
export function extraireErreur(err: any, messageParDefaut: string): string {
  // Aucune réponse reçue = le backend n'est pas joignable (serveur arrêté,
  // mauvaise URL dans VITE_API_BASE_URL, ou requête bloquée par CORS).
  if (!err?.response) {
    return "Impossible de contacter le serveur. Vérifiez que le backend est démarré et que l'URL de l'API est correcte (VITE_API_BASE_URL).";
  }

  const data = err.response.data;

  if (data?.errors) {
    const premiereErreur = Object.values(data.errors)[0];
    if (Array.isArray(premiereErreur) && premiereErreur.length > 0) {
      return String(premiereErreur[0]);
    }
  }

  if (data?.message) {
    return String(data.message);
  }

  return messageParDefaut;
}
