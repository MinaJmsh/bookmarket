import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiSearch } from "react-icons/fi";
import api from "../../services/api";
import "./AdminPages.css";

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      if (filterStatus === "pending") {
        filtered = filtered.filter((book) => !book.is_approved);
      } else if (filterStatus === "approved") {
        filtered = filtered.filter((book) => book.is_approved);
      }
    }

    setFilteredBooks(filtered);
  }, [searchTerm, filterStatus, books]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/");
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      toast.error("خطا در دریافت کتاب‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/approve/`);
      toast.success("کتاب تایید شد");
      fetchBooks();
    } catch (error) {
      toast.error("خطا در تایید کتاب");
    }
  };

  const handleReject = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/reject/`);
      toast.success("کتاب رد شد");
      fetchBooks();
    } catch (error) {
      toast.error("خطا در رد کتاب");
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
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>مدیریت کتاب‌ها</h1>
          <p>تایید و مدیریت کتاب‌های ثبت شده</p>
        </div>

        <div className="admin-content">
          <div className="filters-section">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="جستجو بر اساس عنوان یا نویسنده..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">همه کتاب‌ها</option>
              <option value="pending">در انتظار تایید</option>
              <option value="approved">تایید شده</option>
            </select>
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>تصویر</th>
                  <th>عنوان</th>
                  <th>نویسنده</th>
                  <th>فروشنده</th>
                  <th>قیمت</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <img
                        src={book.image || "/default-book.png"}
                        alt={book.title}
                        className="book-thumb"
                      />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.seller_name}</td>
                    <td>{Number(book.price).toLocaleString("fa-IR")} تومان</td>
                    <td>
                      {book.is_approved ? (
                        <span className="badge badge-success">تایید شده</span>
                      ) : (
                        <span className="badge badge-warning">در انتظار</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!book.is_approved ? (
                          <>
                            <button
                              onClick={() => handleApprove(book.id)}
                              className="btn-icon approve"
                              title="تایید"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleReject(book.id)}
                              className="btn-icon delete"
                              title="رد"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleReject(book.id)}
                            className="btn-icon delete"
                            title="لغو تایید"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBooksPage;
