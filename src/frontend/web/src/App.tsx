import { AuthProvider, useAuth } from "./app/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { DashboardPage } from "./components/DashboardPage";

function AppRoutes() {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <main className="app">
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}
