// apps/renderer/src/routes/Project/BuildingData.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WizardNav from "../../components/WizardNav";
import { useProject } from "../../state/project";

// Intelligente Berechnungshilfen
const calculateOptimalTilt = (latitude: number): number => {
  // Optimale Dachneigung basierend auf Breitengrad Deutschland (47-55°N)
  return Math.round(latitude * 0.7 + 5);
}

const estimateRoofArea = (buildingType: string, livingSpace: number): number => {
  const factors = {
    'Einfamilienhaus': 0.8,
    'Zweifamilienhaus': 0.9,
    'Reihenhaus': 0.6,
    'Doppelhaushälfte': 0.7,
    'Bungalow': 1.2,
  };
  return Math.round((livingSpace * (factors[buildingType as keyof typeof factors] || 0.8)));
}

const getSolarIrradiationHint = (orientation: string, tilt: number): string => {
  if (orientation === 'Süd' && tilt >= 25 && tilt <= 40) {
    return '🌟 Optimal: Beste Sonneneinstrahlung erwartet!';
  } else if (orientation === 'Süd') {
    return '☀️ Sehr gut: Südausrichtung ist ideal';
  } else if (orientation === 'Ost' || orientation === 'West') {
    return '✅ Gut: Noch sehr rentabel';
  } else {
    return '⚠️ Bedingt: Eventuell geringere Erträge';
  }
}

