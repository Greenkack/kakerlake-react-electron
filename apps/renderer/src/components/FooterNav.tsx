// apps/renderer/src/components/FooterNav.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuRouteFor, nextRoute, prevRoute } from "../routesOrder";

export default function FooterNav(): JSX.Element {
  const nav = useNavigate();
  const loc = useLocation();
  const path = loc.pathname;
  const { pathname } = useLocation();

  const prev = prevRoute(path);
  const next = nextRoute(path);
  const menu = menuRouteFor(path);

  const go = (target?: string | null) => target && nav(target);
  // Debug logging
  console.log('FooterNav Debug:', { path, prev, next, menu });

  const handlePrevious = () => {
    console.log('Previous clicked:', prev);
    if (prev) {
      nav(prev);
    }
  };

  const handleNext = () => {
    console.log('Next clicked:', next);
    if (next) {
      nav(next);
    }
  };

  const handleMenu = () => {
    console.log('Menu clicked:', menu);
    nav(menu || '/home');
  };

  const handleHome = () => {
    console.log('Home clicked: /home');
    nav('/home');
  };

    return (
    <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 p-3 text-sm">
        <button
          disabled={!prev}
            onClick={() => go(prev)}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40`}
        >← Zurück</button>

        <div className="flex gap-2">
          <button
            onClick={() => nav("/home")}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >🏠 Start</button>
          <button
            disabled={!menu}
            onClick={() => go(menu)}
            className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40"
          >Menü</button>
        </div>

        <button
          disabled={!next}
          onClick={() => go(next)}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-40"
        >Weiter →</button>
      </div>
      </div>
    );
  }