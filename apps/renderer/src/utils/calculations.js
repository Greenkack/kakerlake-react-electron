export function calculatePVSystem(params) {
    // Standard-Werte
    const systemSize = params.systemSize || 10; // kWp
    const modulePower = params.modulePower || 440; // Wp
    const moduleCount = Math.ceil((systemSize * 1000) / modulePower);
    const location = params.location || "Deutschland";
    const tilt = params.tilt || 30; // Grad
    const orientation = params.orientation || "Süd";
    // Sonneneinstrahlung basierend auf Standort (vereinfacht)
    const solarIrradiation = getSolarIrradiation(location, orientation, tilt);
    const annualYield = systemSize * solarIrradiation; // kWh/Jahr
    // Verbrauchsdaten
    const annualConsumption = params.annualConsumption || 4000; // kWh/Jahr
    const daytimeConsumption = params.daytimeConsumption || 0.4; // 40% am Tag
    // Speicher-Parameter
    const hasBattery = params.hasBattery || false;
    const batterySize = params.batterySize || 0; // kWh
    // Wirtschaftliche Parameter
    const electricityPrice = params.electricityPrice || 0.35; // EUR/kWh
    const feedInTariff = params.feedInTariff || 0.08; // EUR/kWh
    const systemCostPerKwp = 1200; // EUR/kWp (inkl. Installation)
    const systemCost = systemSize * systemCostPerKwp;
    // Eigenverbrauchsberechnung
    const directSolarConsumption = Math.min(annualYield * 0.3, // 30% der PV-Produktion fällt in Tageszeiten
    annualConsumption * daytimeConsumption);
    // Speicher-Berechnung
    let batteryUtilization = 0;
    let fromBattery = 0;
    if (hasBattery && batterySize > 0) {
        const surplusSolar = annualYield - directSolarConsumption;
        const batteryCapacityAnnual = batterySize * 250; // 250 Zyklen/Jahr
        batteryUtilization = Math.min(surplusSolar * 0.7, batteryCapacityAnnual);
        fromBattery = batteryUtilization * 0.9; // 90% Wirkungsgrad
    }
    // Gesamter Eigenverbrauch
    const selfConsumption = directSolarConsumption + fromBattery;
    const selfConsumptionRate = (selfConsumption / annualYield) * 100;
    // Netzeinspeisung
    const feedIn = annualYield - selfConsumption;
    const feedInRate = (feedIn / annualYield) * 100;
    // Restbezug aus Netz
    const fromGrid = Math.max(0, annualConsumption - selfConsumption);
    // Autarkie-Rate
    const autarkyRate = ((annualConsumption - fromGrid) / annualConsumption) * 100;
    // Wirtschaftlichkeit
    const annualSavings = selfConsumption * electricityPrice + // Eingesparte Stromkosten
        feedIn * feedInTariff - // Einspeisevergütung
        systemCost * 0.02; // 2% jährliche Betriebskosten
    const paybackTime = systemCost / annualSavings;
    const roi20Years = annualSavings * 20 - systemCost;
    // CO2-Einsparungen
    const co2FactorGrid = 0.4; // kg CO2/kWh Netzstrom
    const co2SavingsAnnual = selfConsumption * co2FactorGrid;
    const co2Savings20Years = co2SavingsAnnual * 20;
    return {
        finalSystemSize: systemSize,
        moduleCount,
        roofUtilization: 75, // Vereinfacht
        annualYield,
        monthlyYield: Math.round(annualYield / 12),
        dailyYield: Math.round(annualYield / 365),
        selfConsumption,
        selfConsumptionRate,
        feedIn,
        feedInRate,
        systemCost,
        annualSavings,
        paybackTime,
        roi20Years,
        co2SavingsAnnual,
        co2Savings20Years,
        batteryUtilization: hasBattery ? batteryUtilization : undefined,
        autarkyRate: hasBattery ? autarkyRate : undefined,
        breakdown: {
            directConsumption: directSolarConsumption,
            batteryCharged: batteryUtilization,
            gridFeedIn: feedIn,
            fromGrid,
            fromBattery
        }
    };
}
function getSolarIrradiation(location, orientation, tilt) {
    // Vereinfachte Sonneneinstrahlung für Deutschland
    const baseIrradiation = 1000; // kWh/m²/Jahr
    // Orientierungs-Faktor
    const orientationFactors = {
        "Süd": 1.0,
        "Südost": 0.95,
        "Südwest": 0.95,
        "Ost": 0.85,
        "West": 0.85,
        "Nord": 0.6
    };
    // Neigungs-Faktor (optimal bei 30°)
    const tiltFactor = 1 - Math.abs(tilt - 30) * 0.01;
    // Regional-Faktor (vereinfacht)
    let regionalFactor = 1.0;
    if (location.includes("Bayern") || location.includes("Baden")) {
        regionalFactor = 1.1;
    }
    else if (location.includes("Nord")) {
        regionalFactor = 0.9;
    }
    return baseIrradiation *
        (orientationFactors[orientation] || 0.9) *
        tiltFactor *
        regionalFactor;
}
// Finanzierungs-Berechnungen
export function calculateFinancing(systemCost, financing) {
    const downPayment = financing.downPayment || 0;
    const loanAmount = financing.loanAmount || (systemCost - downPayment);
    const interestRate = financing.interestRate || 3.5; // %
    const loanTerm = financing.loanTerm || 15; // Jahre
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTerm * 12;
    const monthlyPayment = loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        effectiveSystemCost: downPayment + totalPayment
    };
}