export default function BuildingData(): JSX.Element {
  const nav = useNavigate();
  const { state, actions } = useProject();
  
  const [v, setV] = useState({
    // Erweiterte Gebäudedaten
    buildingType: state.building.buildingType || "Einfamilienhaus",
    livingSpace: state.building.livingSpace?.toString() || "",
    floors: state.building.floors?.toString() || "",
    baujahr: state.building.constructionYear?.toString() || "",
    
    // Dach-Grunddaten
    dachart: state.building.roofType || "Satteldach",
    ausrichtung: state.building.roofOrientation || "Süd",
    neigung: state.building.roofTilt?.toString() || "",
    flaeche: state.building.roofArea?.toString() || "",
    
    // Erweiterte Dach-Details
    deckung: "Frankfurter Pfannen",
    verschattung: state.building.shadingFactors || "keine",
    dachzustand: "gut",
    statik_geprueft: false,
    
    // Besonderheiten und Details
    denkmalschutz: false,
    kamin_vorhanden: false,
    kamin_position: "",
    gauben_anzahl: "",
    dachfenster_anzahl: "",
    solar_vorhanden: false,
    solar_typ: "",
    koordinaten: "",
    hoehe: "",
    hoeheUeber7m: false,
    brandschutz_beachten: false,
    dachrinne_zustand: "gut",
    blitzschutz_vorhanden: false,
    
    // Technische Details
    elektricalConnection: state.building.electricalConnection || "Standardanschluss",
    heatingSystem: state.building.heatingSystem || "Gas",
  });

  // Intelligente Berechnungen
  const calculations = useMemo(() => {
    const livingSpace = parseInt(v.livingSpace) || 0;
    const roofArea = parseInt(v.flaeche) || 0;
    const tilt = parseInt(v.neigung) || 0;
    
    const estimatedArea = livingSpace > 0 ? estimateRoofArea(v.buildingType, livingSpace) : 0;
    const optimalTilt = 35; // Deutschland-Durchschnitt
    const solarHint = roofArea > 0 ? getSolarIrradiationHint(v.ausrichtung, tilt) : '';
    
    // Geschätzte PV-Leistung (grob: 6-7 kWp pro 100m² nutzbarer Dachfläche)
    const estimatedPvPower = roofArea > 0 ? Math.round((roofArea * 0.065) * 10) / 10 : 0;
    
    return {
      estimatedRoofArea: estimatedArea,
      optimalTilt,
      solarHint,
      estimatedPvPower,
      usableRoofArea: Math.round(roofArea * 0.6) // 60% der Dachfläche meist nutzbar
    };
  }, [v.buildingType, v.livingSpace, v.flaeche, v.ausrichtung, v.neigung]);

  // Synchronisiere mit Project State
  useEffect(() => {
    actions.updateBuilding({
      buildingType: v.buildingType,
      livingSpace: parseInt(v.livingSpace) || undefined,
      floors: parseInt(v.floors) || undefined,
      constructionYear: parseInt(v.baujahr) || undefined,
      roofType: v.dachart,
      roofOrientation: v.ausrichtung,
      roofTilt: parseInt(v.neigung) || undefined,
      roofArea: parseInt(v.flaeche) || undefined,
      shadingFactors: v.verschattung,
      electricalConnection: v.elektricalConnection,
      heatingSystem: v.heatingSystem,
    });
  }, [Object.values(v), actions]);

  const requiredOk = v.baujahr.trim().length > 0 && v.flaeche.trim().length > 0 && v.neigung.trim().length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Projekt – Gebäudedaten</h2>
      <p className="text-slate-600">Detaillierte Angaben zum Gebäude für die optimale Anlagenplanung.</p>

      {/* Intelligente Berechnungshilfen */}
      {calculations.estimatedPvPower > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">🧠 Intelligente Analyse</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Geschätzte PV-Leistung:</strong> {calculations.estimatedPvPower} kWp
            </div>
            <div>
              <strong>Nutzbare Dachfläche:</strong> ~{calculations.usableRoofArea} m²
            </div>
            <div className="md:col-span-2">
              <strong>Bewertung:</strong> {calculations.solarHint}
            </div>
          </div>
          {v.neigung && parseInt(v.neigung) !== calculations.optimalTilt && (
            <div className="mt-2 text-blue-700">
              💡 <strong>Tipp:</strong> Optimale Dachneigung für Deutschland: {calculations.optimalTilt}°
            </div>
          )}
        </div>
      )}

      {/* Grunddaten des Gebäudes */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Grunddaten des Gebäudes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gebäudetyp</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.buildingType} 
              onChange={(e)=>setV({...v,buildingType:e.target.value})}
            >
              <option value="Einfamilienhaus">Einfamilienhaus</option>
              <option value="Zweifamilienhaus">Zweifamilienhaus</option>
              <option value="Reihenhaus">Reihenhaus</option>
              <option value="Doppelhaushälfte">Doppelhaushälfte</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Wohnfläche (m²)</label>
            <input 
              type="text" 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.livingSpace} 
              onChange={(e)=>setV({...v,livingSpace:e.target.value})} 
              placeholder="z.B. 150"
            />
            {calculations.estimatedRoofArea > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                Geschätzte Dachfläche: ~{calculations.estimatedRoofArea} m²
              </div>
            )}
          </div>
          
          <Txt label="Baujahr *" value={v.baujahr} onChange={(x)=>setV({...v,baujahr:x})} placeholder="z.B. 1995" />
        </div>
      </div>

      {/* Dach-Spezifikationen */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Dach-Spezifikationen</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dachtyp</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.dachart} 
              onChange={(e)=>setV({...v,dachart:e.target.value})}
            >
              <option value="Satteldach">Satteldach</option>
              <option value="Pultdach">Pultdach</option>
              <option value="Flachdach">Flachdach</option>
              <option value="Walmdach">Walmdach</option>
              <option value="Mansardendach">Mansardendach</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dachfläche verfügbar (m²) *</label>
            <input 
              type="text" 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.flaeche} 
              onChange={(e)=>setV({...v,flaeche:e.target.value})} 
              placeholder="z.B. 80"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dachausrichtung</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.ausrichtung} 
              onChange={(e)=>setV({...v,ausrichtung:e.target.value})}
            >
              <option value="Süd">Süd (optimal)</option>
              <option value="Süd-West">Süd-West</option>
              <option value="Süd-Ost">Süd-Ost</option>
              <option value="West">West</option>
              <option value="Ost">Ost</option>
              <option value="Nord">Nord</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dachneigung (°) *</label>
            <input 
              type="text" 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.neigung} 
              onChange={(e)=>setV({...v,neigung:e.target.value})} 
              placeholder="z.B. 35"
            />
            <div className="text-xs text-slate-500 mt-1">
              Optimal: 25-40° für Deutschland
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Verschattung</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.verschattung} 
              onChange={(e)=>setV({...v,verschattung:e.target.value})}
            >
              <option value="keine">Keine Verschattung</option>
              <option value="gering">Geringe Verschattung</option>
              <option value="mittel">Mittlere Verschattung</option>
              <option value="stark">Starke Verschattung</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dachzustand</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.dachzustand} 
              onChange={(e)=>setV({...v,dachzustand:e.target.value})}
            >
              <option value="sehr gut">Sehr gut (0-5 Jahre)</option>
              <option value="gut">Gut (5-15 Jahre)</option>
              <option value="befriedigend">Befriedigend (15-25 Jahre)</option>
              <option value="renovierungsbedürftig">Renovierungsbedürftig (&gt;25 Jahre)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technische Anschlüsse */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Technische Anschlüsse</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Elektroanschluss</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.elektricalConnection} 
              onChange={(e)=>setV({...v,elektricalConnection:e.target.value})}
            >
              <option value="Standardanschluss">Standardanschluss (3-phasig)</option>
              <option value="Starkstromanschluss">Starkstromanschluss vorhanden</option>
              <option value="Erweiterung nötig">Erweiterung erforderlich</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Heizsystem</label>
            <select 
              className="w-full rounded border border-slate-300 px-3 py-2" 
              value={v.heatingSystem} 
              onChange={(e)=>setV({...v,heatingSystem:e.target.value})}
            >
              <option value="Gas">Gas-Heizung</option>
              <option value="Öl">Öl-Heizung</option>
              <option value="Strom">Elektro-Heizung</option>
              <option value="Wärmepumpe">Wärmepumpe</option>
              <option value="Fernwärme">Fernwärme</option>
              <option value="Holz/Pellets">Holz/Pellets</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Dachspezifikationen</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Sel label="Dachart" value={v.dachart} onChange={(x)=>setV({...v,dachart:x})} options={[
            "Satteldach","Satteldach mit Gaube","Pultdach","Flachdach","Walmdach","Krüppelwalmdach","Zeltdach","Mansardendach","Tonnendach","Sonstiges"
          ]}/>
          <Sel label="Dachdeckungsart" value={v.deckung} onChange={(x)=>setV({...v,deckung:x})} options={[
            "Frankfurter Pfannen","Trapezblech","Tonziegel","Biberschwanz","Schiefer","Bitumen","Eternit","Schindeln","Reet","Sonstiges"
          ]}/>
          <Txt label="Dachneigung (Grad) *" value={v.neigung} onChange={(x)=>setV({...v,neigung:x})} placeholder="z.B. 35" />
          
          <Sel label="Dachausrichtung" value={v.ausrichtung} onChange={(x)=>setV({...v,ausrichtung:x})} options={[
            "Süd","Südost","Ost","Südwest","West","Nordwest","Nord","Nordost","Flachdach Süd","Flachdach Ost-West"
          ]}/>
          <Sel label="Dachzustand" value={v.dachzustand} onChange={(x)=>setV({...v,dachzustand:x})} options={[
            "sehr gut","gut","befriedigend","renovierungsbedürftig","schlecht"
          ]}/>
          <Sel label="Verschattung" value={v.verschattung} onChange={(x)=>setV({...v,verschattung:x})} options={[
            "keine","gering (< 10%)","mittel (10-25%)","stark (> 25%)"
          ]}/>
        </div>
      </div>

      {/* Dachaufbauten & Besonderheiten */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Dachaufbauten & Besonderheiten</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Txt label="Anzahl Gauben" value={v.gauben_anzahl} onChange={(x)=>setV({...v,gauben_anzahl:x})} placeholder="z.B. 2" />
          <Txt label="Anzahl Dachfenster" value={v.dachfenster_anzahl} onChange={(x)=>setV({...v,dachfenster_anzahl:x})} placeholder="z.B. 4" />
          <Txt label="Kamin-Position" value={v.kamin_position} onChange={(x)=>setV({...v,kamin_position:x})} placeholder="z.B. Mittig, Seite links" />
          
          <Sel label="Dachrinne Zustand" value={v.dachrinne_zustand} onChange={(x)=>setV({...v,dachrinne_zustand:x})} options={[
            "sehr gut","gut","renovierungsbedürftig","defekt"
          ]}/>
          <Txt label="Bestehende Solaranlage" value={v.solar_typ} onChange={(x)=>setV({...v,solar_typ:x})} placeholder="z.B. Solarthermie, PV 5kWp" />
          <Txt label="Koordinaten (optional)" value={v.koordinaten} onChange={(x)=>setV({...v,koordinaten:x})} placeholder="z.B. 51.1657, 10.4515" />
        </div>
      </div>

      {/* Checkboxen für spezielle Anforderungen */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Spezielle Anforderungen & Gegebenheiten</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.hoeheUeber7m} onChange={(e)=>setV({...v,hoeheUeber7m:e.target.checked})}/>
              <span>Gebäudehöhe &gt; 7 m (Gerüstkosten berücksichtigen)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.statik_geprueft} onChange={(e)=>setV({...v,statik_geprueft:e.target.checked})}/>
              <span>Statik bereits geprüft</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.denkmalschutz} onChange={(e)=>setV({...v,denkmalschutz:e.target.checked})}/>
              <span>Denkmalschutz zu beachten</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.brandschutz_beachten} onChange={(e)=>setV({...v,brandschutz_beachten:e.target.checked})}/>
              <span>Besondere Brandschutzauflagen</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.kamin_vorhanden} onChange={(e)=>setV({...v,kamin_vorhanden:e.target.checked})}/>
              <span>Kamin vorhanden</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.solar_vorhanden} onChange={(e)=>setV({...v,solar_vorhanden:e.target.checked})}/>
              <span>Bestehende Solaranlage vorhanden</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={v.blitzschutz_vorhanden} onChange={(e)=>setV({...v,blitzschutz_vorhanden:e.target.checked})}/>
              <span>Blitzschutzanlage vorhanden</span>
            </label>
          </div>
        </div>
      </div>

      <WizardNav
        backTo="/project/customer"
        nextTo="/project/demand"
        nextDisabled={!requiredOk}
      />
    </div>
  );
}

function Txt({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <input 
        className="w-full rounded border border-slate-300 px-3 py-2" 
        value={value} 
        onChange={(e)=>onChange(e.target.value)} 
        placeholder={placeholder}
      />
    </label>
  );
}

function Sel({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <select className="w-full rounded border border-slate-300 px-3 py-2" value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
