// apps/renderer/src/App.tsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import './App.css';

export default function App(): JSX.Element {
  const { pathname } = useLocation();

  // Debug: Log current path
  console.log('Current pathname:', pathname);

  const menuItems: MenuItem[] = [
    {
      label: 'Projekt',
      icon: 'pi pi-fw pi-file',
      items: [
        { label: 'Anlagenmodus', url: '/project/mode' },
        { label: 'Kundendaten', url: '/project/customer' },
        { label: 'Gebäudedaten', url: '/project/building' },
        { label: 'Bedarfsanalyse', url: '/project/demand' },
        { label: 'Bedürfnisse', url: '/project/needs' },
        { label: 'Zusatzoptionen', url: '/project/options' }
      ]
    },
    {
      label: 'Kalkulation',
      icon: 'pi pi-fw pi-calculator',
      items: [
        { label: '🌞 Premium Solar Calculator', url: '/calc/solar-premium' },
        { label: 'Solarkalkulator', url: '/calc/solar' },
        { label: 'Erweiterte Berechnungen', url: '/calc/advanced' },
        { label: 'Wärmepumpen-Sim', url: '/calc/heatpump' },
        { label: 'Ergebnisse & Dashboard', url: '/calc/results' }
      ]
    },
    {
      label: 'Modern Dashboard',
      icon: 'pi pi-fw pi-th-large',
      url: '/dashboard/modern'
    },
    {
      label: 'PDF-Hub',
      icon: 'pi pi-fw pi-file-pdf',
      items: [
        { label: 'Standard-PDF', url: '/pdf/standard' },
        { label: 'Erweiterte PDFs', url: '/pdf/extended' },
        { label: 'Multi-PDF', url: '/pdf/multi' },
        { label: 'Vorschau', url: '/pdf/preview' }
      ]
    },
    {
      label: 'CRM',
      icon: 'pi pi-fw pi-users',
      items: [
        { label: 'Dashboard', url: '/crm/dashboard' },
        { label: 'Kundenverwaltung', url: '/crm/customers' },
        { label: 'Pipeline & Workflows', url: '/crm/pipeline' },
        { label: 'Kalender', url: '/crm/calendar' },
        { label: 'Schnellkalkulation', url: '/crm/quick-calc' }
      ]
    },
    {
      label: 'Planung',
      icon: 'pi pi-fw pi-sitemap',
      items: [
        { label: 'Informationsportal', url: '/planning/info' },
        { label: 'Dokumente', url: '/planning/documents' }
      ]
    },
    {
      label: 'Admin',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'Login', url: '/admin/login' },
        { label: 'Firmenverwaltung', url: '/admin/companies' },
        { label: 'Produktverwaltung', url: '/admin/products' },
        { label: 'Preis-Matrix', url: '/admin/price-matrix' },
        { label: 'Tarifverwaltung', url: '/admin/tariffs' },
        { label: 'Einstellungen', url: '/admin/settings' }
      ]
    }
  ];

  const start = <div className="font-bold text-primary">Kakerlake – PV/WP</div>;

  return (
    <div className="kakerlake-app">
      <Menubar model={menuItems} start={start} className="mb-4" />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
