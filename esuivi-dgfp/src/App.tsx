import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Accueil from "./pages/public/Accueil";
import Connexion from "./pages/public/Connexion";
import Inscription from "./pages/public/Inscription";
import ConnexionPersonnel from "./pages/public/ConnexionPersonnel";
import TableauDeBordAgent from "./pages/agent/TableauDeBord";
import MesDossiers from "./pages/agent/MesDossiers";
import NouvelleReclamation from "./pages/agent/NouvelleReclamation";
import ConfirmationReclamation from "./pages/agent/ConfirmationReclamation";
import TableauDeBordGestionnaire from "./pages/gestionnaire/TableauDeBord";
import GestionDossiers from "./pages/gestionnaire/GestionDossiers";
import GestionReclamations from "./pages/gestionnaire/GestionReclamations";
import TableauDeBordAdmin from "./pages/admin/TableauDeBord";
import GestionUtilisateurs from "./pages/admin/GestionUtilisateurs";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion-personnel" element={<ConnexionPersonnel />} />

          <Route
            path="/agent/tableau-de-bord"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <TableauDeBordAgent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/dossiers"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <MesDossiers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/reclamations/nouvelle"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <NouvelleReclamation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/reclamations/confirmation"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <ConfirmationReclamation />
              </ProtectedRoute>
            }
          />

          {/* Espace Gestionnaire */}
          <Route
            path="/gestionnaire/tableau-de-bord"
            element={
              <ProtectedRoute allowedRoles={["gestionnaire"]}>
                <TableauDeBordGestionnaire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionnaire/dossiers"
            element={
              <ProtectedRoute allowedRoles={["gestionnaire"]}>
                <GestionDossiers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionnaire/reclamations"
            element={
              <ProtectedRoute allowedRoles={["gestionnaire"]}>
                <GestionReclamations />
              </ProtectedRoute>
            }
          />

          {/* Espace Administrateur */}
          <Route
            path="/admin/tableau-de-bord"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TableauDeBordAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/utilisateurs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GestionUtilisateurs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
