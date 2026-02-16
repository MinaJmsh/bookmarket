import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get("/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log("Attempting login with:", username); // اضافه کنید

      const response = await api.post("/token/", { username, password });
      console.log("Login response:", response.data); // اضافه کنید

      const { access, refresh } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      setToken(access);

      const userResponse = await api.get("/profile/");
      console.log("User profile:", userResponse.data); // اضافه کنید

      setUser(userResponse.data);

      return { success: true };
    } catch (error) {
      console.error("Login error details:", error); // اضافه کنید
      console.error("Error response:", error.response); // اضافه کنید

      return {
        success: false,
        error: error.response?.data?.detail || "خطا در ورود به سیستم",
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post("/register/", userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "خطا در ثبت‌نام",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const isAdmin = () => {
    return user?.role === "admin" || user?.is_staff === true;
  };

  const isSeller = () => {
    return user?.role === "seller" || isAdmin();
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isSeller,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
