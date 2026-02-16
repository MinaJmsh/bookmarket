import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import api from "../../services/api";
import "./UserPages.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      setNotifications(response.data);
    } catch (error) {
      toast.error("خطا در دریافت اعلان‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark-as-read/`);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif,
        ),
      );
    } catch (error) {
      toast.error("خطا در علامت‌گذاری");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="container">
        <div className="page-header">
          <h1>اعلان‌ها</h1>
          <p>پیام‌ها و اطلاعیه‌های شما</p>
        </div>

        <div className="user-content">
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-card ${notif.is_read ? "read" : "unread"}`}
                >
                  <div className="notification-icon">
                    <FiBell />
                  </div>
                  <div className="notification-content">
                    <p>{notif.message}</p>
                    <span className="notification-date">
                      {new Date(notif.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="btn btn-secondary btn-small"
                    >
                      <FiCheckCircle /> خوانده شد
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiBell size={64} />
              <h3>اعلانی وجود ندارد</h3>
              <p>اعلان‌های جدید اینجا نمایش داده می‌شوند</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
