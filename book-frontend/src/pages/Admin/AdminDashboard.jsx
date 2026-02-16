import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiShoppingCart,
  FiMessageSquare,
  FiTag, // ⬅️ اضافه شد
} from "react-icons/fi";
import api from "../../services/api";
import "./AdminPages.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    active_users: 0,
    total_books: 0,
    books_breakdown: {
      approved: 0,
      pending: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin-reports/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "کاربران فعال",
      value: stats.active_users,
      icon: <FiUsers />,
      color: "primary",
      link: "/admin/users",
    },
    {
      title: "کل کتاب‌ها",
      value: stats.total_books,
      icon: <FiBook />,
      color: "secondary",
      link: "/admin/books",
    },
    {
      title: "کتاب‌های تایید شده",
      value: stats.books_breakdown.approved,
      icon: <FiShoppingCart />,
      color: "success",
      link: "/admin/books",
    },
    {
      title: "در انتظار تایید",
      value: stats.books_breakdown.pending,
      icon: <FiMessageSquare />,
      color: "warning",
      link: "/admin/books",
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>داشبورد مدیریت</h1>
          <p>مدیریت کلی سیستم</p>
        </div>

        <div className="admin-content">
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className={`stat-card ${stat.color}`}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3>{stat.value.toLocaleString("fa-IR")}</h3>
                  <p>{stat.title}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="quick-actions">
            <h2>دسترسی سریع</h2>
            <div className="quick-actions-grid">
              <Link to="/admin/users" className="quick-action-card">
                <FiUsers />
                <span>مدیریت کاربران</span>
              </Link>
              <Link to="/admin/books" className="quick-action-card">
                <FiBook />
                <span>مدیریت کتاب‌ها</span>
              </Link>
              {/* ⬇️ دکمه جدید */}
              <Link to="/admin/categories" className="quick-action-card">
                <FiTag />
                <span>مدیریت دسته‌بندی‌ها</span>
              </Link>
              <Link to="/admin/support" className="quick-action-card">
                <FiMessageSquare />
                <span>پشتیبانی</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
