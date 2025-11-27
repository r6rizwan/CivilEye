import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const userRole = localStorage.getItem("role");

    if (!userRole) return <Navigate to="/login" />;

    if (userRole !== role) return <Navigate to="/login" />;

    return children;
}
