import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../services/api";
import BookCard from "../components/BookCard/Bookcard";
import "./BooksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    condition: "",
    status: "available",
    min_price: "",
    max_price: "",
    ordering: "-created_at",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.status) params.append("status", filters.status);
      if (filters.min_price) params.append("price__gte", filters.min_price);
      if (filters.max_price) params.append("price__lte", filters.max_price);
      if (filters.ordering) params.append("ordering", filters.ordering);

      const response = await api.get(`/books/?${params}`);
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      condition: "",
      status: "available",
      min_price: "",
      max_price: "",
      ordering: "-created_at",
    });
  };

  return (
    <div className="books-page">
      <div className="container">
        <div className="page-header">
          <h1>کتاب‌ها</h1>
          <p>مجموعه کامل کتاب‌های دست دوم</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="جستجوی کتاب یا نویسنده..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="filters-grid">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">همه دسته‌بندی‌ها</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange("condition", e.target.value)}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="new">نو</option>
              <option value="used">دست دوم</option>
            </select>

            <select
              value={filters.ordering}
              onChange={(e) => handleFilterChange("ordering", e.target.value)}
            >
              <option value="-created_at">جدیدترین</option>
              <option value="price">ارزان‌ترین</option>
              <option value="-price">گران‌ترین</option>
              <option value="title">الفبایی</option>
            </select>

            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-small"
            >
              پاک کردن فیلترها
            </button>
          </div>

          <div className="price-filter">
            <input
              type="number"
              placeholder="حداقل قیمت"
              value={filters.min_price}
              onChange={(e) => handleFilterChange("min_price", e.target.value)}
            />
            <span>تا</span>
            <input
              type="number"
              placeholder="حداکثر قیمت"
              value={filters.max_price}
              onChange={(e) => handleFilterChange("max_price", e.target.value)}
            />
          </div>
        </div>

        <div className="results-section">
          <div className="results-header">
            <p>{books.length} کتاب یافت شد</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          ) : books.length > 0 ? (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>کتابی یافت نشد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
