// apps/renderer/src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./routes/Dashboard";
import ProjectDashboard from "./components/ProjectDashboard";

// Bestehende Imports (diese müssen aus den aktuellen Dateien kommen)
// import Results from "./routes/Results";
// import SolarCalculator from "./routes/SolarCalculator";
// ... weitere imports für alle bestehenden Routes

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "project-dashboard", 
        element: <ProjectDashboard />,
      },
      // Weitere Routes können hier hinzugefügt werden
      // {
      //   path: "results",
      //   element: <Results />,
      // },
      // {
      //   path: "solar",
      //   element: <SolarCalculator />,
      // },
    ],
  },
]);
