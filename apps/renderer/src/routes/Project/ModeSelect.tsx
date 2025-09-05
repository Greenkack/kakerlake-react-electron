import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WizardNav from "../../components/WizardNav";
import { useProject, type Mode } from "../../state/project";

export default function ModeSelect(): JSX.Element {
  const nav = useNavigate();
  const { state, actions } = useProject();
  const [mode, setMode] = useState<Mode | null>(state.mode);

  const choose = (m: Mode) => {
    setMode(m);
    actions.setMode(m);
  };

  const handleNewProject = () => {
    if (confirm('Alle bisherigen Eingaben löschen und neues Projekt starten?')) {
      actions.reset();
      setMode(null);
      alert('Neues Projekt gestartet! Alle Daten wurden zurückgesetzt.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projekt – Bedarfsanalyse: Anlagenmodus</h1>
          <p className="text-slate-600">Bitte wählen Sie einen Bedarfsanalyse-Modus aus.</p>
        </div>
        <button
          onClick={handleNewProject}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
          title="Alle Daten löschen und neues Projekt starten"
        >
          ✨ Neues Projekt
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          className={"rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "pv" ? "ring-2 ring-cyan-500" : "")}
          onClick={() => choose("pv")}
        >
          <div className="font-medium">Photovoltaik</div>
          <div className="text-sm text-slate-600">Nur PV-Angebot</div>
        </button>

        <button
          className={"rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "hp" ? "ring-2 ring-cyan-500" : "")}
          onClick={() => choose("hp")}
        >
          <div className="font-medium">Wärmepumpe</div>
          <div className="text-sm text-slate-600">Nur WP-Angebot</div>
        </button>

        <button
          className={"rounded border bg-white p-4 text-left hover:bg-slate-50 " + (mode === "both" ? "ring-2 ring-cyan-500" : "")}
          onClick={() => choose("both")}
        >
          <div className="font-medium">Photovoltaik & Wärmepumpe</div>
          <div className="text-sm text-slate-600">Kombiniertes Angebot</div>
        </button>
      </div>

      <WizardNav
        backTo={undefined}
        nextTo="/project/customer"
        disabledNext={!mode}
        showHome={false}
      />
    </div>
  );
}
