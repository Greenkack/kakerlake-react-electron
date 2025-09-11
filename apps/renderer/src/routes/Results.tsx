import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 DEBUG: Results component mounted');
    console.log('📍 Location state:', location.state);
    
    if (!location.state || !location.state.results) {
      console.error('❌ No calculation results in location state!');
      setError('Keine Berechnungsergebnisse vorhanden. Bitte führen Sie zuerst eine Berechnung durch.');
      setLoading(false);
      return;
    }

    try {
      const calculationResults = location.state.results;
      console.log('✅ Calculation results found:', calculationResults);
      setResults(calculationResults);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error processing results:', err);
      setError('Fehler beim Verarbeiten der Ergebnisse');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Ergebnisse werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Fehler</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/solar-calculator')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zurück zum Kalkulator
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <div className="text-yellow-500 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">Keine Ergebnisse</h2>
          <p className="text-yellow-600">Es sind keine Berechnungsergebnisse vorhanden.</p>
          <button
            onClick={() => navigate('/solar-calculator')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Neue Berechnung starten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">📊 Berechnungsergebnisse</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">🐛 Debug-Informationen:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-sm text-blue-600 font-semibold uppercase">Anlagenleistung</h3>
            <p className="text-2xl font-bold text-blue-900">
              {results.anlage_kwp ? `${results.anlage_kwp} kWp` : 'N/A'}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-sm text-green-600 font-semibold uppercase">Jahresertrag</h3>
            <p className="text-2xl font-bold text-green-900">
              {results.annual_pv_production_kwh ? `${results.annual_pv_production_kwh.toLocaleString()} kWh` : 'N/A'}
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-sm text-yellow-600 font-semibold uppercase">Investition</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {results.total_investment_brutto ? `€${results.total_investment_brutto.toLocaleString()}` : 'N/A'}
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-sm text-purple-600 font-semibold uppercase">Amortisation</h3>
            <p className="text-2xl font-bold text-purple-900">
              {results.amortization_time_years ? `${results.amortization_time_years} Jahre` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">💰 Wirtschaftlichkeit</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Eigenverbrauchsquote:</span>
                <span className="font-semibold">
                  {results.self_supply_rate_percent ? `${results.self_supply_rate_percent}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Autarkiegrad:</span>
                <span className="font-semibold">
                  {results.autarky_rate_percent ? `${results.autarky_rate_percent}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rendite (ROI):</span>
                <span className="font-semibold">
                  {results.simple_roi_percent ? `${results.simple_roi_percent}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kapitalwert (NPV):</span>
                <span className="font-semibold">
                  {results.npv_20_years ? `€${results.npv_20_years.toLocaleString()}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🌱 Umweltbilanz</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>CO₂-Einsparung/Jahr:</span>
                <span className="font-semibold">
                  {results.co2_savings_annual_kg ? `${results.co2_savings_annual_kg.toLocaleString()} kg` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CO₂-Einsparung gesamt:</span>
                <span className="font-semibold">
                  {results.co2_savings_total_tons ? `${results.co2_savings_total_tons} t` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stromproduktion 25 Jahre:</span>
                <span className="font-semibold">
                  {results.total_production_25_years_kwh ? 
                    `${(results.total_production_25_years_kwh / 1000).toFixed(1)} MWh` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/solar-calculator')}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Neue Berechnung
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🖨️ Drucken
          </button>
          <button
            onClick={() => {
              console.log('PDF generation triggered');
            }}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            📄 PDF erstellen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
