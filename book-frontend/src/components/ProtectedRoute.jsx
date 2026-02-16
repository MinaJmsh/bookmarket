import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          className="loading"
          style={{
            width: "40px",
            height: "40px",
            borderColor: "var(--primary)",
            borderTopColor: "transparent",
          }}
        ></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === "admin" && user?.role !== "admin" && !user?.is_staff) {
      return <Navigate to="/" replace />;
    }

    if (
      requiredRole === "seller" &&
      user?.role !== "seller" &&
      user?.role !== "admin" &&
      !user?.is_staff
    ) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
