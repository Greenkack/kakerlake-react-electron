// apps/renderer/src/App.tsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function App(): JSX.Element {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Debug: Log current path
  console.log('Current pathname:', pathname);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={
          "rounded px-3 py-1 text-sm " +
          (active
            ? "bg-cyan-600 text-white"
            : "bg-white text-slate-700 hover:bg-slate-100 border")
        }
      >
        {children}
      </Link>
    );
  };

  const DropdownMenu = ({ 
    title, 
    menuKey, 
    items 
  }: { 
    title: string; 
    menuKey: string; 
    items: { to: string; label: string }[] 
  }) => {
    const isOpen = openMenu === menuKey;
    const hasActiveChild = items.some(item => pathname === item.to);
    
    return (
      <div className="relative">
        <button
          onClick={() => setOpenMenu(isOpen ? null : menuKey)}
          className={
            "rounded px-3 py-1 text-sm flex items-center gap-1 " +
            (hasActiveChild
              ? "bg-cyan-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border")
          }
        >
          {title}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg min-w-48 z-50">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpenMenu(null)}
                className={
                  "block px-3 py-2 text-sm hover:bg-slate-100 " +
                  (pathname === item.to ? "bg-cyan-50 text-cyan-700" : "text-slate-700")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 p-3">
          <div className="mr-auto font-semibold">Kakerlake – PV/WP</div>
          
          {/* Projekt & Bedarfsanalyse */}
          <DropdownMenu
            title="Projekt"
            menuKey="project"
            items={[
              { to: "/project/mode", label: "Anlagenmodus" },
              { to: "/project/customer", label: "Kundendaten" },
              { to: "/project/building", label: "Gebäudedaten" },
              { to: "/project/demand", label: "Bedarfsanalyse" },
              { to: "/project/needs", label: "Bedürfnisse" },
              { to: "/project/options", label: "Zusatzoptionen" }
            ]}
          />

          {/* Kalkulation */}
          <DropdownMenu
            title="Kalkulation"
            menuKey="calc"
            items={[
              { to: "/calc/solar", label: "Solarkalkulator" },
              { to: "/calc/heatpump", label: "Wärmepumpen-Sim" },
              { to: "/calc/results", label: "Ergebnisse & Dashboard" }
            ]}
          />

          {/* PDF-Hub */}
          <DropdownMenu
            title="PDF-Hub"
            menuKey="pdf"
            items={[
              { to: "/pdf/standard", label: "Standard-PDF" },
              { to: "/pdf/extended", label: "Erweiterte PDFs" },
              { to: "/pdf/multi", label: "Multi-PDF" },
              { to: "/pdf/preview", label: "Vorschau" }
            ]}
          />

          {/* CRM */}
          <DropdownMenu
            title="CRM"
            menuKey="crm"
            items={[
              { to: "/crm/dashboard", label: "Dashboard" },
              { to: "/crm/customers", label: "Kundenverwaltung" },
              { to: "/crm/pipeline", label: "Pipeline & Workflows" },
              { to: "/crm/calendar", label: "Kalender" },
              { to: "/crm/quick-calc", label: "Schnellkalkulation" }
            ]}
          />

          {/* Planung */}
          <DropdownMenu
            title="Planung"
            menuKey="planning"
            items={[
              { to: "/planning/info", label: "Informationsportal" },
              { to: "/planning/documents", label: "Dokumente" }
            ]}
          />

          {/* Administration */}
          <DropdownMenu
            title="Admin"
            menuKey="admin"
            items={[
              { to: "/admin/login", label: "Login" },
              { to: "/admin/companies", label: "Firmenverwaltung" },
              { to: "/admin/products", label: "Produktverwaltung" },
              { to: "/admin/price-matrix", label: "Preis-Matrix" },
              { to: "/admin/tariffs", label: "Tarifverwaltung" },
              { to: "/admin/settings", label: "Einstellungen" }
            ]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
