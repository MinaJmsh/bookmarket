import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./BookCard.css";

const BookCard = ({ book, onFavoriteToggle, showActions = true }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const getConditionLabel = (condition) => {
    return condition === "new" ? "نو" : "دست دوم";
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { text: "موجود", class: "badge-success" },
      sold: { text: "فروخته شده", class: "badge-error" },
      pending: { text: "در انتظار تایید", class: "badge-warning" },
    };
    return badges[status] || badges["pending"];
  };

  const handleFavorite = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("لطفا ابتدا وارد شوید");
      return;
    }

    try {
      setLoading(true);
      if (isFavorited) {
        await api.delete(`/favorites/${book.id}/`);
        setIsFavorited(false);
        toast.success("از علاقه‌مندی‌ها حذف شد");
      } else {
        await api.post("/favorites/", { book: book.id });
        setIsFavorited(true);
        toast.success("به علاقه‌مندی‌ها اضافه شد");
      }

      if (onFavoriteToggle) {
        onFavoriteToggle(book.id, !isFavorited);
      }
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error("خطا در عملیات");
    } finally {
      setLoading(false);
    }
  };

  const defaultImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjZmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM4ZTg5ODUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7aqduM2Kgg2qnYqtin2Io8L3RleHQ+PC9zdmc+";

  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`} className="book-card-link">
        <div className="book-card-image">
          <img
            src={book.image || defaultImage}
            alt={book.title}
            onError={(e) => (e.target.src = defaultImage)}
          />
          <div className="book-card-overlay">
            <FiEye className="view-icon" />
            <span>مشاهده جزئیات</span>
          </div>

          <div
            className={`book-status-badge badge ${getStatusBadge(book.status).class}`}
          >
            {getStatusBadge(book.status).text}
          </div>
        </div>

        <div className="book-card-content">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>

          <div className="book-meta">
            <span className="book-category">{book.category_name}</span>
            <span className="book-condition badge badge-info">
              {getConditionLabel(book.condition)}
            </span>
          </div>

          <div className="book-card-footer">
            <div className="book-price">
              <span className="price-amount">{formatPrice(book.price)}</span>
              <span className="price-currency">تومان</span>
            </div>

            {showActions && (
              <div className="book-actions">
                <button
                  className={`action-btn ${isFavorited ? "favorited" : ""}`}
                  onClick={handleFavorite}
                  disabled={loading}
                  title={
                    isFavorited
                      ? "حذف از علاقه‌مندی‌ها"
                      : "افزودن به علاقه‌مندی‌ها"
                  }
                >
                  <FiHeart />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
