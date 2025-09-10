import React, { useState } from 'react';
import { ModernCard, ModernButton, ModernInput, ModernSelect } from './ModernUI_PrimeReact';
import { ResponsiveGrid, ResponsiveContainer, ResponsiveNavigation, ResponsiveSidebar, ResponsiveTable, useResponsive } from './ResponsiveLayout_PrimeReact';
import { useWorkflow, WorkflowProvider } from '../lib/workflowIntegration';

// Beispiel-Komponente für PV-Angebotserstellung
export const PVOfferExample: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isMobile, isDesktop } = useResponsive();

  // Beispiel-Navigationselemente
  const navItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => console.log('Dashboard clicked')
    },
    {
      label: 'Projekte',
      icon: 'pi pi-folder',
      items: [
        { label: 'Neues Projekt', icon: 'pi pi-plus' },
        { label: 'Alle Projekte', icon: 'pi pi-list' }
      ]
    },
    {
      label: 'Angebote',
      icon: 'pi pi-file-pdf',
      command: () => console.log('Angebote clicked')
    }
  ];

  // Beispiel-Tabellendaten
  const projectData = [
    {
      id: 1,
      kunde: 'Max Mustermann',
      anlage: '10 kWp',
      status: 'In Bearbeitung',
      erstellt: '2025-09-10'
    },
    {
      id: 2,
      kunde: 'Anna Schmidt',
      anlage: '15 kWp',
      status: 'Angebot erstellt',
      erstellt: '2025-09-09'
    }
  ];

  // Tabellenspalten-Definition
  const tableColumns = [
    { field: 'kunde', header: 'Kunde', sortable: true },
    { field: 'anlage', header: 'Anlagengröße', sortable: true },
    { field: 'status', header: 'Status' },
    { field: 'erstellt', header: 'Erstellt am', sortable: true }
  ];

  // Mobile Card-Template für Tabelle
  const mobileCardTemplate = (item: any) => (
    <div>
      <div className="font-bold text-900 mb-2">{item.kunde}</div>
      <div className="text-600 mb-1">Anlage: {item.anlage}</div>
      <div className="text-600 mb-1">Status: {item.status}</div>
      <div className="text-500 text-sm">Erstellt: {item.erstellt}</div>
    </div>
  );

  return (
    <WorkflowProvider workflowType="pv_project">
      <div className="min-h-screen surface-ground">
        {/* Navigation */}
        <ResponsiveNavigation
          items={navItems}
          logo={<span className="font-bold text-primary">Kakerlake PV</span>}
          onMenuToggle={() => setSidebarVisible(true)}
        />

        {/* Sidebar für Mobile */}
        <ResponsiveSidebar
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
          header="Navigation"
        >
          <div className="p-3">
            {navItems.map((item, index) => (
              <div key={index} className="mb-2">
                <ModernButton
                  icon={item.icon}
                  className="w-full justify-content-start"
                  text
                  onClick={item.command}
                >
                  {item.label}
                </ModernButton>
              </div>
            ))}
          </div>
        </ResponsiveSidebar>

        {/* Hauptinhalt */}
        <ResponsiveContainer size="xl" padding="lg">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-900 mb-2">
              PV-Anlagen Dashboard
            </h1>
            <p className="text-600">
              Verwalten Sie Ihre Photovoltaik-Projekte und Angebote
            </p>
          </div>

          {/* Statistik-Karten */}
          <ResponsiveGrid cols={isMobile ? 1 : isDesktop ? 4 : 2} gap="md" className="mb-6">
            <ModernCard
              title="Aktive Projekte"
              variant="elevated"
              size="md"
            >
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-600 text-sm">+2 seit letzter Woche</div>
            </ModernCard>

            <ModernCard
              title="Angebote erstellt"
              variant="elevated"
              size="md"
            >
              <div className="text-2xl font-bold text-green-500">8</div>
              <div className="text-600 text-sm">Durchschnitt: 6/Woche</div>
            </ModernCard>

            <ModernCard
              title="Gesamtleistung"
              variant="elevated"
              size="md"
            >
              <div className="text-2xl font-bold text-orange-500">248 kWp</div>
              <div className="text-600 text-sm">Installierte Leistung</div>
            </ModernCard>

            <ModernCard
              title="Umsatz (Monat)"
              variant="elevated"
              size="md"
            >
              <div className="text-2xl font-bold text-blue-500">€ 145.200</div>
              <div className="text-600 text-sm">+15% zum Vormonat</div>
            </ModernCard>
          </ResponsiveGrid>

          {/* Neues Projekt erstellen */}
          <ResponsiveGrid cols={isMobile ? 1 : 2} gap="lg" className="mb-6">
            <ModernCard
              title="Neues Projekt erstellen"
              variant="outlined"
              size="lg"
            >
              <div className="space-y-4">
                <ModernInput
                  label="Kundenname"
                  placeholder="Name des Kunden eingeben"
                  icon="pi pi-user"
                />
                
                <ModernSelect
                  label="Anlagentyp"
                  options={[
                    { label: 'Aufdach-Anlage', value: 'aufdach' },
                    { label: 'Flachdach-Anlage', value: 'flachdach' },
                    { label: 'Freiflächen-Anlage', value: 'freiflaeche' }
                  ]}
                />

                <ModernInput
                  label="Gewünschte Leistung (kWp)"
                  type="number"
                  placeholder="z.B. 10"
                  icon="pi pi-bolt"
                />

                <ModernButton variant="primary" className="w-full">
                  <i className="pi pi-plus mr-2"></i>
                  Projekt erstellen
                </ModernButton>
              </div>
            </ModernCard>

            <ModernCard
              title="Schnellaktionen"
              variant="subtle"
              size="lg"
            >
              <div className="space-y-3">
                <ModernButton 
                  outlined 
                  className="w-full justify-content-start"
                  icon="pi pi-calculator"
                >
                  PV-Rechner starten
                </ModernButton>
                
                <ModernButton 
                  outlined 
                  className="w-full justify-content-start"
                  icon="pi pi-file-import"
                >
                  Stammdaten importieren
                </ModernButton>
                
                <ModernButton 
                  outlined 
                  className="w-full justify-content-start"
                  icon="pi pi-chart-line"
                >
                  Berichte generieren
                </ModernButton>

                <ModernButton 
                  outlined 
                  className="w-full justify-content-start"
                  icon="pi pi-cog"
                >
                  Einstellungen
                </ModernButton>
              </div>
            </ModernCard>
          </ResponsiveGrid>

          {/* Aktuelle Projekte */}
          <ModernCard
            title="Aktuelle Projekte"
            variant="default"
            size="lg"
          >
            <ResponsiveTable
              data={projectData}
              columns={tableColumns}
              mobileCardTemplate={mobileCardTemplate}
              emptyMessage="Keine Projekte vorhanden"
            />
          </ModernCard>
        </ResponsiveContainer>
      </div>
    </WorkflowProvider>
  );
};

export default PVOfferExample;
