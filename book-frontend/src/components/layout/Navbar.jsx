import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBook,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiHeart,
  FiShoppingCart,
  FiBell,
  FiMenu,
  FiX,
  FiPackage,
  FiSettings,
} from "react-icons/fi";
import api from "../../services/api";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isSeller } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotificationCount();
    }
  }, [isAuthenticated]);

  const fetchNotificationCount = async () => {
    try {
      const response = await api.get("/notifications/");
      const unread = response.data.filter((n) => !n.is_read).length;
      setNotificationCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <FiBook className="logo-icon" />
            <span className="logo-text">کتاب‌مارکت</span>
          </Link>

          <div className="navbar-menu desktop-menu">
            <Link
              to="/books"
              className={`nav-link ${isActivePath("/books") ? "active" : ""}`}
            >
              کتاب‌ها
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className={`nav-link ${isActivePath("/favorites") ? "active" : ""}`}
                >
                  <FiHeart /> علاقه‌مندی‌ها
                </Link>
                <Link
                  to="/my-orders"
                  className={`nav-link ${isActivePath("/my-orders") ? "active" : ""}`}
                >
                  <FiShoppingCart /> سفارش‌ها
                </Link>
              </>
            )}

            {isSeller() && (
              <Link
                to="/seller/inventory"
                className={`nav-link ${isActivePath("/seller/inventory") ? "active" : ""}`}
              >
                <FiPackage /> انبار من
              </Link>
            )}

            {isAdmin() && (
              <Link
                to="/admin"
                className={`nav-link ${isActivePath("/admin") ? "active" : ""}`}
              >
                <FiSettings /> پنل مدیریت
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="icon-button">
                  <FiBell />
                  {notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                <div className="user-menu">
                  <button className="user-button">
                    <FiUser />
                    <span>{user?.username}</span>
                  </button>
                  <div className="user-dropdown">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser /> پروفایل
                    </Link>
                    <Link
                      to="/support"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      پشتیبانی
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                      <FiLogOut /> خروج
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-small">
                  <FiLogIn /> ورود
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  ثبت‌نام
                </Link>
              </>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link
              to="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              کتاب‌ها
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  <FiHeart /> علاقه‌مندی‌ها
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  <FiShoppingCart /> سفارش‌ها
                </Link>
              </>
            )}

            {isSeller() && (
              <Link
                to="/seller/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                <FiPackage /> انبار من
              </Link>
            )}

            {isAdmin() && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                <FiSettings /> پنل مدیریت
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
