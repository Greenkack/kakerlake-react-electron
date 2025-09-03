// apps/renderer/src/routes/Project/NeedsAnalysis.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../../state/wizard";

export default function NeedsAnalysis(): JSX.Element {
  const nav = useNavigate();
  const { markNeedsDone } = useWizard();

  const [v, setV] = useState({
    kwhHaushalt: 0,
    kwhHeizung: 0,     // optional
    costMonHaushalt: 0,
    costMonHeizung: 0, // optional
  });

  const jahresKWh = useMemo(
    () => (v.kwhHaushalt || 0) + (v.kwhHeizung || 0),
    [v]
  );

  const jahresKosten = useMemo(
    () => ((v.costMonHaushalt || 0) + (v.costMonHeizung || 0)) * 12,
    [v]
  );

  const stromtarif = useMemo(() => {
    if (!jahresKWh || !jahresKosten) return 0;
    return jahresKosten / jahresKWh; // €/kWh
  }, [jahresKWh, jahresKosten]);

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        markNeedsDone();
        nav("/calc/building");
      }}
    >
      <h2 className="text-xl font-semibold">2) Bedarfsanalyse</h2>

      <div className="grid md:grid-cols-2 gap-3">
        <Num
          label="Jahresverbrauch kWh Haushalt"
          value={v.kwhHaushalt}
          onChange={(x) => setV({ ...v, kwhHaushalt: x })}
        />
        <Num
          label="Jahresverbrauch kWh Heizung (optional)"
          value={v.kwhHeizung}
          onChange={(x) => setV({ ...v, kwhHeizung: x })}
        />
        <Num
          label="monatliche Stromkosten Haushalt (€)"
          value={v.costMonHaushalt}
          onChange={(x) => setV({ ...v, costMonHaushalt: x })}
        />
        <Num
          label="monatliche Stromkosten Heizung (€) (optional)"
          value={v.costMonHeizung}
          onChange={(x) => setV({ ...v, costMonHeizung: x })}
        />
      </div>

      <div className="rounded border bg-white p-4">
        <div className="font-medium mb-2">Automatische Ergebnisse</div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Jährlicher Gesamtverbrauch: <b>{jahresKWh.toLocaleString("de-DE")} kWh</b></li>
          <li>Jährliche Gesamtkosten: <b>{jahresKosten.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</b></li>
          <li>Stromtarif: <b>{stromtarif.toFixed(3)} € / kWh</b></li>
        </ul>
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

function Num({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="block text-sm mb-1">{label}</span>
      <input
        type="number"
        className="border p-2 w-full"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
      />
    </label>
  );
}
