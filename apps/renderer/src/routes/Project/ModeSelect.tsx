import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModeSelect(): JSX.Element {
  const nav = useNavigate();
  const modi = ["Photovoltaik", "Wärmepumpe", "Photovoltaik und Wärmepumpe"];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Anlagenmodus</h1>
      <div className="flex flex-wrap gap-2">
        {modi.map((m) => (
          <button
            key={m}
            className="px-3 py-2 rounded border"
            onClick={() => nav("/project/customer")}
            type="button"
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}