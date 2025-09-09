// apps/renderer/src/App.tsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import 'primereact/resources/themes/dark/theme.css';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { MenuItem } from 'primereact/menuitem';
import { ProjectProvider } from './state/project';
import './App.css';

export default function App(): JSX.Element {
  const { pathname } = useLocation();

  // Debug: Log current path
  console.log('Current pathname:', pathname);

  // PrimeReact Menu Items Structure
  const items: MenuItem[] = [
    {
      label: '🏠 Home',
      command: () => { window.location.pathname = '/'; },
      className: pathname === '/' ? 'p-highlight' : ''
    },
    {
      label: 'Projekt',
      icon: 'pi pi-fw pi-folder',
      items: [
        {
          label: 'Anlagenmodus',
          icon: 'pi pi-fw pi-cog',
          command: () => { window.location.pathname = '/project/mode'; }
        },
        {
          label: 'Kundendaten',
          icon: 'pi pi-fw pi-user',
          command: () => { window.location.pathname = '/project/customer'; }
        },
        {
          label: 'Gebäudedaten',
          icon: 'pi pi-fw pi-home',
          command: () => { window.location.pathname = '/project/building'; }
        },
        {
          label: 'Bedarfsanalyse',
          icon: 'pi pi-fw pi-chart-line',
          command: () => { window.location.pathname = '/project/demand'; }
        },
        {
          label: 'Bedürfnisse',
          icon: 'pi pi-fw pi-heart',
          command: () => { window.location.pathname = '/project/needs'; }
        },
        {
          label: 'Zusatzoptionen',
          icon: 'pi pi-fw pi-plus-circle',
          command: () => { window.location.pathname = '/project/options'; }
        }
      ]
    },
    {
      label: '📊 Dashboard',
      icon: 'pi pi-fw pi-chart-bar',
      command: () => { window.location.pathname = '/dashboard'; },
      className: pathname === '/dashboard' ? 'p-highlight' : ''
    },
    {
      label: 'Kalkulation',
      icon: 'pi pi-fw pi-calculator',
      items: [
        {
          label: 'Solarkalkulator',
          icon: 'pi pi-fw pi-sun',
          command: () => { window.location.pathname = '/calc/solar'; }
        },
        {
          label: 'Wärmepumpen-Sim',
          icon: 'pi pi-fw pi-fire',
          command: () => { window.location.pathname = '/calc/heatpump'; }
        },
        {
          label: 'Ergebnisse',
          icon: 'pi pi-fw pi-list',
          command: () => { window.location.pathname = '/calc/results'; }
        }
      ]
    },
    {
      label: 'PDF-Hub',
      icon: 'pi pi-fw pi-file-pdf',
      items: [
        {
          label: 'Standard-PDF',
          icon: 'pi pi-fw pi-file',
          command: () => { window.location.pathname = '/pdf/standard'; }
        },
        {
          label: 'Erweiterte PDFs',
          icon: 'pi pi-fw pi-file-edit',
          command: () => { window.location.pathname = '/pdf/extended'; }
        },
        {
          label: 'Multi-PDF',
          icon: 'pi pi-fw pi-copy',
          command: () => { window.location.pathname = '/pdf/multi'; }
        },
        {
          label: 'Vorschau',
          icon: 'pi pi-fw pi-eye',
          command: () => { window.location.pathname = '/pdf/preview'; }
        }
      ]
    },
    {
      label: 'CRM',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-chart-bar',
          command: () => { window.location.pathname = '/crm/dashboard'; }
        },
        {
          label: 'Kundenverwaltung',
          icon: 'pi pi-fw pi-user-edit',
          command: () => { window.location.pathname = '/crm/customers'; }
        },
        {
          label: 'Pipeline & Workflows',
          icon: 'pi pi-fw pi-sitemap',
          command: () => { window.location.pathname = '/crm/pipeline'; }
        },
        {
          label: 'Kalender',
          icon: 'pi pi-fw pi-calendar',
          command: () => { window.location.pathname = '/crm/calendar'; }
        },
        {
          label: 'Schnellkalkulation',
          icon: 'pi pi-fw pi-calculator',
          command: () => { window.location.pathname = '/crm/quick-calc'; }
        }
      ]
    },
    {
      label: 'Planung',
      icon: 'pi pi-fw pi-map',
      items: [
        {
          label: 'Informationsportal',
          icon: 'pi pi-fw pi-info-circle',
          command: () => { window.location.pathname = '/planning/info'; }
        },
        {
          label: 'Dokumente',
          icon: 'pi pi-fw pi-folder-open',
          command: () => { window.location.pathname = '/planning/documents'; }
        }
      ]
    },
    {
      label: 'Admin',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Login',
          icon: 'pi pi-fw pi-sign-in',
          command: () => { window.location.pathname = '/admin/login'; }
        },
        {
          label: 'Firmenverwaltung',
          icon: 'pi pi-fw pi-building',
          command: () => { window.location.pathname = '/admin/companies'; }
        },
        {
          label: 'Produktverwaltung',
          icon: 'pi pi-fw pi-shopping-cart',
          command: () => { window.location.pathname = '/admin/products'; }
        },
        {
          label: 'Preis-Matrix',
          icon: 'pi pi-fw pi-table',
          command: () => { window.location.pathname = '/admin/price-matrix'; }
        },
        {
          label: 'Tarifverwaltung',
          icon: 'pi pi-fw pi-euro',
          command: () => { window.location.pathname = '/admin/tariffs'; }
        },
        {
          label: 'Einstellungen',
          icon: 'pi pi-fw pi-sliders-h',
          command: () => { window.location.pathname = '/admin/settings'; }
        }
      ]
    }
  ];

  const start = (
    <div className="flex align-items-center">
      <i className="pi pi-bolt text-6xl text-primary mr-2"></i>
      <span className="text-2xl font-bold text-primary">KAKERLAKE – PV/WP</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Badge value="Pro" severity="success"></Badge>
      <Button 
        icon="pi pi-question-circle" 
        className="p-button-rounded p-button-text" 
        tooltip="Hilfe"
      />
    </div>
  );

  return (
    <ProjectProvider>
      <div className="kakerlake-app">
        {/* Neon Green Header */}
        <div className="bg-gray-900 border-bottom-2 border-primary shadow-4">
          <Menubar 
            model={items} 
            start={start} 
            end={end}
            className="bg-gray-900 border-none shadow-none"
          />
        </div>

        {/* Main Content */}
        <div className="main-content bg-gray-800 min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </ProjectProvider>
  );
}
