import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
/**
 * Universelle PrimeReact Chart-Komponente für professionelle Diagramme.
 *
 * Diese Komponente bietet eine einheitliche Schnittstelle für alle Chart-Typen
 * mit PrimeReact-Integration und responsive Design.
 */
export const ChartContainer = ({ chartType, chartData, title, showCard = true, height = 400, width = '100%' }) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title || chartType,
                font: {
                    size: 16,
                    family: 'Inter, system-ui, -apple-system, sans-serif'
                }
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        },
        ...chartData.options,
    };
    const chartElement = (_jsx(Chart, { type: chartData.type || 'line', data: chartData.data, options: defaultOptions, style: { width: width, height: `${height}px` } }));
    if (showCard) {
        return (_jsx(Card, { title: title || chartType, className: "chart-container-card mb-4", pt: {
                body: { className: 'p-0' },
                content: { className: 'p-3' }
            }, children: _jsx("div", { className: "chart-height-container", children: chartElement }) }));
    }
    return (_jsx("div", { className: "chart-container mb-4 chart-height-container", children: chartElement }));
};
// Vordefinierte Chart-Templates für häufige Anwendungsfälle (PrimeReact Chart.js Format)
export const createAmortizationChart = (years, cashflow) => ({
    type: 'line',
    data: {
        labels: years.map(y => y.toString()),
        datasets: [{
                label: 'Kumulierter Cashflow',
                data: cashflow,
                borderColor: 'rgb(55, 125, 34)',
                backgroundColor: 'rgba(55, 125, 34, 0.2)',
                tension: 0.4,
                fill: true
            }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Jahre' } },
            y: { title: { display: true, text: 'Cashflow (€)' } }
        }
    }
});
export const createROIChart = (labels, values) => ({
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
                data: values,
                backgroundColor: ['#377d22', '#4ade80', '#22c55e', '#15803d'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});
export const createEnergyProductionChart = (months, production) => ({
    type: 'bar',
    data: {
        labels: months,
        datasets: [{
                label: 'Monatliche Energieproduktion',
                data: production,
                backgroundColor: 'rgba(55, 125, 34, 0.8)',
                borderColor: 'rgba(55, 125, 34, 1)',
                borderWidth: 1
            }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Monate' } },
            y: { title: { display: true, text: 'Energieproduktion (kWh)' } }
        }
    }
});
export default ChartContainer;
