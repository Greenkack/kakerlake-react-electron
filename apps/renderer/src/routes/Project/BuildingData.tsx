// apps/renderer/src/routes/Project/BuildingData.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuildingData(): JSX.Element {
  const nav = useNavigate();
  const [v, setV] = useState({
    baujahr: "",
    deckung: "Frankfurter Pfannen",
    ausrichtung: "Süd",
    dachart: "Satteldach",
    flaeche: "",
    neigung: "",
    hoeheUeber7m: false,
    koordinaten: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => { e.preventDefault(); nav("/calc/options"); }}
    >
      <h2 className="text-xl font-semibold">3) Daten des Gebäudes</h2>

      <div className="grid md:grid-cols-3 gap-3">
        <Txt label="Baujahr" value={v.baujahr} onChange={(x)=>setV({...v,baujahr:x})} />
        <Sel label="Dachdeckungsart" value={v.deckung} onChange={(x)=>setV({...v,deckung:x})} options={[
          "Frankfurter Pfannen","Trapezblech","Tonziegel","Biberschwanz","Schiefer","Bitumen","Eternit","Schindeln","Sonstiges"
        ]}/>
        <Sel label="Dachausrichtung" value={v.ausrichtung} onChange={(x)=>setV({...v,ausrichtung:x})} options={[
          "Süd","Südost","Ost","Südwest","West","Nordwest","Nord","Nordost","Flachdach Süd","Flachdach Ost-West"
        ]}/>
        <Sel label="Dachart" value={v.dachart} onChange={(x)=>setV({...v,dachart:x})} options={[
          "Satteldach","Satteldach mit Gaube","Pultdach","Flachdach","Walmdach","Krüppelwalmdach","Zeltdach","Sonstiges"
        ]}/>
        <Txt label="Freie Dachfläche (m²)" value={v.flaeche} onChange={(x)=>setV({...v,flaeche:x})}/>
        <Txt label="Dachneigung (Grad)" value={v.neigung} onChange={(x)=>setV({...v,neigung:x})}/>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={v.hoeheUeber7m} onChange={(e)=>setV({...v,hoeheUeber7m:e.target.checked})}/>
          <span>Gebäudehöhe &gt; 7 m</span>
        </label>
        <Txt label="Koordinaten (optional)" value={v.koordinaten} onChange={(x)=>setV({...v,koordinaten:x})}/>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">
          Nächster Bereich
        </button>
        <button className="px-4 py-2 rounded border" type="button" onClick={() => nav("/calc/menu")}>
          Abbrechen / Zurück zum Untermenü
        </button>
      </div>
    </form>
  );
}

function Txt({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return (
    <label className="block">
      <span className="block text-sm mb-1">{label}</span>
      <input className="border p-2 w-full" value={value} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}
function Sel({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}) {
  return (
    <label className="block">
      <span className="block text-sm mb-1">{label}</span>
      <select className="border p-2 w-full" value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
