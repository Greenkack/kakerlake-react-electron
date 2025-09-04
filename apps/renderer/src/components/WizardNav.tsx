// apps/renderer/src/components/WizardNav.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";

type Props = {
  backTo?: string;
  nextTo?: string;
  nextDisabled?: boolean;
  showHome?: boolean; // "Zum Hauptmenü (Anlagenmodus)"
};

export default function WizardNav({
  backTo,
  nextTo,
  nextDisabled,
  showHome = true,
}: Props) {
  const nav = useNavigate();

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {backTo ? (
        <Link to={backTo} className="rounded border bg-white px-4 py-2 hover:bg-slate-50">
          Zurück
        </Link>
      ) : (
        <button
          onClick={() => nav(-1)}
          className="rounded border bg-white px-4 py-2 hover:bg-slate-50"
        >
          Zurück
        </button>
      )}

      {showHome && (
        <Link
          to="/home"
          className="rounded border bg-white px-4 py-2 hover:bg-slate-50"
        >
          Zum Hauptmenü
        </Link>
      )}

      {nextTo && (
        <Link
          to={nextTo}
          className={
            "rounded px-4 py-2 text-white " +
            (nextDisabled ? "bg-slate-300 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700")
          }
          onClick={(e) => {
            if (nextDisabled) e.preventDefault();
          }}
        >
          Nächster Bereich
        </Link>
      )}
    </div>
  );
}
