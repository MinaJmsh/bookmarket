import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiShoppingCart, FiPackage, FiCheckCircle } from "react-icons/fi";
import api from "../../services/api";
import "./UserPages.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-invoices/");
      setOrders(response.data);
    } catch (error) {
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FiCheckCircle className="status-icon success" />;
      case "pending":
        return <FiPackage className="status-icon warning" />;
      default:
        return <FiShoppingCart className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "پرداخت شده";
      case "pending":
        return "در انتظار";
      case "shipped":
        return "ارسال شده";
      default:
        return status;
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
          <h1>سفارش‌های من</h1>
          <p>مشاهده و پیگیری سفارشات</p>
        </div>

        <div className="user-content">
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>{order.book_title}</h3>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="order-detail-item">
                      <span className="label">مبلغ:</span>
                      <span className="value">
                        {Number(order.total_price).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    </div>
                    {order.tracking_code && (
                      <div className="order-detail-item">
                        <span className="label">کد پیگیری:</span>
                        <span className="value tracking-code">
                          {order.tracking_code}
                        </span>
                      </div>
                    )}
                    <div className="order-detail-item">
                      <span className="label">وضعیت پرداخت:</span>
                      <span
                        className={`badge badge-${order.payment_status === "success" ? "success" : "warning"}`}
                      >
                        {order.payment_status === "success"
                          ? "موفق"
                          : "در انتظار"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiShoppingCart size={64} />
              <h3>هنوز سفارشی ندارید</h3>
              <p>از صفحه کتاب‌ها شروع به خرید کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
