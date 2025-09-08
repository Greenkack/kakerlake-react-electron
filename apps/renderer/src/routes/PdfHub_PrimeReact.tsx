/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

// Navigationskomponente für PDF-Seiten
function PdfNavigation() {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/pdf', label: 'PDF-Hub', icon: 'pi-file-pdf' },
    { path: '/pdf/standard', label: 'Standard', icon: 'pi-file' },
    { path: '/pdf/extended', label: 'Erweitert', icon: 'pi-file-excel' },
    { path: '/pdf/multi', label: 'Multi-PDF', icon: 'pi-copy' },
    { path: '/pdf/preview', label: 'Vorschau', icon: 'pi-eye' },
  ];
  
  return (
    <Panel className="neon-panel mb-4">
      <div className="flex flex-wrap gap-2 p-2">
        {navigationItems.map((item) => (
          <Link key={item.path} to={item.path} className="no-underline">
            <Button
              label={item.label}
              icon={`pi ${item.icon}`}
              className={
                location.pathname === item.path
                  ? 'p-button-success'
                  : 'p-button-outlined p-button-secondary'
              }
              size="small"
            />
          </Link>
        ))}
        <Link to="/" className="ml-auto no-underline">
          <Button
            label="Startseite"
            icon="pi pi-home"
            className="p-button-text"
            size="small"
          />
        </Link>
      </div>
    </Panel>
  );
}

