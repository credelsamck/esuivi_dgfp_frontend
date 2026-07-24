import GestionnaireLayout from "../../layouts/GestionnaireLayout";
import ProfilContent from "../../components/ProfilContent";

export default function ProfilGestionnaire() {
  return (
    <GestionnaireLayout>
      <h1 className="text-3xl font-bold text-navy-950">Mon profil</h1>
      <p className="mt-1 text-slate-500">Vos informations personnelles.</p>
      <ProfilContent />
    </GestionnaireLayout>
  );
}
