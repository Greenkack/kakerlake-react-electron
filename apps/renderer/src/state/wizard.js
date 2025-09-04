import { jsx as _jsx } from "react/jsx-runtime";
// apps/renderer/src/state/wizard.tsx
import { createContext, useContext, useMemo, useState } from "react";
const defaultUnlocks = {
    hasCustomerData: false,
    hasNeedsAnalysis: false,
    pvEnabled: false,
    hpEnabled: false,
};
const Ctx = createContext(null);
export function WizardProvider({ children }) {
    const [unlocks, _set] = useState(() => {
        try {
            const raw = localStorage.getItem("kakerlake_unlocks");
            return raw ? { ...defaultUnlocks, ...JSON.parse(raw) } : defaultUnlocks;
        }
        catch {
            return defaultUnlocks;
        }
    });
    const setUnlocks = (u) => {
        _set(prev => {
            const next = { ...prev, ...u };
            localStorage.setItem("kakerlake_unlocks", JSON.stringify(next));
            return next;
        });
    };
    const api = useMemo(() => ({
        unlocks,
        setUnlocks,
        markCustomerDone: () => setUnlocks({ hasCustomerData: true }),
        markNeedsDone: () => setUnlocks({ hasNeedsAnalysis: true }),
        setPVEnabled: (v) => setUnlocks({ pvEnabled: v }),
        setHPEnabled: (v) => setUnlocks({ hpEnabled: v }),
    }), [unlocks]);
    return _jsx(Ctx.Provider, { value: api, children: children });
}
export function useWizard() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("WizardProvider fehlt");
    return ctx;
}
