import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiBook,
  FiDollarSign,
  FiUsers,
  FiArrowLeft,
} from "react-icons/fi";
import api from "../services/api";
import BookCard from "../components/BookCard/Bookcard";
import "./HomePage.css";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchFeaturedBooks();
    fetchStats();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const response = await api.get("/books/?ordering=-created_at");
      setFeaturedBooks(response.data.slice(0, 8));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin-reports/");
      setStats({
        totalBooks: response.data.total_books || 0,
        activeUsers: response.data.active_users || 0,
      });
    } catch (error) {
      // Stats not critical
    }
  };

  const features = [
    {
      icon: <FiBook />,
      title: "کتاب‌های متنوع",
      description: "دسترسی به هزاران کتاب دست دوم در دسته‌بندی‌های مختلف",
    },
    {
      icon: <FiDollarSign />,
      title: "قیمت مناسب",
      description: "خرید و فروش کتاب با قیمت‌های عادلانه و مقرون به صرفه",
    },
    {
      icon: <FiUsers />,
      title: "جامعه فعال",
      description: "عضویت در جامعه‌ای از کتابخوانان و فروشندگان معتبر",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-text"
            >
              <h1 className="hero-title">
                خرید و فروش
                <span className="highlight"> کتاب‌های دست دوم</span>
              </h1>
              <p className="hero-description">
                با کتاب‌مارکت به راحتی کتاب‌های مورد نظر خود را پیدا کنید یا
                کتاب‌های خود را به فروش برسانید. صرفه‌جویی اقتصادی و دسترسی آسان
                به دنیای کتاب.
              </p>
              <div className="hero-actions">
                <Link to="/books" className="btn btn-primary btn-large">
                  مشاهده کتاب‌ها
                  <FiArrowLeft />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-large">
                  ثبت‌نام رایگان
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {stats.totalBooks.toLocaleString("fa-IR")}
                  </span>
                  <span className="stat-label">کتاب موجود</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {stats.activeUsers.toLocaleString("fa-IR")}
                  </span>
                  <span className="stat-label">کاربر فعال</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-image"
            >
              <div className="hero-image-wrapper">
                <img
                  src="https://live.staticflickr.com/4006/4516917880_7d78593163_b.jpg"
                  alt="Books"
                />
                <div className="hero-image-overlay"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-center"
          >
            چرا کتاب‌مارکت؟
          </motion.h2>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-books-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">جدیدترین کتاب‌ها</h2>
            <Link to="/books" className="view-all-link">
              مشاهده همه
              <FiArrowLeft />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2 className="cta-title">آماده شروع هستید؟</h2>
            <p className="cta-description">
              همین حالا به جامعه کتاب‌مارکت بپیوندید و از مزایای خرید و فروش
              کتاب بهره‌مند شوید
            </p>
            <Link to="/register" className="btn btn-accent btn-large">
              عضویت رایگان
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
