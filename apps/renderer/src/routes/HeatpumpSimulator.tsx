import React from "react";
import { Link } from "react-router-dom";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function HeatpumpSimulator(): JSX.Element {
  const header = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-bolt text-orange-500" />
      <span>Wärmepumpen-Simulator</span>
      <Badge value="Beta" severity="warning" />
    </div>
  );

  // Mock-Daten für Demonstration
  const buildingTypes = [
    { label: 'Einfamilienhaus', value: 'efh' },
    { label: 'Mehrfamilienhaus', value: 'mfh' },
    { label: 'Gewerbe', value: 'commercial' }
  ];

  const heatpumpTypes = [
    { label: 'Luft-Wasser', value: 'air_water' },
    { label: 'Sole-Wasser', value: 'ground_water' },
    { label: 'Wasser-Wasser', value: 'water_water' }
  ];

  const mockResults = [
    { parameter: 'Heizleistung', wert: '12 kW', einheit: 'kW' },
    { parameter: 'COP (Jahresarbeitszahl)', wert: '4.2', einheit: '-' },
    { parameter: 'Stromverbrauch', wert: '3.500', einheit: 'kWh/Jahr' },
    { parameter: 'Heizkosten/Jahr', wert: '1.200', einheit: '€' },
    { parameter: 'CO2-Einsparung', wert: '2.8', einheit: 't/Jahr' }
  ];

  return (
    <div className="mx-auto max-w-6xl p-3">
      <Card 
        title={header}
        className="mb-3"
        pt={{
          body: { className: 'p-4' },
          content: { className: 'p-0' }
        }}
      >
        <p className="text-700 mb-4">
          Hier kommen später Gebäudedaten, WP-Leistung, COP, Stromtarif, Lastprofile usw.
        </p>

        <Message 
          severity="warn" 
          text="🚧 Dieses Modul wird bald mit umfangreichen Wärmepumpen-Berechnungen erweitert."
          className="mb-4"
        />

        <Divider />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Eingabeparameter */}
          <Panel header="Gebäude- und Systemdaten" className="w-full">
            <div className="space-y-4">
              <div className="field">
                <label className="block text-sm font-medium mb-2">Gebäudetyp</label>
                <Dropdown 
                  options={buildingTypes} 
                  placeholder="Gebäudetyp wählen"
                  className="w-full"
                />
              </div>

              <div className="field">
                <label className="block text-sm font-medium mb-2">Wohnfläche (m²)</label>
                <InputNumber 
                  placeholder="150"
                  className="w-full"
                  suffix=" m²"
                />
              </div>

              <div className="field">
                <label className="block text-sm font-medium mb-2">Wärmepumpentyp</label>
                <Dropdown 
                  options={heatpumpTypes} 
                  placeholder="WP-Typ wählen"
                  className="w-full"
                />
              </div>

              <div className="field">
                <label className="block text-sm font-medium mb-2">
                  Heizleistung: <span className="font-bold">12 kW</span>
                </label>
                <Slider 
                  value={12} 
                  min={5} 
                  max={25} 
                  className="w-full"
                />
              </div>

              <div className="field">
                <label className="block text-sm font-medium mb-2">Strompreis (ct/kWh)</label>
                <InputNumber 
                  placeholder="35"
                  className="w-full"
                  suffix=" ct/kWh"
                />
              </div>
            </div>
          </Panel>

          {/* Ergebnisse */}
          <Panel header="Berechnungsergebnisse" className="w-full">
            <DataTable 
              value={mockResults} 
              size="small"
              pt={{
                wrapper: { className: 'border-round' }
              }}
            >
              <Column 
                field="parameter" 
                header="Parameter" 
                style={{ width: '50%' }}
              />
              <Column 
                field="wert" 
                header="Wert" 
                style={{ width: '30%' }}
                body={(rowData) => (
                  <span className="font-medium text-primary">
                    {rowData.wert}
                  </span>
                )}
              />
              <Column 
                field="einheit" 
                header="Einheit" 
                style={{ width: '20%' }}
                body={(rowData) => (
                  <span className="text-600">
                    {rowData.einheit}
                  </span>
                )}
              />
            </DataTable>

            <div className="mt-4 p-3 bg-green-50 border-round">
              <div className="flex align-items-center gap-2 text-green-700">
                <i className="pi pi-check-circle" />
                <span className="font-medium">Wirtschaftlichkeit: Sehr gut</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Amortisation nach ca. 8-10 Jahren bei aktuellen Energiepreisen.
              </p>
            </div>
          </Panel>
        </div>

        <Divider />

        <div className="flex justify-content-center">
          <Link to="/home">
            <Button 
              label="Zurück zur Startseite"
              icon="pi pi-arrow-left"
              className="p-button-outlined"
            />
          </Link>
        </div>
      </Card>
    </div>
  );
}
