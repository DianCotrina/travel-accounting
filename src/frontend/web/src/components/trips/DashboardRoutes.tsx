import { Navigate, Route, Routes } from "react-router";
import { BackendStatusProvider } from "@/app/backendStatus";
import { ToastProvider } from "@/app/toast";
import { AppShell } from "./AppShell";
import { ExpensesView } from "./ExpensesView";
import { ExportView } from "./ExportView";
import { SummaryView } from "./SummaryView";
import { TripFormPage } from "./TripFormPage";
import { TripPage } from "./TripPage";
import { TripsPage } from "./TripsPage";
import "./trips.css";

/** Authenticated app: trips list → trip view (Expenses · Summary · Export). Router is provided by the caller. */
export function DashboardRoutes() {
  return (
    <BackendStatusProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<TripFormPage />} />
            <Route path="/trips/:tripId/edit" element={<TripFormPage />} />
            <Route path="/trips/:tripId" element={<TripPage />}>
              <Route index element={<Navigate to="expenses" replace />} />
              <Route path="expenses" element={<ExpensesView />} />
              <Route path="summary" element={<SummaryView />} />
              <Route path="export" element={<ExportView />} />
            </Route>
            <Route path="*" element={<Navigate to="/trips" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BackendStatusProvider>
  );
}