function PdfStandard() {
  const pdfTypes = [
    {
      title: 'PV-Standard-PDF',
      description: 'Klassisches Photovoltaik-Angebot mit 7 Seiten',
      icon: 'pi-bolt',
      color: 'success',
    },
    {
      title: 'WP-Standard-PDF', 
      description: 'Wärmepumpen-Angebot mit spezialisierten Templates',
      icon: 'pi-fire',
      color: 'danger',
    },
    {
      title: 'Kombiniertes PV+WP-PDF',
      description: 'Komplettlösung für Photovoltaik und Wärmepumpe',
      icon: 'pi-cog',
      color: 'info',
    },
  ];

  return (
    <div className="pdf-container p-4">
      <PdfNavigation />
      <Card title="Standard-PDF Generator" className="neon-card">
        <div className="mb-4">
          <p className="text-color-secondary">
            Klassisches Angebot mit PV-Templates (nt_nt_01 bis nt_nt_07) oder 
            WP-Templates (hp_nt_01 bis hp_nt_07).
          </p>
        </div>
        
        <div className="grid">
          {pdfTypes.map((type, index) => (
            <div key={index} className="col-12 md:col-4">
              <Card className="neon-card h-full">
                <div className="text-center">
                  <i className={`pi ${type.icon} text-6xl text-primary mb-3 block`}></i>
                  <h4 className="text-primary mb-2">{type.title}</h4>
                  <p className="text-color-secondary text-sm mb-4">
                    {type.description}
                  </p>
                  <Button
                    label="Generieren"
                    icon="pi pi-download"
                    className={`p-button-${type.color} w-full`}
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PdfExtended() {
  const [selectedOptions, setSelectedOptions] = React.useState({
    datasheets: false,
    charts: false,
    company: false,
    terms: false,
  });

  const handleOptionChange = (option: string, checked: boolean) => {
    setSelectedOptions(prev => ({ ...prev, [option]: checked }));
  };

  return (
    <div className="pdf-container p-4">
      <PdfNavigation />
      <Card title="Erweiterte PDF-Ausgabe" className="neon-card">
        <div className="mb-4">
          <p className="text-color-secondary">
            Standard-PDF plus zusätzliche Optionen wie Datenblätter, Diagramme, 
            Firmen-Dokumente und AGB.
          </p>
        </div>

        <Panel header="Zusätzliche Inhalte" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="datasheets"
                  checked={selectedOptions.datasheets}
                  onChange={(e) => handleOptionChange('datasheets', e.checked!)}
                />
                <label htmlFor="datasheets" className="ml-2">
                  <i className="pi pi-file mr-2"></i>
                  Produkt-Datenblätter
                </label>
              </div>
              
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="charts"
                  checked={selectedOptions.charts}
                  onChange={(e) => handleOptionChange('charts', e.checked!)}
                />
                <label htmlFor="charts" className="ml-2">
                  <i className="pi pi-chart-line mr-2"></i>
                  Wirtschaftlichkeits-Diagramme
                </label>
              </div>
            </div>
            
            <div className="col-12 md:col-6">
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="company"
                  checked={selectedOptions.company}
                  onChange={(e) => handleOptionChange('company', e.checked!)}
                />
                <label htmlFor="company" className="ml-2">
                  <i className="pi pi-building mr-2"></i>
                  Firmen-Logos & Zertifikate
                </label>
              </div>
              
              <div className="field-checkbox mb-3">
                <Checkbox
                  inputId="terms"
                  checked={selectedOptions.terms}
                  onChange={(e) => handleOptionChange('terms', e.checked!)}
                />
                <label htmlFor="terms" className="ml-2">
                  <i className="pi pi-book mr-2"></i>
                  AGB & Vertragskonditionen
                </label>
              </div>
            </div>
          </div>
        </Panel>

        <Button
          label="Erweiterte PDF generieren"
          icon="pi pi-download"
          className="p-button-success w-full p-button-lg"
        />
      </Card>
    </div>
  );
}

function PdfMulti() {
  const [firmCount, setFirmCount] = React.useState(2);
  const [priceStaffing, setPriceStaffing] = React.useState('linear');
  const [rotation, setRotation] = React.useState('linear');

  const firmOptions = [
    { label: '2 Firmen', value: 2 },
    { label: '3 Firmen', value: 3 },
    { label: '5 Firmen', value: 5 },
  ];

  const priceOptions = [
    { label: 'Linear (-5%, -10%, -15%)', value: 'linear' },
    { label: 'Zufällig (±5-15%)', value: 'random' },
    { label: 'Kategoriespezifisch', value: 'category' },
  ];

  const rotationOptions = [
    { label: 'Linear', value: 'linear' },
    { label: 'Zufällig', value: 'random' },
    { label: 'Nach Firmengröße', value: 'company-size' },
  ];

  return (
    <div className="pdf-container p-4">
      <PdfNavigation />
      <Card title="Multi-PDF Generation" className="neon-card">
        <div className="mb-4">
          <p className="text-color-secondary">
            Erstellt mehrere Angebote verschiedener Firmen mit unterschiedlichen 
            Preisen und Brandings als ZIP-Download.
          </p>
        </div>

        <div className="grid">
          <div className="col-12 md:col-4">
            <div className="field mb-4">
              <label htmlFor="firms" className="block text-color font-medium mb-2">
                Anzahl Firmen
              </label>
              <Dropdown
                inputId="firms"
                value={firmCount}
                options={firmOptions}
                onChange={(e) => setFirmCount(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-12 md:col-4">
            <div className="field mb-4">
              <label htmlFor="pricing" className="block text-color font-medium mb-2">
                Preis-Staffelung
              </label>
              <Dropdown
                inputId="pricing"
                value={priceStaffing}
                options={priceOptions}
                onChange={(e) => setPriceStaffing(e.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-12 md:col-4">
            <div className="field mb-4">
              <label htmlFor="rotation" className="block text-color font-medium mb-2">
                Rotation
              </label>
              <Dropdown
                inputId="rotation"
                value={rotation}
                options={rotationOptions}
                onChange={(e) => setRotation(e.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Divider />

        <div className="text-center">
          <Badge value={firmCount} className="mr-2"></Badge>
          <span className="text-color-secondary">
            Firmen werden mit {priceStaffing} Preisgestaltung und {rotation} Rotation erstellt
          </span>
        </div>

        <div className="mt-4">
          <Button
            label="Multi-PDF erstellen (ZIP-Download)"
            icon="pi pi-download"
            className="p-button-warning w-full p-button-lg"
          />
        </div>
      </Card>
    </div>
  );
}

function PdfPreview() {
  const [previewMode, setPreviewMode] = React.useState('quick');

  const previewOptions = [
    { label: 'Schnellvorschau (3 Sek.)', value: 'quick', icon: 'pi-flash' },
    { label: 'Vollständige Vorschau', value: 'full', icon: 'pi-file' },
    { label: 'Seitenweise durchblättern', value: 'pages', icon: 'pi-step-forward' },
  ];

  return (
    <div className="pdf-container p-4">
      <PdfNavigation />
      <Card title="PDF-Vorschau" className="neon-card">
        <div className="mb-4">
          <p className="text-color-secondary">
            Schnellvorschau, vollständige Vorschau oder seitenweise Ansicht 
            mit Zoom und Debug-Overlay.
          </p>
        </div>

        <div className="grid mb-4">
          {previewOptions.map((option) => (
            <div key={option.value} className="col-12 md:col-4">
              <Button
                label={option.label}
                icon={`pi ${option.icon}`}
                className={
                  previewMode === option.value
                    ? 'p-button-success w-full'
                    : 'p-button-outlined w-full'
                }
                onClick={() => setPreviewMode(option.value)}
              />
            </div>
          ))}
        </div>

        <Panel header="PDF-Vorschau" className="preview-panel">
          <div className="text-center p-8 border-2 border-dashed border-primary-300">
            <i className="pi pi-file-pdf text-6xl text-primary mb-4 block"></i>
            <p className="text-color-secondary">
              PDF-Vorschau wird hier angezeigt
            </p>
            <p className="text-sm text-color-secondary">
              Modus: {previewOptions.find(o => o.value === previewMode)?.label}
            </p>
          </div>
        </Panel>
      </Card>
    </div>
  );
}

function PdfHubMain() {
  const hubCards = [
    {
      title: 'Standard-PDF',
      description: 'Klassische 7-seitige Angebote für PV oder Wärmepumpen',
      icon: 'pi-file',
      path: '/pdf/standard',
      color: 'success',
    },
    {
      title: 'Erweiterte PDF',
      description: 'Standard + Datenblätter, Diagramme und Zusatzdokumente',
      icon: 'pi-file-excel',
      path: '/pdf/extended',
      color: 'info',
    },
    {
      title: 'Multi-PDF',
      description: 'Mehrere Angebote verschiedener Firmen als ZIP-Download',
      icon: 'pi-copy',
      path: '/pdf/multi',
      color: 'warning',
    },
    {
      title: 'Vorschau',
      description: 'PDF-Vorschau mit Zoom und Debug-Funktionen',
      icon: 'pi-eye',
      path: '/pdf/preview',
      color: 'help',
    },
  ];

  return (
    <div className="pdf-container p-4">
      <PdfNavigation />
      
      {/* Header */}
      <Panel className="text-center mb-6 neon-panel">
        <div className="p-4">
          <i className="pi pi-file-pdf text-6xl text-primary mb-4 block"></i>
          <h2 className="text-4xl font-bold text-primary mb-4">PDF-Generator Hub</h2>
          <p className="text-color-secondary text-lg max-w-2xl mx-auto">
            Erstellen Sie professionelle PV-Angebote in verschiedenen Varianten. 
            Von Standard-PDFs bis hin zu erweiterten Multi-Angeboten.
          </p>
        </div>
      </Panel>

      {/* Main Cards */}
      <div className="grid">
        {hubCards.map((card, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Link to={card.path} className="no-underline">
              <Card className="neon-card h-full hover-card cursor-pointer">
                <div className="text-center p-4">
                  <i className={`pi ${card.icon} text-6xl text-primary mb-4 block`}></i>
                  <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                  <p className="text-color-secondary text-sm">
                    {card.description}
                  </p>
                  <div className="mt-4">
                    <Button
                      label="Öffnen"
                      icon="pi pi-arrow-right"
                      className={`p-button-${card.color} p-button-outlined`}
                      size="small"
                    />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PdfHub(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<PdfHubMain />} />
      <Route path="/standard" element={<PdfStandard />} />
      <Route path="/extended" element={<PdfExtended />} />
      <Route path="/multi" element={<PdfMulti />} />
      <Route path="/preview" element={<PdfPreview />} />
    </Routes>
  );
}
