import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './Login';
import AdminDashboard from './AdminDashboard';
import SystemSettings from './SystemSettings';
import ProductManagement from './ProductManagement';
import PricingManagement from './PricingManagement';
import DatabaseManagement from './DatabaseManagement';
import UserManagement from './UserManagement';
export default function AdminRouter() {
    // Hier würde normalerweise eine Auth-Prüfung stattfinden
    const isAuthenticated = true; // Für Demo-Zwecke
    if (!isAuthenticated) {
        return _jsx(AdminLogin, {});
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "settings", element: _jsx(SystemSettings, {}) }), _jsx(Route, { path: "products", element: _jsx(ProductManagement, {}) }), _jsx(Route, { path: "pricing", element: _jsx(PricingManagement, {}) }), _jsx(Route, { path: "database", element: _jsx(DatabaseManagement, {}) }), _jsx(Route, { path: "users", element: _jsx(UserManagement, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/admin", replace: true }) })] }));
}
