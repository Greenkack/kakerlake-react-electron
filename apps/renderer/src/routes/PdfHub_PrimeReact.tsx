/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

// Navigationskomponente für PDF-Seiten
function PdfNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/pdf', label: 'PDF-Hub', icon: 'pi-file' },
    { path: '/pdf/standard', label: 'Standard', icon: 'pi-file-pdf' },
    { path: '/pdf/extended', label: 'Erweitert', icon: 'pi-list' },
    { path: '/pdf/multi', label: 'Multi-PDF', icon: 'pi-copy' },
    { path: '/pdf/preview', label: 'Vorschau', icon: 'pi-eye' }
  ];

  return (
    <Card className="mb-4">
      <div className="flex flex-wrap gap-2">
        {navItems.map(item => (
          <Link key={item.path} to={item.path}>
            <Button
              label={item.label}
              icon={item.icon}
              className={`p-button-sm ${
                location.pathname === item.path 
                  ? 'p-button-raised' 
                  : 'p-button-outlined'
              }`}
            />
          </Link>
        ))}
        <div className="ml-auto">
          <Link to="/home">
            <Button
              label="Zurück"
              icon="pi pi-arrow-left"
              className="p-button-text p-button-sm"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
}

// Standard-PDF Seite
function StandardPdf() {
  const [isGenerating, setIsGenerating] = useState(false);

  const templateOptions = [
    { label: 'Template A (Standard)', value: 'template_a' },
    { label: 'Template B (Modern)', value: 'template_b' },
    { label: 'Template C (Kompakt)', value: 'template_c' }
  ];

  return (
    <div className="p-3">
      <PdfNavigation />
      
      <Card 
        title="📑 Standard-PDF (7 Seiten)"
        className="w-full"
        pt={{
          body: { className: 'p-4' },
          content: { className: 'p-0' }
        }}
      >
        <p className="text-600 mb-4">
          Generieren Sie ein standardisiertes 7-seitiges PV-Angebot mit allen wichtigen Informationen.
        </p>
        
        <Divider />
        
        <div className="space-y-4">
          <Panel header="Template-Auswahl" className="w-full">
            <Dropdown 
              options={templateOptions}
              placeholder="Wählen Sie ein Template"
              className="w-full"
            />
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              label="PDF erstellen"
              icon="pi pi-file-pdf"
              className="p-button-success"
              loading={isGenerating}
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 2000);
              }}
            />
            <Button
              label="Vorschau"
              icon="pi pi-eye"
              className="p-button-outlined"
            />
            <Button
              label="Template bearbeiten"
              icon="pi pi-cog"
              className="p-button-text"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Erweiterte PDF Seite
function ExtendedPdf() {
  const [options, setOptions] = useState({
    includeCharts: true,
    includeCompanyDocs: false,
    includeTechnicalDetails: true,
    includeFinancialAnalysis: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="p-3">
      <PdfNavigation />
      
      <Card 
        title="📋 Erweiterte PDF-Ausgabe"
        className="w-full"
      >
        <p className="text-600 mb-4">
          Erstellen Sie eine umfassende PDF mit zusätzlichen Analysen und benutzerdefinierten Optionen.
        </p>
        
        <Divider />
        
        <div className="space-y-4">
          <Panel header="PDF-Optionen" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId="charts"
                  checked={options.includeCharts}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeCharts: e.checked!
                  }))}
                />
                <label htmlFor="charts" className="text-sm">
                  Charts und Diagramme einschließen
                </label>
              </div>

              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId="company"
                  checked={options.includeCompanyDocs}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeCompanyDocs: e.checked!
                  }))}
                />
                <label htmlFor="company" className="text-sm">
                  Firmendokumente anhängen
                </label>
              </div>

              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId="technical"
                  checked={options.includeTechnicalDetails}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeTechnicalDetails: e.checked!
                  }))}
                />
                <label htmlFor="technical" className="text-sm">
                  Technische Details
                </label>
              </div>

              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId="financial"
                  checked={options.includeFinancialAnalysis}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeFinancialAnalysis: e.checked!
                  }))}
                />
                <label htmlFor="financial" className="text-sm">
                  Finanzanalyse
                </label>
              </div>
            </div>
          </Panel>

          <Button
            label="Erweiterte PDF erstellen"
            icon="pi pi-file-pdf"
            className="w-full p-button-success"
            loading={isGenerating}
            onClick={() => {
              setIsGenerating(true);
              setTimeout(() => setIsGenerating(false), 3000);
            }}
          />
        </div>
      </Card>
    </div>
  );
}

