// apps/renderer/src/routes/Project/BuildingData.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WizardNav from "../../components/WizardNav";
import { useProject } from "../../state/project";

export default function BuildingData(): JSX.Element {
  const nav = useNavigate();
  const { state, actions } = useProject();
  
  const [v, setV] = useState({
    baujahr: state.building.constructionYear?.toString() || "",
    deckung: "Frankfurter Pfannen",
    ausrichtung: state.building.roofOrientation || "Süd",
    dachart: state.building.roofType || "Satteldach",
    flaeche: state.building.roofArea?.toString() || "",
    neigung: state.building.roofTilt?.toString() || "",
    hoehe: "",
    hoeheUeber7m: false,
    koordinaten: "",
    verschattung: state.building.shadingFactors || "keine",
    dachzustand: "gut",
    statik_geprueft: false,
    denkmalschutz: false,
    brandschutz_beachten: false,
    kamin_vorhanden: false,
    kamin_position: "",
    gauben_anzahl: "",
    dachfenster_anzahl: "",
    solar_vorhanden: false,
    solar_typ: "",
    dachrinne_zustand: "gut",
    blitzschutz_vorhanden: false,
  });

  // Synchronisiere mit Project State
  useEffect(() => {
    actions.updateBuilding({
      constructionYear: parseInt(v.baujahr) || undefined,
      roofType: v.dachart,
      roofOrientation: v.ausrichtung,
      roofTilt: parseInt(v.neigung) || undefined,
      roofArea: parseInt(v.flaeche) || undefined,
      shadingFactors: v.verschattung,
    });
  }, [v.baujahr, v.dachart, v.ausrichtung, v.neigung, v.flaeche, v.verschattung, actions]);

  const requiredOk = v.baujahr.trim().length > 0 && v.flaeche.trim().length > 0 && v.neigung.trim().length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Projekt – Gebäudedaten</h2>
      <p className="text-slate-600">Detaillierte Angaben zum Gebäude für die optimale Anlagenplanung.</p>

      {/* Grunddaten */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Grunddaten des Gebäudes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Txt label="Baujahr *" value={v.baujahr} onChange={(x)=>setV({...v,baujahr:x})} placeholder="z.B. 1995" />
          <Txt label="Freie Dachfläche (m²) *" value={v.flaeche} onChange={(x)=>setV({...v,flaeche:x})} placeholder="z.B. 80" />
          <Txt label="Gebäudehöhe (m)" value={v.hoehe} onChange={(x)=>setV({...v,hoehe:x})} placeholder="z.B. 8.5" />
        </div>
      </div>

      {/* Dachspezifikationen */}
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
