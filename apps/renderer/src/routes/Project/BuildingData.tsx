// PATCH: Wizard-Navigation entfernt, Save-Flow hinzugefügt
// ...bestehende Importe belassen...
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../state/project";

export default function BuildingData(): JSX.Element {
  const nav = useNavigate();
  const { state, actions } = useProject();
  const initializedRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"done"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [v, setV] = useState({
    buildingType: state.building.buildingType || "Einfamilienhaus",
    livingSpace: state.building.livingSpace?.toString() || "",
    floors: state.building.floors?.toString() || "",
    baujahr: state.building.constructionYear?.toString() || "",
    dachart: state.building.roofType || "Satteldach",
    ausrichtung: state.building.roofOrientation || "Süd",
    neigung: state.building.roofTilt?.toString() || "",
    flaeche: state.building.roofArea?.toString() || "",
    deckung: "Frankfurter Pfannen",
    verschattung: state.building.shadingFactors || "keine",
    dachzustand: "gut",
    statik_geprueft: false,
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
    elektricalConnection: state.building.electricalConnection || "Standardanschluss",
    heatingSystem: state.building.heatingSystem || "Gas",
  });

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const b = state.building;
    setV(prev => ({
      ...prev,
      buildingType: b.buildingType || prev.buildingType,
      livingSpace: b.livingSpace?.toString() || prev.livingSpace,
      floors: b.floors?.toString() || prev.floors,
      baujahr: b.constructionYear?.toString() || prev.baujahr,
      dachart: b.roofType || prev.dachart,
      ausrichtung: b.roofOrientation || prev.ausrichtung,
      neigung: b.roofTilt?.toString() || prev.neigung,
      flaeche: b.roofArea?.toString() || prev.flaeche,
      verschattung: b.shadingFactors || prev.verschattung,
      elektricalConnection: b.electricalConnection || prev.elektricalConnection,
      heatingSystem: b.heatingSystem || prev.heatingSystem,
    }));
  }, [state.building]);

  const calculations = useMemo(() => {
    const livingSpace = parseInt(v.livingSpace) || 0;
    const roofArea = parseInt(v.flaeche) || 0;
    const tilt = parseInt(v.neigung) || 0;
    const estimatedPvPower = roofArea > 0 ? Math.round((roofArea * 0.065) * 10) / 10 : 0;
    const usableRoofArea = Math.round(roofArea * 0.6);
    return {
      estimatedPvPower,
      usableRoofArea,
      optimalTilt: 35,
      solarHint:
        roofArea > 0
          ? (v.ausrichtung === "Süd" && tilt >= 25 && tilt <= 40
              ? "🌟 Optimal"
              : v.ausrichtung === "Süd"
              ? "☀️ Sehr gut"
              : (v.ausrichtung === "Ost" || v.ausrichtung === "West")
              ? "✅ Gut"
              : "⚠️ Mäßig")
          : ""
    };
  }, [v.ausrichtung, v.flaeche, v.neigung, v.livingSpace]);

  const lastSignatureRef = useRef<string>("");
  useEffect(() => {
    const patch = {
      buildingType: v.buildingType,
      livingSpace: v.livingSpace.trim() ? parseInt(v.livingSpace) : undefined,
      floors: v.floors.trim() ? parseInt(v.floors) : undefined,
      constructionYear: v.baujahr.trim() ? parseInt(v.baujahr) : undefined,
      roofType: v.dachart,
      roofOrientation: v.ausrichtung,
      roofTilt: v.neigung.trim() ? parseInt(v.neigung) : undefined,
      roofArea: v.flaeche.trim() ? parseInt(v.flaeche) : undefined,
      shadingFactors: v.verschattung,
      electricalConnection: v.elektricalConnection,
      heatingSystem: v.heatingSystem,
    };
    const signature = JSON.stringify(patch);
    if (signature !== lastSignatureRef.current) {
      lastSignatureRef.current = signature;
      actions.updateBuilding(patch);
    }
  }, [
    v.buildingType,
    v.livingSpace,
    v.floors,
    v.baujahr,
    v.dachart,
    v.ausrichtung,
    v.neigung,
    v.flaeche,
    v.verschattung,
    v.elektricalConnection,
    v.heatingSystem,
    actions
  ]);

  const missingRequired: string[] = [];
  if (!v.baujahr.trim()) missingRequired.push("Baujahr");
  if (!v.flaeche.trim()) missingRequired.push("Dachfläche");
  if (!v.neigung.trim()) missingRequired.push("Dachneigung");
  const requiredOk = missingRequired.length === 0;

  const handleSave = () => {
    setErrorMsg("");
    if (!requiredOk) {
      setErrorMsg("Bitte Pflichtfelder ausfüllen: " + missingRequired.join(", "));
      return;
    }
    try {
      setSaveStatus("saving");
      // Optional: Flag setzen
      actions.updateBuilding({ savedAt: Date.now() } as any);
      setTimeout(() => {
        setSaveStatus("done");
        nav("/home");
      }, 300);
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
      setErrorMsg("Speichern fehlgeschlagen.");
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <h2 className="text-xl font-semibold">Gebäudedaten erfassen</h2>
      <p className="text-slate-600">
        Bitte Gebäudedaten eingeben und anschließend „Daten speichern“ klicken. Danach wählen Sie im Hauptmenü den Solar Calculator oder Wärmepumpe Simulator.
      </p>

      {calculations.estimatedPvPower > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div><strong>Geschätzte PV-Leistung:</strong> {calculations.estimatedPvPower} kWp</div>
          <div><strong>Nutzbare Dachfläche:</strong> ~{calculations.usableRoofArea} m²</div>
          <div><strong>Bewertung:</strong> {calculations.solarHint}</div>
        </div>
      )}

      {/* (Belasse alle bestehenden Eingabeblöcke unverändert) */}
      {/* --- ab hier nur Beispiel einer Sektion, deine restlichen Sektionen bleiben --- */}

      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Grunddaten</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <FieldSelect label="Gebäudetyp" value={v.buildingType}
                       onChange={buildingType=>setV({...v,buildingType})}
                       options={["Einfamilienhaus","Zweifamilienhaus","Reihenhaus","Doppelhaushälfte","Bungalow"]}/>
          <FieldInput label="Wohnfläche (m²)" value={v.livingSpace}
                      onChange={livingSpace=>setV({...v,livingSpace})} placeholder="z.B. 150"/>
          <FieldInput label="Baujahr *" value={v.baujahr}
                      onChange={baujahr=>setV({...v,baujahr})} placeholder="z.B. 1995"/>
        </div>
      </div>

      {/* TODO: Alle deine weiteren bestehenden Abschnitte (Dach-Spezifikationen, Technische Anschlüsse, Besonderheiten, etc.) hier lassen – unverändert */}

      {/* Status / Fehler */}
      {errorMsg && (
        <div className="p-3 rounded bg-red-50 border border-red-300 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}
      {!requiredOk && !errorMsg && (
        <div className="p-3 rounded bg-amber-50 border border-amber-300 text-amber-800 text-sm">
          Fehlende Pflichtfelder: {missingRequired.join(", ")}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center border-t pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Speichern..." : "Daten speichern"}
        </button>
        <button
          type="button"
          onClick={()=>nav("/home")}
          className="px-5 py-3 rounded bg-slate-200 hover:bg-slate-300"
        >
          Abbrechen / Zurück
        </button>
        {saveStatus === "done" && (
          <span className="text-green-700 text-sm">Gespeichert – zurück zum Menü...</span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 text-sm">Fehler beim Speichern.</span>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Debug: signature={lastSignatureRef.current}
      </div>
    </div>
  );
}

function FieldInput({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function FieldSelect({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <select
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      >
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}