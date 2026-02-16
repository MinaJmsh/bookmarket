import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiHeart,
  FiShoppingCart,
  FiArrowRight,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./BookDetailPage.css";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}/`);
      setBook(response.data);
    } catch (error) {
      toast.error("کتاب یافت نشد");
      navigate("/books");
    } finally {
      setLoading(false);
    }
  };
  // فقط این بخش handlePurchase را تغییر دهید:

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.info("لطفا ابتدا وارد شوید");
      navigate("/login");
      return;
    }

    if (book.status !== "available") {
      toast.error("این کتاب در حال حاضر موجود نیست");
      return;
    }

    try {
      const response = await api.post("/orders/", { book: book.id });
      toast.success("خرید با موفقیت انجام شد");
      navigate("/my-orders");
    } catch (error) {
      toast.error(error.response?.data?.detail || "خطا در خرید");
    }
  };
  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast.info("لطفا ابتدا وارد شوید");
      return;
    }

    try {
      await api.post("/favorites/", { book: book.id });
      toast.success("به علاقه‌مندی‌ها اضافه شد");
    } catch (error) {
      toast.error("خطا در افزودن به علاقه‌مندی‌ها");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (!book) return null;

  const defaultImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjZmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM4ZTg5ODUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7aqduM2Kgg2qnYqtin2Yo8L3RleHQ+PC9zdmc+";

  return (
    <div className="book-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowRight /> بازگشت
        </button>

        <div className="book-detail-content">
          <div className="book-image-section">
            <img
              src={book.image || defaultImage}
              alt={book.title}
              onError={(e) => (e.target.src = defaultImage)}
            />
          </div>

          <div className="book-info-section">
            <div className="book-header">
              <h1>{book.title}</h1>
              <p className="author">نویسنده: {book.author}</p>
            </div>

            <div className="book-badges">
              <span className="badge badge-info">{book.category_name}</span>
              <span className="badge">
                {book.condition === "new" ? "نو" : "دست دوم"}
              </span>
              <span
                className={`badge ${
                  book.status === "available"
                    ? "badge-success"
                    : book.status === "sold"
                      ? "badge-error"
                      : "badge-warning"
                }`}
              >
                {book.status === "available"
                  ? "موجود"
                  : book.status === "sold"
                    ? "فروخته شده"
                    : "در انتظار تایید"}
              </span>
            </div>

            <div className="price-section">
              <div className="price">
                <span className="price-amount">
                  {Number(book.price).toLocaleString("fa-IR")}
                </span>
                <span className="price-currency">تومان</span>
              </div>
            </div>

            <div className="description-section">
              <h3>توضیحات</h3>
              <p>{book.description}</p>
            </div>

            <div className="seller-section">
              <h3>اطلاعات فروشنده</h3>
              <div className="seller-info">
                <div className="seller-item">
                  <FiUser />
                  <span>{book.seller_name}</span>
                </div>
                <div className="seller-item">
                  <FiPhone />
                  <span>{book.seller_contact}</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {book.status === "available" ? (
                <>
                  <button
                    onClick={handlePurchase}
                    className="btn btn-primary btn-large"
                  >
                    <FiShoppingCart /> خرید کتاب
                  </button>
                  <button
                    onClick={handleAddToFavorites}
                    className="btn btn-secondary btn-large"
                  >
                    <FiHeart /> افزودن به علاقه‌مندی‌ها
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary btn-large" disabled>
                  {book.status === "sold" ? "فروخته شده" : "در انتظار تأیید"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
