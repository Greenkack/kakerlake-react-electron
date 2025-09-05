import React from "react";
import { useProject } from "../../state/project";
import WizardNav from "../../components/WizardNav";
import { parseFullAddress } from "../../utils/address";

export default function CustomerForm(): JSX.Element {
  const { state, actions } = useProject();
  const c = state.customer;

  const onRawParse = () => {
    const parsed = parseFullAddress(c.adresseRaw);
    actions.applyParsedAddress(parsed);
  };

  const requiredOk =
    c.vorname.trim().length > 0 &&
    c.nachname.trim().length > 0 &&
    c.plz.trim().length > 0 &&
    c.ort.trim().length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Kundendaten</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Anlagentyp */}
        <label className="block">
          <span className="mb-1 block text-sm">Anlagentyp</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.anlagentyp}
            onChange={(e) => actions.updateCustomer({ anlagentyp: e.target.value as any })}
          >
            <option>Neuanlage</option>
            <option>Bestandsanlage</option>
          </select>
        </label>

        {/* Einspeisetyp */}
        <label className="block">
          <span className="mb-1 block text-sm">Einspeisetyp</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.einspeisetyp}
            onChange={(e) => actions.updateCustomer({ einspeisetyp: e.target.value as any })}
          >
            <option>Teileinspeisung</option>
            <option>Volleinspeisung</option>
          </select>
        </label>

        {/* Kundentyp */}
        <label className="block">
          <span className="mb-1 block text-sm">Kundentyp</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.kundentyp}
            onChange={(e) => actions.updateCustomer({ kundentyp: e.target.value as any })}
          >
            <option>Privat</option>
            <option>Gewerblich</option>
          </select>
        </label>

        {/* Anrede */}
        <label className="block">
          <span className="mb-1 block text-sm">Anrede</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.anrede}
            onChange={(e) => actions.updateCustomer({ anrede: e.target.value as any })}
          >
            <option value="">(keine)</option>
            <option>Herr</option>
            <option>Frau</option>
            <option>Familie</option>
          </select>
        </label>

        {/* Titel */}
        <label className="block">
          <span className="mb-1 block text-sm">Titel</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.titel}
            onChange={(e) => actions.updateCustomer({ titel: e.target.value as any })}
          >
            <option value="">(kein Titel)</option>
            <option>Dr.</option>
            <option>Prof.</option>
            <option>Mag.</option>
            <option>Ing.</option>
          </select>
        </label>

        {/* Vorname / Nachname */}
        <label className="block">
          <span className="mb-1 block text-sm">Vorname</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.vorname}
            onChange={(e) => actions.updateCustomer({ vorname: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Nachname</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.nachname}
            onChange={(e) => actions.updateCustomer({ nachname: e.target.value })}
          />
        </label>

        {/* Adresse (frei) */}
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">
            Komplette Adresse (aus Google Maps einfügen)
          </span>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={3}
            placeholder="Adresse aus Google Maps hier einfügen..."
            value={c.adresseRaw}
            onChange={(e) => actions.updateCustomer({ adresseRaw: e.target.value })}
          ></textarea>
          <div className="mt-2">
            <button
              type="button"
              onClick={onRawParse}
              className="rounded border bg-white px-3 py-1 text-sm hover:bg-slate-50"
            >
              Daten aus Adresse übernehmen
            </button>
          </div>
        </label>

        {/* Straße / Hausnummer / PLZ / Ort */}
        <label className="block">
          <span className="mb-1 block text-sm">Straße</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.strasse}
            onChange={(e) => actions.updateCustomer({ strasse: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Hausnummer</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.hausnummer}
            onChange={(e) => actions.updateCustomer({ hausnummer: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">PLZ</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.plz}
            onChange={(e) => actions.updateCustomer({ plz: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Ort</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={c.ort}
            onChange={(e) => actions.updateCustomer({ ort: e.target.value })}
          />
        </label>

        {/* E-Mail / Telefon */}
        <label className="block">
          <span className="mb-1 block text-sm">E-Mail</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="email"
            value={c.email}
            onChange={(e) => actions.updateCustomer({ email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Telefon (Festnetz)</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="tel"
            value={c.telFest}
            onChange={(e) => actions.updateCustomer({ telFest: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Telefon (Mobil)</span>
          <input
            className="w-full rounded border px-3 py-2"
            type="tel"
            value={c.telMobil}
            onChange={(e) => actions.updateCustomer({ telMobil: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Bundesland</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={c.bundesland}
            onChange={(e) => actions.updateCustomer({ bundesland: e.target.value })}
          >
            <option value="">--- Bitte wählen ---</option>
            <option>Baden-Württemberg</option>
            <option>Bayern</option>
            <option>Berlin</option>
            <option>Brandenburg</option>
            <option>Bremen</option>
            <option>Hamburg</option>
            <option>Hessen</option>
            <option>Mecklenburg-Vorpommern</option>
            <option>Niedersachsen</option>
            <option>Nordrhein-Westfalen</option>
            <option>Rheinland-Pfalz</option>
            <option>Saarland</option>
            <option>Sachsen</option>
            <option>Sachsen-Anhalt</option>
            <option>Schleswig-Holstein</option>
            <option>Thüringen</option>
          </select>
        </label>

        {/* Anmerkung */}
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">Anmerkung zum Kunden</span>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={3}
            value={c.anmerkung}
            onChange={(e) => actions.updateCustomer({ anmerkung: e.target.value })}
          ></textarea>
        </label>
      </div>

      <WizardNav
        backTo="/project/mode"
        nextTo="/project/demand"
        disabledNext={!requiredOk}
        showHome={true}
      />
    </div>
  );
}
