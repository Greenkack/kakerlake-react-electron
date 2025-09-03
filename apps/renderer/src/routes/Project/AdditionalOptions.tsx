// apps/renderer/src/routes/Project/AdditionalOptions.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../../state/wizard";

export default function AdditionalOptions(): JSX.Element {
  const nav = useNavigate();
  const { setPVEnabled, setHPEnabled } = useWizard();

  const [opt, setOpt] = useState({
    pv: true,
    hp: false,
    both: false,
    ev: false,
    futureHP: false,
    otherFuture: "",
    financing: false,
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        // Freischalten je nach Interessen:
        setPVEnabled(opt.pv || opt.both);
        setHPEnabled(opt.hp || opt.both);
        // zurück zum Untermenü
        nav("/calc/menu");
      }}
    >
      <h2 className="text-xl font-semibold">4) Zusätzliche Angaben</h2>

      <fieldset className="rounded border bg-white p-4">
        <legend className="px-2 text-sm text-slate-500">Interessen</legend>
        <Chk label="Interesse an Photovoltaik" checked={opt.pv} onChange={(v)=>setOpt({...opt,pv:v})}/>
        <Chk label="Interesse an Wärmepumpe" checked={opt.hp} onChange={(v)=>setOpt({...opt,hp:v})}/>
        <Chk label="Interesse an PV & Wärmepumpe" checked={opt.both} onChange={(v)=>setOpt({...opt,both:v})}/>
      </fieldset>

      <fieldset className="rounded border bg-white p-4">
        <legend className="px-2 text-sm text-slate-500">Extras</legend>
        <Chk label="Zukünftiges Elektroauto einplanen" checked={opt.ev} onChange={(v)=>setOpt({...opt,ev:v})}/>
        <Chk label="Zukünftige Wärmepumpe einplanen" checked={opt.futureHP} onChange={(v)=>setOpt({...opt,futureHP:v})}/>
        <label className="block mt-2">
          <span className="block text-sm mb-1">Sonstiger zukünftiger Mehrverbrauch</span>
          <input className="border p-2 w-full" value={opt.otherFuture} onChange={(e)=>setOpt({...opt,otherFuture:e.target.value})}/>
        </label>
        <Chk label="Finanzierung/Leasing gewünscht" checked={opt.financing} onChange={(v)=>setOpt({...opt,financing:v})}/>
      </fieldset>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">
          Eingaben speichern
        </button>
        <button className="px-4 py-2 rounded border" type="button" onClick={() => nav("/calc/menu")}>
          Abbrechen / Zurück zum Untermenü
        </button>
      </div>
    </form>
  );
}

function Chk({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/>
      <span>{label}</span>
    </label>
  );
}
