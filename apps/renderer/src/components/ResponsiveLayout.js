import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
export const ResponsiveGrid = ({ children, columns = { sm: 1, md: 2, lg: 3, xl: 4 }, gap = 'md', className = '' }) => {
    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
    };
    const gridClasses = `
    grid
    grid-cols-${columns.sm || 1}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    ${columns.xl ? `xl:grid-cols-${columns.xl}` : ''}
    ${gapClasses[gap]}
  `.trim().replace(/\s+/g, ' ');
    return (_jsx("div", { className: `${gridClasses} ${className}`, children: children }));
};
export const ResponsiveContainer = ({ children, maxWidth = '7xl', padding = 'md', className = '' }) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full'
    };
    const paddingClasses = {
        sm: 'px-4 py-2',
        md: 'px-6 py-4',
        lg: 'px-8 py-6',
        xl: 'px-12 py-8'
    };
    return (_jsx("div", { className: `${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`, children: children }));
};
export const ResponsiveNav = ({ title, logo, menuItems, actions, className = '' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    return (_jsx("nav", { className: `bg-white shadow-lg border-b border-gray-200 ${className}`, children: _jsxs(ResponsiveContainer, { maxWidth: "7xl", padding: "md", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [logo && (_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: _jsx("i", { className: `${logo} text-white` }) })), _jsx("h1", { className: "text-xl font-bold text-gray-900 hidden sm:block", children: title }), _jsx("h1", { className: "text-lg font-bold text-gray-900 sm:hidden", children: title.split(' ')[0] })] }), _jsx("div", { className: "hidden lg:flex items-center space-x-1", children: menuItems.map((item, index) => (_jsxs("a", { href: item.href, className: `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${item.active
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`, children: [item.icon && _jsx("i", { className: `${item.icon} mr-2` }), item.label] }, index))) }), _jsxs("div", { className: "flex items-center space-x-3", children: [actions && _jsx("div", { className: "hidden md:block", children: actions }), _jsx("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), title: "Men\u00FC \u00F6ffnen/schlie\u00DFen", className: "lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100", children: _jsx("i", { className: `pi ${isMobileMenuOpen ? 'pi-times' : 'pi-bars'} text-lg` }) })] })] }), isMobileMenuOpen && (_jsxs("div", { className: "lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4", children: [_jsx("div", { className: "space-y-2", children: menuItems.map((item, index) => (_jsxs("a", { href: item.href, className: `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${item.active
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`, onClick: () => setIsMobileMenuOpen(false), children: [item.icon && _jsx("i", { className: `${item.icon} mr-3` }), item.label] }, index))) }), actions && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: actions }))] }))] }) }));
};
export const ResponsiveSidebar = ({ title, items, footer, className = '' }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40", onClick: () => setIsOpen(false) })), _jsx("div", { className: `
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-64 bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-300 ease-out
        ${className}
      `, children: _jsxs("div", { className: "h-full flex flex-col", children: [title && (_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: title }), _jsx("button", { onClick: () => setIsOpen(false), title: "Sidebar schlie\u00DFen", className: "lg:hidden p-1 rounded text-gray-500 hover:text-gray-700", children: _jsx("i", { className: "pi pi-times" }) })] }) })), _jsx("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: items.map((item, index) => (_jsxs("a", { href: item.href, className: `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${item.active
                                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                `, onClick: () => setIsOpen(false), children: [item.icon && _jsx("i", { className: `${item.icon} mr-3 text-lg` }), _jsx("span", { className: "flex-1", children: item.label }), item.badge && (_jsx("span", { className: "ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full", children: item.badge }))] }, index))) }), footer && (_jsx("div", { className: "p-4 border-t border-gray-200", children: footer }))] }) }), _jsx("button", { onClick: () => setIsOpen(true), title: "Men\u00FC \u00F6ffnen", className: "lg:hidden fixed bottom-4 left-4 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700", children: _jsx("i", { className: "pi pi-bars" }) })] }));
};
export const ResponsiveTable = ({ headers, data, onRowClick, loading = false, emptyMessage = "Keine Daten vorhanden", className = '' }) => {
    const [sortField, setSortField] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const sortedData = React.useMemo(() => {
        if (!sortField)
            return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal < bVal)
                return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal)
                return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortField, sortDirection]);
    if (loading) {
        return (_jsxs("div", { className: `bg-white rounded-lg shadow-lg p-8 text-center ${className}`, children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Daten werden geladen..." })] }));
    }
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-lg overflow-hidden ${className}`, children: [_jsx("div", { className: "hidden lg:block overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsx("tr", { children: headers.map((header) => (_jsx("th", { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''} ${header.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`, onClick: () => header.sortable && handleSort(header.key), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { children: header.label }), header.sortable && (_jsx("i", { className: `pi ${sortField === header.key
                                                    ? (sortDirection === 'asc' ? 'pi-sort-up' : 'pi-sort-down')
                                                    : 'pi-sort'} text-xs` }))] }) }, header.key))) }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: sortedData.map((row, index) => (_jsx("tr", { className: `hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`, onClick: () => onRowClick?.(row), children: headers.map((header) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: row[header.key] }, header.key))) }, index))) })] }) }), _jsx("div", { className: "lg:hidden divide-y divide-gray-200", children: sortedData.map((row, index) => (_jsx("div", { className: `p-4 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`, onClick: () => onRowClick?.(row), children: _jsxs("div", { className: "space-y-2", children: [headers.slice(0, 3).map((header) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "text-sm font-medium text-gray-600", children: [header.label, ":"] }), _jsx("span", { className: "text-sm text-gray-900", children: row[header.key] })] }, header.key))), headers.length > 3 && (_jsxs("div", { className: "text-xs text-gray-500 pt-2", children: ["+", headers.length - 3, " weitere Felder"] }))] }) }, index))) }), sortedData.length === 0 && (_jsxs("div", { className: "p-8 text-center", children: [_jsx("i", { className: "pi pi-inbox text-4xl text-gray-400 mb-4" }), _jsx("p", { className: "text-gray-600", children: emptyMessage })] }))] }));
};
export default { ResponsiveGrid, ResponsiveContainer, ResponsiveNav, ResponsiveSidebar, ResponsiveTable };
