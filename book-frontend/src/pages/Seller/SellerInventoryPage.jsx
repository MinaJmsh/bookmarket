import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash2, FiPackage } from "react-icons/fi";
import api from "../../services/api";
import "./SellerPages.css";

const SellerInventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get("/books/my-inventory/");
      setBooks(response.data);
    } catch (error) {
      toast.error("خطا در دریافت کتاب‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا از حذف این کتاب اطمینان دارید؟")) return;

    try {
      await api.delete(`/books/${id}/`);
      setBooks(books.filter((book) => book.id !== id));
      toast.success("کتاب حذف شد");
    } catch (error) {
      toast.error("خطا در حذف کتاب");
    }
  };

  const getStatusBadge = (status, isApproved) => {
    if (!isApproved)
      return <span className="badge badge-warning">در انتظار تایید</span>;
    if (status === "sold")
      return <span className="badge badge-error">فروخته شده</span>;
    if (status === "available")
      return <span className="badge badge-success">موجود</span>;
    return <span className="badge badge-warning">در انتظار</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>انبار کتاب‌های من</h1>
            <p>مدیریت کتاب‌های خود</p>
          </div>
          <Link to="/seller/add-book" className="btn btn-primary">
            <FiPlus /> افزودن کتاب جدید
          </Link>
        </div>

        <div className="seller-content">
          {books.length > 0 ? (
            <div className="inventory-table">
              <table>
                <thead>
                  <tr>
                    <th>تصویر</th>
                    <th>عنوان</th>
                    <th>نویسنده</th>
                    <th>قیمت</th>
                    <th>وضعیت</th>
                    <th>تاریخ ایجاد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
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
                      <td>
                        {Number(book.price).toLocaleString("fa-IR")} تومان
                      </td>
                      <td>{getStatusBadge(book.status, book.is_approved)}</td>
                      <td>
                        {new Date(book.created_at).toLocaleDateString("fa-IR")}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/seller/edit-book/${book.id}`}
                            className="btn-icon edit"
                            title="ویرایش"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="btn-icon delete"
                            title="حذف"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FiPackage size={64} />
              <h3>هنوز کتابی اضافه نکرده‌اید</h3>
              <p>اولین کتاب خود را اضافه کنید</p>
              <Link to="/seller/add-book" className="btn btn-primary btn-large">
                <FiPlus /> افزودن کتاب
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerInventoryPage;
