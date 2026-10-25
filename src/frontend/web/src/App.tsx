import { BrowserRouter } from "react-router";
import { AuthProvider, useAuth } from "./app/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { DashboardRoutes } from "./components/trips/DashboardRoutes";

function AppRoutes() {
  const { user } = useAuth();
  return user ? <DashboardRoutes /> : <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main className="app">
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
