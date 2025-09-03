// apps/renderer/src/routes/Calc/Menu.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../../state/wizard";

export default function CalcMenu(): JSX.Element {
  const nav = useNavigate();
  const { unlocks } = useWizard();

  const Item = ({
    title,
    desc,
    to,
    enabled,
  }: { title: string; desc: string; to: string; enabled: boolean }) => (
    <button
      type="button"
      onClick={() => enabled && nav(to)}
      className={`rounded-xl border p-5 text-left shadow hover:shadow-md ${
        enabled ? "bg-white" : "bg-slate-100 opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-slate-600 text-sm">{desc}</div>
    </button>
  );

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Berechnungen – Untermenü</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Item
          title="Kundendaten"
          desc="Grunddaten erfassen"
          to="/calc/customer"
          enabled={true}
        />
        <Item
          title="Bedarfsanalyse"
          desc="Verbräuche, Tarife"
          to="/calc/needs"
          enabled={unlocks.hasCustomerData}
        />
        <Item
          title="Gebäudedaten"
          desc="Dachdaten, Ausrichtung"
          to="/calc/building"
          enabled={unlocks.hasCustomerData}
        />
        <Item
          title="Zusätzliche Angaben"
          desc="Interessen & Finanzierung"
          to="/calc/options"
          enabled={unlocks.hasCustomerData}
        />
        <Item
          title="Solar Calculator"
          desc="Technik & kWp"
          to="/calc/solar"
          enabled={unlocks.hasNeedsAnalysis && unlocks.pvEnabled}
        />
        <Item
          title="Wärmepumpe Simulator"
          desc="Heizlast & Empfehlung"
          to="/calc/heatpump"
          enabled={unlocks.hasNeedsAnalysis && unlocks.hpEnabled}
        />
        <Item
          title="Ergebnisse"
          desc="Kennzahlen & KPIs"
          to="/results"
          enabled={unlocks.hasNeedsAnalysis}
        />
        <Item
          title="Dashboard"
          desc="Charts & Visualisierungen"
          to="/dashboard"
          enabled={unlocks.hasNeedsAnalysis}
        />
        <Item
          title="Dokumentenerstellung"
          desc="Standard / erweitert / Multi-PDF"
          to="/documents"
          enabled={unlocks.hasNeedsAnalysis}
        />
      </div>
    </div>
  );
}
