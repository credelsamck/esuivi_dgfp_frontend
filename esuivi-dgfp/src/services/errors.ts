// Extrait un message d'erreur lisible depuis une réponse d'erreur axios/Laravel.
// Gère à la fois le format 422 ({ errors: { champ: ["message"] } })
// et le format simple ({ message: "..." }).
export function extraireErreur(err: any, messageParDefaut: string): string {
  const data = err?.response?.data;

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
