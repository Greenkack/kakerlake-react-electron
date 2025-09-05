// apps/renderer/src/components/WizardNav.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface WizardNavProps {
  backTo?: string;
  nextTo?: string;
  disabledNext?: boolean;
  showHome?: boolean;
  labelNext?: string;
  labelBack?: string;
}

export default function WizardNav({
  backTo,
  nextTo,
  disabledNext,
  showHome,
  labelNext = "Nächster Bereich",
  labelBack = "Zurück"
}: WizardNavProps) {
  const navigate = useNavigate();
  const clickingRef = useRef(false);

  const safeNav = (target?: string) => {
    if (!target) return;
    if (clickingRef.current) return;
    clickingRef.current = true;
    // minimal Delay um doppelte Effekte zu vermeiden
    requestAnimationFrame(() => {
      console.log("[WizardNav] navigate ->", target);
      navigate(target);
      setTimeout(() => { clickingRef.current = false; }, 150);
    });
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3 justify-between items-center border-t pt-4">
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!backTo}
          onClick={() => safeNav(backTo)}
          className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-sm font-medium"
        >
          ← {labelBack}
        </button>
        {showHome && (
          <button
            type="button"
            onClick={() => safeNav("/home")}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
          >
            🏠 Start
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!nextTo || disabledNext}
          onClick={() => safeNav(nextTo)}
          className="px-5 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-40"
        >
          {labelNext} →
        </button>
      </div>
    </div>
  );
}
