import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import api from "../../services/api";
import "./UserPages.css";

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "technical",
    message: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support-tickets/");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/support-tickets/", formData);
      toast.success("تیکت شما با موفقیت ارسال شد");
      setFormData({ subject: "technical", message: "" });
      fetchTickets();
    } catch (error) {
      toast.error("خطا در ارسال تیکت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <div className="container">
        <div className="page-header">
          <h1>پشتیبانی</h1>
          <p>ارتباط با تیم پشتیبانی</p>
        </div>

        <div className="user-content">
          <div className="support-grid">
            <div className="support-form-section">
              <h2>ارسال تیکت جدید</h2>
              <form onSubmit={handleSubmit} className="support-form">
                <div className="form-group">
                  <label>موضوع</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="technical">مشکل فنی</option>
                    <option value="payment">مشکل پرداخت</option>
                    <option value="report">گزارش کاربر/کتاب</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>پیام</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="توضیحات خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading"></div>
                  ) : (
                    <>
                      <FiSend /> ارسال تیکت
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="tickets-history-section">
              <h2>تیکت‌های قبلی</h2>
              {tickets.length > 0 ? (
                <div className="tickets-list">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-header">
                        <span
                          className={`badge ${ticket.is_resolved ? "badge-success" : "badge-warning"}`}
                        >
                          {ticket.is_resolved ? "پاسخ داده شده" : "در انتظار"}
                        </span>
                        <span className="ticket-date">
                          {new Date(ticket.created_at).toLocaleDateString(
                            "fa-IR",
                          )}
                        </span>
                      </div>
                      <h4>
                        {ticket.subject === "technical"
                          ? "مشکل فنی"
                          : ticket.subject === "payment"
                            ? "مشکل پرداخت"
                            : ticket.subject === "report"
                              ? "گزارش"
                              : "سایر"}
                      </h4>
                      <p className="ticket-message">{ticket.message}</p>
                      {ticket.admin_reply && (
                        <div className="admin-reply">
                          <strong>پاسخ پشتیبانی:</strong>
                          <p>{ticket.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-small">
                  <FiMessageSquare size={48} />
                  <p>هنوز تیکتی ارسال نکرده‌اید</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