// Multi-PDF Generation Seite
function MultiPdf() {
  const [config, setConfig] = useState({
    firmCount: 3,
    priceStaffing: 'standard',
    rotation: 'automatic'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const firmOptions = [
    { label: '2 Firmen', value: 2 },
    { label: '3 Firmen', value: 3 },
    { label: '4 Firmen', value: 4 },
    { label: '5 Firmen', value: 5 }
  ];

  const staffingOptions = [
    { label: 'Standard-Preise', value: 'standard' },
    { label: 'Gestaffelt (5%, 10%, 15%)', value: 'graduated' },
    { label: 'Individuell', value: 'custom' }
  ];

  const rotationOptions = [
    { label: 'Automatisch', value: 'automatic' },
    { label: 'Manuell festgelegt', value: 'manual' },
    { label: 'Keine Rotation', value: 'none' }
  ];

  return (
    <div className="p-3">
      <PdfNavigation />
      
      <Card 
        title="📚 Multi-PDF Generation"
        className="w-full"
      >
        <p className="text-600 mb-4">
          Erstellen Sie mehrere PDF-Varianten für verschiedene Firmen mit unterschiedlichen Preisen.
        </p>
        
        <Divider />
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel header="Anzahl Firmen" className="w-full">
              <Dropdown
                value={config.firmCount}
                options={firmOptions}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  firmCount: e.value
                }))}
                className="w-full"
              />
            </Panel>

            <Panel header="Preis-Staffelung" className="w-full">
              <Dropdown
                value={config.priceStaffing}
                options={staffingOptions}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  priceStaffing: e.value
                }))}
                className="w-full"
              />
            </Panel>

            <Panel header="Rotation" className="w-full">
              <Dropdown
                value={config.rotation}
                options={rotationOptions}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  rotation: e.value
                }))}
                className="w-full"
              />
            </Panel>
          </div>

          <Message
            severity="info"
            text={`Es werden ${config.firmCount} PDF-Dateien mit ${config.priceStaffing} Preismodell erstellt.`}
          />

          <Button
            label={`${config.firmCount} PDFs generieren`}
            icon="pi pi-copy"
            className="w-full p-button-success"
            loading={isGenerating}
            onClick={() => {
              setIsGenerating(true);
              setTimeout(() => setIsGenerating(false), 4000);
            }}
          />
        </div>
      </Card>
    </div>
  );
}

// PDF-Vorschau Seite
function PdfPreview() {
  const [selectedPages, setSelectedPages] = useState([1, 2, 3]);

  const pages = [
    { id: 1, title: 'Deckblatt', description: 'Firmenlogo und Projektdaten' },
    { id: 2, title: 'Anschreiben', description: 'Persönliche Ansprache' },
    { id: 3, title: 'Anlagendaten', description: 'Technische Spezifikationen' },
    { id: 4, title: 'Wirtschaftlichkeit', description: 'Kosten und Amortisation' },
    { id: 5, title: 'Produktübersicht', description: 'Module und Wechselrichter' },
    { id: 6, title: 'Montage', description: 'Installation und Service' },
    { id: 7, title: 'Anhang', description: 'Zertifikate und Garantien' }
  ];

  return (
    <div className="p-3">
      <PdfNavigation />
      
      <Card 
        title="👁️ PDF-Vorschau"
        className="w-full"
      >
        <p className="text-600 mb-4">
          Betrachten Sie die PDF-Struktur und wählen Sie Seiten für die Generierung aus.
        </p>
        
        <Divider />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pages.map(page => (
            <Panel 
              key={page.id}
              header={
                <div className="flex align-items-center justify-content-between w-full">
                  <span>Seite {page.id}</span>
                  <Badge 
                    value={selectedPages.includes(page.id) ? "Aktiv" : "Inaktiv"}
                    severity={selectedPages.includes(page.id) ? "success" : "secondary"}
                  />
                </div>
              }
              className="w-full"
            >
              <div className="text-center">
                <h4 className="font-medium mb-2">{page.title}</h4>
                <p className="text-sm text-600 mb-3">{page.description}</p>
                
                <div className="flex flex-column gap-2">
                  <Button
                    label={selectedPages.includes(page.id) ? "Entfernen" : "Hinzufügen"}
                    size="small"
                    className={selectedPages.includes(page.id) ? "p-button-danger" : "p-button-success"}
                    onClick={() => {
                      if (selectedPages.includes(page.id)) {
                        setSelectedPages(prev => prev.filter(id => id !== page.id));
                      } else {
                        setSelectedPages(prev => [...prev, page.id]);
                      }
                    }}
                  />
                  <Button
                    label="Vorschau"
                    icon="pi pi-eye"
                    size="small"
                    className="p-button-outlined"
                  />
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <Divider />

        <div className="text-center">
          <Message
            severity="info"
            text={`${selectedPages.length} von ${pages.length} Seiten ausgewählt`}
            className="mb-3"
          />
          <Button
            label="Ausgewählte Seiten als PDF generieren"
            icon="pi pi-file-pdf"
            className="p-button-success"
            disabled={selectedPages.length === 0}
          />
        </div>
      </Card>
    </div>
  );
}

// Haupt-Hub Seite
function PdfHubHome() {
  return (
    <div className="p-3">
      <PdfNavigation />
      
      <Card 
        title="📄 PDF-Generator Hub"
        className="w-full mb-4"
      >
        <p className="text-600 text-lg">
          Zentrale Anlaufstelle für die PDF-Generierung Ihrer PV-Angebote
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/pdf/standard">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <i className="pi pi-file-pdf text-4xl text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Standard-PDF</h3>
              <p className="text-sm text-600">7-seitiges Standardangebot</p>
            </div>
          </Card>
        </Link>

        <Link to="/pdf/extended">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <i className="pi pi-list text-4xl text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Erweiterte PDF</h3>
              <p className="text-sm text-600">Mit zusätzlichen Optionen</p>
            </div>
          </Card>
        </Link>

        <Link to="/pdf/multi">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <i className="pi pi-copy text-4xl text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Multi-PDF</h3>
              <p className="text-sm text-600">Mehrere Firmen-Varianten</p>
            </div>
          </Card>
        </Link>

        <Link to="/pdf/preview">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <i className="pi pi-eye text-4xl text-orange-600 mb-3" />
              <h3 className="font-semibold mb-2">Vorschau</h3>
              <p className="text-sm text-600">PDF-Struktur betrachten</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// Haupt-Router Komponente
export default function PdfHub(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<PdfHubHome />} />
      <Route path="/standard" element={<StandardPdf />} />
      <Route path="/extended" element={<ExtendedPdf />} />
      <Route path="/multi" element={<MultiPdf />} />
      <Route path="/preview" element={<PdfPreview />} />
    </Routes>
  );
}
