// apps/renderer/src/state/wizard.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type Unlocks = {
  hasCustomerData: boolean;
  hasNeedsAnalysis: boolean;
  // spätere Flags:
  pvEnabled: boolean;     // Interesse an PV gewählt
  hpEnabled: boolean;     // Interesse an WP gewählt
};

type WizardCtx = {
  unlocks: Unlocks;
  setUnlocks: (u: Partial<Unlocks>) => void;

  // Hilfsfunktionen
  markCustomerDone: () => void;
  markNeedsDone: () => void;
  setPVEnabled: (v: boolean) => void;
  setHPEnabled: (v: boolean) => void;
};

const defaultUnlocks: Unlocks = {
  hasCustomerData: false,
  hasNeedsAnalysis: false,
  pvEnabled: false,
  hpEnabled: false,
};

const Ctx = createContext<WizardCtx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [unlocks, _set] = useState<Unlocks>(() => {
    try {
      const raw = localStorage.getItem("kakerlake_unlocks");
      return raw ? { ...defaultUnlocks, ...JSON.parse(raw) } : defaultUnlocks;
    } catch {
      return defaultUnlocks;
    }
  });

  const setUnlocks = (u: Partial<Unlocks>) => {
    _set(prev => {
      const next = { ...prev, ...u };
      localStorage.setItem("kakerlake_unlocks", JSON.stringify(next));
      return next;
    });
  };

  const api = useMemo<WizardCtx>(() => ({
    unlocks,
    setUnlocks,
    markCustomerDone: () => setUnlocks({ hasCustomerData: true }),
    markNeedsDone:    () => setUnlocks({ hasNeedsAnalysis: true }),
    setPVEnabled:     (v: boolean) => setUnlocks({ pvEnabled: v }),
    setHPEnabled:     (v: boolean) => setUnlocks({ hpEnabled: v }),
  }), [unlocks]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWizard(): WizardCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("WizardProvider fehlt");
  return ctx;
}
