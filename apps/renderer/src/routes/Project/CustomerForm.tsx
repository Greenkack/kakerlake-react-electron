// apps/renderer/src/routes/Project/CustomerForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../../state/wizard";

export default function CustomerForm(): JSX.Element {
  const nav = useNavigate();
  const { markCustomerDone } = useWizard();

  const [form, setForm] = useState({
    anlagentyp: "Neuanlage",
    einspeisetyp: "Teileinspeisung",
    kundentyp: "Privat",
    anrede: "Herr",
    titel: "",
    vorname: "",
    nachname: "",
    adresseRaw: "",
    strasse: "",
    hausnr: "",
    plz: "",
    ort: "",
    email: "",
    telFest: "",
    telMobil: "",
    bundesland: "",
    anmerkung: "",
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        markCustomerDone();
        nav("/calc/needs");
      }}
    >
      <h2 className="text-xl font-semibold">1) Kundendaten</h2>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-sm mb-1">Anlagentyp</span>
          <select
            className="border p-2 w-full"
            value={form.anlagentyp}
            onChange={(e) => setForm({ ...form, anlagentyp: e.target.value })}
          >
            <option>Neuanlage</option>
            <option>Bestandsanlage</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Einspeisetyp</span>
          <select
            className="border p-2 w-full"
            value={form.einspeisetyp}
            onChange={(e) => setForm({ ...form, einspeisetyp: e.target.value })}
          >
            <option>Teileinspeisung</option>
            <option>Volleinspeisung</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Kundentyp</span>
          <select
            className="border p-2 w-full"
            value={form.kundentyp}
            onChange={(e) => setForm({ ...form, kundentyp: e.target.value })}
          >
            <option>Privat</option>
            <option>Gewerblich</option>
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <label className="block">
          <span className="block text-sm mb-1">Anrede</span>
          <select
            className="border p-2 w-full"
            value={form.anrede}
            onChange={(e) => setForm({ ...form, anrede: e.target.value })}
          >
            <option>Herr</option>
            <option>Frau</option>
            <option>Familie</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Titel</span>
          <select
            className="border p-2 w-full"
            value={form.titel}
            onChange={(e) => setForm({ ...form, titel: e.target.value })}
          >
            <option value="">–</option>
            <option>Dr.</option>
            <option>Prof.</option>
            <option>Mag.</option>
            <option>Ing.</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Vorname</span>
          <input
            className="border p-2 w-full"
            value={form.vorname}
            onChange={(e) => setForm({ ...form, vorname: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Nachname</span>
          <input
            className="border p-2 w-full"
            value={form.nachname}
            onChange={(e) => setForm({ ...form, nachname: e.target.value })}
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm mb-1">
          Komplette Adresse (aus Google Maps einfügen)
        </span>
        <textarea
          className="border p-2 w-full"
          rows={3}
          value={form.adresseRaw}
          onChange={(e) => setForm({ ...form, adresseRaw: e.target.value })}
          placeholder="Straße Hausnummer, PLZ Ort"
        />
      </label>

      <div className="grid md:grid-cols-4 gap-3">
        <label className="block">
          <span className="block text-sm mb-1">Straße</span>
          <input
            className="border p-2 w-full"
            value={form.strasse}
            onChange={(e) => setForm({ ...form, strasse: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="block text-sm mb-1">Hausnummer</span>
          <input
            className="border p-2 w-full"
            value={form.hausnr}
            onChange={(e) => setForm({ ...form, hausnr: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="block text-sm mb-1">PLZ</span>
          <input
            className="border p-2 w-full"
            value={form.plz}
            onChange={(e) => setForm({ ...form, plz: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="block text-sm mb-1">Ort</span>
          <input
            className="border p-2 w-full"
            value={form.ort}
            onChange={(e) => setForm({ ...form, ort: e.target.value })}
          />
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-sm mb-1">E-Mail</span>
          <input
            className="border p-2 w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
          />
        </label>
        <label className="block">
          <span className="block text-sm mb-1">Telefon (Festnetz)</span>
          <input
            className="border p-2 w-full"
            value={form.telFest}
            onChange={(e) => setForm({ ...form, telFest: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="block text-sm mb-1">Telefon (Mobil)</span>
          <input
            className="border p-2 w-full"
            value={form.telMobil}
            onChange={(e) => setForm({ ...form, telMobil: e.target.value })}
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-sm mb-1">Bundesland</span>
        <input
          className="border p-2 w-full"
          value={form.bundesland}
          onChange={(e) => setForm({ ...form, bundesland: e.target.value })}
          placeholder="— Bitte wählen —"
        />
      </label>

      <label className="block">
        <span className="block text-sm mb-1">Anmerkung zum Kunden</span>
        <textarea
          className="border p-2 w-full"
          rows={2}
          value={form.anmerkung}
          onChange={(e) => setForm({ ...form, anmerkung: e.target.value })}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          className="px-4 py-2 rounded bg-black text-white"
          type="submit"
        >
          Nächster Bereich
        </button>
        <button
          className="px-4 py-2 rounded border"
          type="button"
          onClick={() => nav("/calc/menu")}
        >
          Abbrechen / Zurück zum Untermenü
        </button>
      </div>
    </form>
  );
}
