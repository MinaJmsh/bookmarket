import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import api from "../../services/api";
import BookCard from "../../components/BookCard/Bookcard";
import "./UserPages.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites/");
      setFavorites(response.data);
    } catch (error) {
      toast.error("خطا در دریافت علاقه‌مندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}/`);
      setFavorites(favorites.filter((fav) => fav.id !== id));
      toast.success("از علاقه‌مندی‌ها حذف شد");
    } catch (error) {
      toast.error("خطا در حذف");
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
          <h1>علاقه‌مندی‌های من</h1>
          <p>کتاب‌های مورد علاقه شما</p>
        </div>

        <div className="user-content">
          {favorites.length > 0 ? (
            <div className="books-grid">
              {favorites.map((fav) => (
                <BookCard
                  key={fav.id}
                  book={fav.book_details}
                  onFavoriteToggle={() => handleRemoveFavorite(fav.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiHeart size={64} />
              <h3>هنوز کتابی را به علاقه‌مندی‌ها اضافه نکرده‌اید</h3>
              <p>کتاب‌های مورد علاقه خود را ذخیره کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
