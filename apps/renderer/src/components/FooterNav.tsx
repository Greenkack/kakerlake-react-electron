// apps/renderer/src/components/FooterNav.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuRouteFor, nextRoute, prevRoute } from "../routesOrder";

export default function FooterNav(): JSX.Element {
  const nav = useNavigate();
  const loc = useLocation();
  const path = loc.pathname;

  const prev = prevRoute(path);
  const next = nextRoute(path);
  const menu = menuRouteFor(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2">
        <button
          type="button"
          className="px-3 py-2 rounded border disabled:opacity-40"
          onClick={() => prev && nav(prev)}
          disabled={!prev}
        >
          ← vorherige Seite
        </button>

        <button
          type="button"
          className="px-3 py-2 rounded border"
          onClick={() => nav(menu)}
        >
          Menü
        </button>

        <button
          type="button"
          className="px-3 py-2 rounded border disabled:opacity-40"
          onClick={() => next && nav(next)}
          disabled={!next}
        >
          nächste Seite →
        </button>

        <button
          type="button"
          className="px-3 py-2 rounded border"
          onClick={() => nav("/")}
        >
          zurück zum Hauptmenü
        </button>
      </div>
    </div>
  );
}
