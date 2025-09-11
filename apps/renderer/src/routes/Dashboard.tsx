import React, { useState, useEffect } from "react";
import ProjectDashboard_PrimeReact from "../components/ProjectDashboard_PrimeReact";

// Extended Dashboard with Calculation Bridge Integration
declare global {
  interface Window {
    calculationAPI: any;
  }
}

interface CalculationResult {
  base_matrix_price_netto?: number;
  total_investment_netto?: number;
  total_investment_brutto?: number;
  anlage_kwp?: number;
  annual_pv_production_kwh?: number;
  einspeiseverguetung_total?: number;
  wirtschaftlichkeit_score?: number;
  amortization_years?: number;
  [key: string]: any;
}

export default function Dashboard(): JSX.Element {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    totalProjects: 0,
    totalInvestment: 0,
    averageROI: 0,
    totalCapacity: 0
  });

  // Load latest calculation results for dashboard
  const loadLatestCalculations = async () => {
    setLoading(true);
    try {
      // Sample calculation for demo - would normally load from projects
      const sampleData = {
        anlage_kwp: 10.5,
        module_count: 25,
        selected_module_id: 150,
        selected_inverter_id: null,
        selected_battery_id: null,
        annual_consumption_kwh: 4500,
        eigenverbrauchsanteil_percent: 70,
        electricity_price_cent_per_kwh: 30
      };

      const result = await window.calculationAPI.performCalculations(sampleData);
      if (result && result.success) {
        setCalculationResults(result.data);
        updateKPIs(result.data);
      }
    } catch (error) {
      console.error('Failed to load calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateKPIs = (calculations: CalculationResult) => {
    setKpis({
      totalProjects: 1, // Would be from database in real app
      totalInvestment: calculations.total_investment_netto || 0,
      averageROI: calculations.wirtschaftlichkeit_score || 0,
      totalCapacity: calculations.anlage_kwp || 0
    });
  };

  useEffect(() => {
    if (window.calculationAPI) {
      loadLatestCalculations();
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Dashboard mit Live-Berechnungen</h1>
      
      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
            {kpis.totalCapacity.toFixed(1)}
          </h3>
          <p style={{ margin: 0 }}>kWp Gesamtleistung</p>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
            €{(kpis.totalInvestment / 1000).toFixed(0)}k
          </h3>
          <p style={{ margin: 0 }}>Gesamtinvestition</p>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffc107', 
          color: '#212529', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
            {kpis.averageROI.toFixed(1)}%
          </h3>
          <p style={{ margin: 0 }}>Wirtschaftlichkeit</p>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
            {calculationResults?.amortization_years?.toFixed(1) || '0'}
          </h3>
          <p style={{ margin: 0 }}>Jahre Amortisation</p>
        </div>
      </div>

      {/* Live Calculation Results */}
      {calculationResults && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h2>🧮 Live-Berechnungsergebnisse</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>💰 Finanzielle Kennzahlen</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Netto-Investition:</strong> €{(calculationResults.total_investment_netto || 0).toLocaleString()}
                </li>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Brutto-Investition:</strong> €{(calculationResults.total_investment_brutto || 0).toLocaleString()}
                </li>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Matrix-Grundpreis:</strong> €{(calculationResults.base_matrix_price_netto || 0).toLocaleString()}
                </li>
                <li style={{ padding: '5px 0' }}>
                  <strong>Einspeisevergütung (Total):</strong> €{(calculationResults.einspeiseverguetung_total || 0).toLocaleString()}
                </li>
              </ul>
            </div>

            <div>
              <h4>⚡ Technische Kennzahlen</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Anlagenleistung:</strong> {(calculationResults.anlage_kwp || 0).toFixed(2)} kWp
                </li>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Jahresertrag:</strong> {(calculationResults.annual_pv_production_kwh || 0).toLocaleString()} kWh
                </li>
                <li style={{ padding: '5px 0', borderBottom: '1px solid #dee2e6' }}>
                  <strong>Wirtschaftlichkeit:</strong> {(calculationResults.wirtschaftlichkeit_score || 0).toFixed(1)}%
                </li>
                <li style={{ padding: '5px 0' }}>
                  <strong>Amortisationszeit:</strong> {(calculationResults.amortization_years || 0).toFixed(1)} Jahre
                </li>
              </ul>
            </div>
          </div>

          <button 
            onClick={loadLatestCalculations}
            disabled={loading}
            style={{ 
              marginTop: '15px',
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Berechnet...' : '🔄 Berechnungen aktualisieren'}
          </button>
        </div>
      )}

      {/* Original Dashboard Component */}
      <div style={{ marginTop: '30px' }}>
        <h2>📋 Projekt-Dashboard</h2>
        <ProjectDashboard_PrimeReact />
      </div>
    </div>
  );
}
