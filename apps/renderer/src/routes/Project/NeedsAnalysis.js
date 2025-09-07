import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import WizardNav from '../../components/WizardNav';
// Mock useProjectData hook until context is available
const useProjectData = () => ({
    projectData: {
        needs: {
            primary_goal: undefined,
            budget_max: undefined,
            budget_preferred: undefined,
            financing_needed: undefined,
            installation_time_preference: undefined,
            technology_preference: undefined,
            warranty_importance: undefined,
            service_importance: undefined,
            brand_preference: undefined,
            installer_preference: undefined,
            aesthetic_requirements: undefined,
            roof_space_usage: undefined,
            future_expansion: undefined,
            smart_home_integration: undefined,
            monitoring_wishes: undefined,
            environmental_priority: undefined,
            noise_restrictions: undefined,
            building_permits_handled: undefined,
            grid_connection_status: undefined,
            insurance_clarification: undefined,
            storage_priority: undefined,
            backup_power_need: undefined,
            feed_in_vs_self_consumption: undefined,
            special_requirements: undefined
        }
    },
    updateProjectData: (data) => console.log('Update project data:', data)
});
const toNumberOrNull = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
};
export default function NeedsAnalysis() {
    const { projectData, updateProjectData } = useProjectData();
    // Hauptziele & Budget
    const [primary_goal, setPrimaryGoal] = useState(projectData.needs?.primary_goal || '');
    const [budget_max, setBudgetMax] = useState(projectData.needs?.budget_max?.toString() || '');
    const [budget_preferred, setBudgetPreferred] = useState(projectData.needs?.budget_preferred?.toString() || '');
    const [financing_needed, setFinancingNeeded] = useState(projectData.needs?.financing_needed || false);
    // Zeitpläne & Präferenzen
    const [installation_time_preference, setInstallationTime] = useState(projectData.needs?.installation_time_preference || '');
    const [technology_preference, setTechnologyPreference] = useState(projectData.needs?.technology_preference || '');
    const [warranty_importance, setWarrantyImportance] = useState(projectData.needs?.warranty_importance || '');
    const [service_importance, setServiceImportance] = useState(projectData.needs?.service_importance || '');
    // Anbieter & Marken
    const [brand_preference, setBrandPreference] = useState(projectData.needs?.brand_preference || '');
    const [installer_preference, setInstallerPreference] = useState(projectData.needs?.installer_preference || '');
    // Ästhetik & Design
    const [aesthetic_requirements, setAestheticRequirements] = useState(projectData.needs?.aesthetic_requirements || '');
    const [roof_space_usage, setRoofSpaceUsage] = useState(projectData.needs?.roof_space_usage || '');
    // Zukunftsplanung & Integration
    const [future_expansion, setFutureExpansion] = useState(projectData.needs?.future_expansion || false);
    const [smart_home_integration, setSmartHomeIntegration] = useState(projectData.needs?.smart_home_integration || false);
    const [monitoring_wishes, setMonitoringWishes] = useState(projectData.needs?.monitoring_wishes || '');
    // Umwelt & Nachhaltigkeit
    const [environmental_priority, setEnvironmentalPriority] = useState(projectData.needs?.environmental_priority || '');
    // Rechtliche & technische Aspekte
    const [noise_restrictions, setNoiseRestrictions] = useState(projectData.needs?.noise_restrictions || false);
    const [building_permits_handled, setBuildingPermitsHandled] = useState(projectData.needs?.building_permits_handled || false);
    const [grid_connection_status, setGridConnectionStatus] = useState(projectData.needs?.grid_connection_status || '');
    const [insurance_clarification, setInsuranceClarification] = useState(projectData.needs?.insurance_clarification || false);
    // Speicher & Energiemanagement
    const [storage_priority, setStoragePriority] = useState(projectData.needs?.storage_priority || '');
    const [backup_power_need, setBackupPowerNeed] = useState(projectData.needs?.backup_power_need || '');
    const [feed_in_vs_self_consumption, setFeedInVsSelfConsumption] = useState(projectData.needs?.feed_in_vs_self_consumption || '');
    // Sonderanforderungen
    const [special_requirements, setSpecialRequirements] = useState(projectData.needs?.special_requirements || '');
    // Validierung für "Weiter"-Button
    const requiredOk = primary_goal !== '' && budget_max !== '';
    // Beim Verlassen/Weiter speichern wir in den Context
    useEffect(() => {
        updateProjectData({
            needs: {
                primary_goal,
                budget_max: toNumberOrNull(budget_max),
                budget_preferred: toNumberOrNull(budget_preferred),
                financing_needed,
                installation_time_preference,
                technology_preference,
                warranty_importance,
                service_importance,
                brand_preference,
                installer_preference,
                aesthetic_requirements,
                roof_space_usage,
                future_expansion,
                smart_home_integration,
                monitoring_wishes,
                environmental_priority,
                noise_restrictions,
                building_permits_handled,
                grid_connection_status,
                insurance_clarification,
                storage_priority,
                backup_power_need,
                feed_in_vs_self_consumption,
                special_requirements
            }
        });
    }, [
        primary_goal, budget_max, budget_preferred, financing_needed,
        installation_time_preference, technology_preference, warranty_importance, service_importance,
        brand_preference, installer_preference, aesthetic_requirements, roof_space_usage,
        future_expansion, smart_home_integration, monitoring_wishes, environmental_priority,
        noise_restrictions, building_permits_handled, grid_connection_status, insurance_clarification,
        storage_priority, backup_power_need, feed_in_vs_self_consumption, special_requirements,
        updateProjectData
    ]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "Bed\u00FCrfnisse & Pr\u00E4ferenzen" }), _jsx("p", { className: "text-slate-600", children: "Ihre W\u00FCnsche und Anforderungen f\u00FCr die PV-Anlage" })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Hauptziele & Budget" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Prim\u00E4res Ziel der PV-Anlage *", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: primary_goal, onChange: (e) => setPrimaryGoal(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Bitte w\u00E4hlen" }), _jsx("option", { value: "cost_reduction", children: "Stromkosten reduzieren" }), _jsx("option", { value: "independence", children: "Energieunabh\u00E4ngigkeit" }), _jsx("option", { value: "environment", children: "Umweltschutz" }), _jsx("option", { value: "investment", children: "Investition/Rendite" }), _jsx("option", { value: "self_sufficiency", children: "Autarkie anstreben" }), _jsx("option", { value: "future_proofing", children: "Zukunftssicherheit" })] }) }), _jsx(Field, { label: "Maximales Budget (\u20AC) *", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: budget_max, onChange: (e) => setBudgetMax(e.target.value), placeholder: "z.B. 25000", required: true }) }), _jsx(Field, { label: "Bevorzugtes Budget (\u20AC)", children: _jsx("input", { className: "w-full rounded border border-slate-300 px-3 py-2", value: budget_preferred, onChange: (e) => setBudgetPreferred(e.target.value), placeholder: "z.B. 20000" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "financing_needed", checked: financing_needed, onChange: (e) => setFinancingNeeded(e.target.checked) }), _jsx("label", { htmlFor: "financing_needed", className: "text-sm", children: "Finanzierung ben\u00F6tigt" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Zeitpl\u00E4ne & Service-Pr\u00E4ferenzen" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Gew\u00FCnschte Installationszeit", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: installation_time_preference, onChange: (e) => setInstallationTime(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "asap", children: "So schnell wie m\u00F6glich" }), _jsx("option", { value: "spring", children: "Fr\u00FChjahr" }), _jsx("option", { value: "summer", children: "Sommer" }), _jsx("option", { value: "fall", children: "Herbst" }), _jsx("option", { value: "winter", children: "Winter" }), _jsx("option", { value: "next_year", children: "N\u00E4chstes Jahr" })] }) }), _jsx(Field, { label: "Technologie-Pr\u00E4ferenz", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: technology_preference, onChange: (e) => setTechnologyPreference(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "latest", children: "Neueste Technologie" }), _jsx("option", { value: "proven", children: "Bew\u00E4hrte Technologie" }), _jsx("option", { value: "cost_effective", children: "Kosteneffizient" }), _jsx("option", { value: "premium", children: "Premium-Klasse" })] }) }), _jsx(Field, { label: "Wichtigkeit der Garantie", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: warranty_importance, onChange: (e) => setWarrantyImportance(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "low", children: "Wenig wichtig" }), _jsx("option", { value: "medium", children: "Mittel wichtig" }), _jsx("option", { value: "high", children: "Sehr wichtig" }), _jsx("option", { value: "critical", children: "Kritisch" })] }) }), _jsx(Field, { label: "Wichtigkeit des Services", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: service_importance, onChange: (e) => setServiceImportance(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "low", children: "Wenig wichtig" }), _jsx("option", { value: "medium", children: "Mittel wichtig" }), _jsx("option", { value: "high", children: "Sehr wichtig" }), _jsx("option", { value: "critical", children: "Kritisch" })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Anbieter & Marken-Pr\u00E4ferenzen" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Marken-Pr\u00E4ferenz", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: brand_preference, onChange: (e) => setBrandPreference(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "german", children: "Deutsche Marken bevorzugt" }), _jsx("option", { value: "european", children: "Europ\u00E4ische Marken" }), _jsx("option", { value: "premium", children: "Premium-Marken" }), _jsx("option", { value: "value", children: "Preis-Leistung" }), _jsx("option", { value: "specific", children: "Spezifische Marke gew\u00FCnscht" })] }) }), _jsx(Field, { label: "Installateur-Pr\u00E4ferenz", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: installer_preference, onChange: (e) => setInstallerPreference(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "local", children: "Lokaler Anbieter" }), _jsx("option", { value: "certified", children: "Zertifizierter Fachbetrieb" }), _jsx("option", { value: "experienced", children: "Erfahrener Spezialist" }), _jsx("option", { value: "full_service", children: "Full-Service-Anbieter" }), _jsx("option", { value: "recommendation", children: "Empfehlung erw\u00FCnscht" })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "\u00C4sthetik & Design" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "\u00C4sthetische Anforderungen", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: aesthetic_requirements, onChange: (e) => setAestheticRequirements(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "black_modules", children: "Schwarze Module bevorzugt" }), _jsx("option", { value: "uniform_look", children: "Einheitliches Erscheinungsbild" }), _jsx("option", { value: "architectural_integration", children: "Architektonische Integration" }), _jsx("option", { value: "minimal_visible", children: "Minimal sichtbar" }), _jsx("option", { value: "statement", children: "Sichtbares Statement" })] }) }), _jsx(Field, { label: "Dachfl\u00E4chennutzung", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: roof_space_usage, onChange: (e) => setRoofSpaceUsage(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "maximum", children: "Maximale Nutzung" }), _jsx("option", { value: "optimal", children: "Optimale Nutzung" }), _jsx("option", { value: "partial", children: "Teilweise Nutzung" }), _jsx("option", { value: "minimal", children: "Minimale Nutzung" }), _jsx("option", { value: "specific_areas", children: "Nur bestimmte Bereiche" })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Zukunftsplanung & Integration" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: future_expansion, onChange: (e) => setFutureExpansion(e.target.checked) }), _jsx("span", { children: "Zuk\u00FCnftige Erweiterung geplant" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: smart_home_integration, onChange: (e) => setSmartHomeIntegration(e.target.checked) }), _jsx("span", { children: "Smart Home Integration gew\u00FCnscht" })] })] }), _jsx(Field, { label: "Monitoring-W\u00FCnsche", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: monitoring_wishes, onChange: (e) => setMonitoringWishes(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "basic", children: "Grundlegendes Monitoring" }), _jsx("option", { value: "detailed", children: "Detailliertes Monitoring" }), _jsx("option", { value: "app_control", children: "App-Steuerung" }), _jsx("option", { value: "web_portal", children: "Web-Portal" }), _jsx("option", { value: "professional", children: "Professionelles System" })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Umwelt & Rechtliche Aspekte" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Umwelt-Priorit\u00E4t", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: environmental_priority, onChange: (e) => setEnvironmentalPriority(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "low", children: "Wenig wichtig" }), _jsx("option", { value: "medium", children: "Mittel wichtig" }), _jsx("option", { value: "high", children: "Sehr wichtig" }), _jsx("option", { value: "critical", children: "Kritisch wichtig" })] }) }), _jsx(Field, { label: "Netzanschluss-Status", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: grid_connection_status, onChange: (e) => setGridConnectionStatus(e.target.value), children: [_jsx("option", { value: "", children: "Unbekannt" }), _jsx("option", { value: "existing", children: "Vorhanden" }), _jsx("option", { value: "upgrade_needed", children: "Upgrade erforderlich" }), _jsx("option", { value: "new_required", children: "Neuanschluss erforderlich" }), _jsx("option", { value: "pending", children: "In Kl\u00E4rung" })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: noise_restrictions, onChange: (e) => setNoiseRestrictions(e.target.checked) }), _jsx("span", { children: "L\u00E4rmschutz-Auflagen vorhanden" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: building_permits_handled, onChange: (e) => setBuildingPermitsHandled(e.target.checked) }), _jsx("span", { children: "Baugenehmigung bereits gekl\u00E4rt" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: insurance_clarification, onChange: (e) => setInsuranceClarification(e.target.checked) }), _jsx("span", { children: "Versicherungsfragen bereits gekl\u00E4rt" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Speicher & Energiemanagement" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(Field, { label: "Speicher-Priorit\u00E4t", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: storage_priority, onChange: (e) => setStoragePriority(e.target.value), children: [_jsx("option", { value: "", children: "Nicht wichtig" }), _jsx("option", { value: "low", children: "Niedrig" }), _jsx("option", { value: "medium", children: "Mittel" }), _jsx("option", { value: "high", children: "Hoch" }), _jsx("option", { value: "essential", children: "Unbedingt erforderlich" })] }) }), _jsx(Field, { label: "Notstrom-Bedarf", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: backup_power_need, onChange: (e) => setBackupPowerNeed(e.target.value), children: [_jsx("option", { value: "", children: "Nicht erforderlich" }), _jsx("option", { value: "basic", children: "Grundversorgung" }), _jsx("option", { value: "partial", children: "Teilweise Absicherung" }), _jsx("option", { value: "full", children: "Vollst\u00E4ndige Absicherung" }), _jsx("option", { value: "critical", children: "Kritische Verbraucher" })] }) }), _jsx(Field, { label: "Einspeisung vs. Eigenverbrauch", children: _jsxs("select", { className: "w-full rounded border border-slate-300 px-3 py-2", value: feed_in_vs_self_consumption, onChange: (e) => setFeedInVsSelfConsumption(e.target.value), children: [_jsx("option", { value: "", children: "Keine Pr\u00E4ferenz" }), _jsx("option", { value: "max_feed_in", children: "Maximale Einspeisung" }), _jsx("option", { value: "balanced", children: "Ausgewogen" }), _jsx("option", { value: "max_self_consumption", children: "Maximaler Eigenverbrauch" }), _jsx("option", { value: "autarky", children: "Autarkie anstreben" })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Sonderanforderungen" }), _jsx(Field, { label: "Besondere W\u00FCnsche oder Anforderungen", children: _jsx("textarea", { className: "w-full rounded border border-slate-300 px-3 py-2 h-24", value: special_requirements, onChange: (e) => setSpecialRequirements(e.target.value), placeholder: "z.B. spezielle Verschattungssituationen, architektonische Besonderheiten, etc." }) })] }), _jsx(WizardNav, { backTo: "/project/demand", nextTo: "/project/options", disabledNext: !requiredOk })] }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-slate-700 mb-1", children: label }), children] }));
}
