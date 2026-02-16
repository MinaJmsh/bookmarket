import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiSend } from "react-icons/fi";
import api from "../../services/api";
import "./AdminPages.css";

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support-tickets/");
      setTickets(response.data);
    } catch (error) {
      toast.error("خطا در دریافت تیکت‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) {
      toast.error("لطفا پاسخ را وارد کنید");
      return;
    }

    try {
      await api.post(`/support-tickets/${ticketId}/reply/`, {
        admin_reply: replyText,
      });
      toast.success("پاسخ ارسال شد");
      setReplyingTo(null);
      setReplyText("");
      fetchTickets();
    } catch (error) {
      toast.error("خطا در ارسال پاسخ");
    }
  };

  const getSubjectText = (subject) => {
    const subjects = {
      technical: "مشکل فنی",
      payment: "مشکل پرداخت",
      report: "گزارش",
      other: "سایر",
    };
    return subjects[subject] || subject;
  };

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
          <h1>مدیریت پشتیبانی</h1>
          <p>پاسخ به تیکت‌های کاربران</p>
        </div>

        <div className="admin-content">
          <div className="tickets-admin-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-admin-card">
                <div className="ticket-admin-header">
                  <div>
                    <h3>{getSubjectText(ticket.subject)}</h3>
                    <p className="ticket-user">کاربر: {ticket.user}</p>
                    <p className="ticket-date">
                      {new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <span
                    className={`badge ${ticket.is_resolved ? "badge-success" : "badge-warning"}`}
                  >
                    {ticket.is_resolved ? "پاسخ داده شده" : "در انتظار"}
                  </span>
                </div>

                <div className="ticket-admin-body">
                  <p className="ticket-message">
                    <strong>پیام:</strong> {ticket.message}
                  </p>

                  {ticket.admin_reply && (
                    <div className="admin-reply-show">
                      <strong>پاسخ شما:</strong>
                      <p>{ticket.admin_reply}</p>
                    </div>
                  )}

                  {!ticket.is_resolved && (
                    <>
                      {replyingTo === ticket.id ? (
                        <div className="reply-form">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="پاسخ خود را بنویسید..."
                            rows="4"
                          />
                          <div className="reply-actions">
                            <button
                              onClick={() => handleReply(ticket.id)}
                              className="btn btn-primary"
                            >
                              <FiSend /> ارسال پاسخ
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="btn btn-secondary"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(ticket.id)}
                          className="btn btn-primary btn-small"
                        >
                          پاسخ دادن
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
