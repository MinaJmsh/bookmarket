import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash2, FiTag } from "react-icons/fi";
import api from "../../services/api";
import "./AdminPages.css";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("لطفا نام دسته‌بندی را وارد کنید");
      return;
    }

    try {
      if (editingCategory) {
        // ویرایش
        await api.put(`/categories/${editingCategory.id}/`, {
          name: categoryName,
        });
        toast.success("دسته‌بندی با موفقیت ویرایش شد");
      } else {
        // افزودن
        await api.post("/categories/", { name: categoryName });
        toast.success("دسته‌بندی با موفقیت اضافه شد");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error("خطا در ذخیره دسته‌بندی");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

    try {
      await api.delete(`/categories/${id}/`);
      toast.success("دسته‌بندی حذف شد");
      fetchCategories();
    } catch (error) {
      toast.error("خطا در حذف دسته‌بندی");
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
          <div>
            <h1>مدیریت دسته‌بندی‌ها</h1>
            <p>مدیریت دسته‌بندی‌های کتاب‌ها</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <FiPlus /> افزودن دسته‌بندی
          </button>
        </div>

        <div className="admin-content">
          {categories.length > 0 ? (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام دسته‌بندی</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <FiTag style={{ color: "var(--primary)" }} />
                          {category.name}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleOpenModal(category)}
                            className="btn-icon edit"
                            title="ویرایش"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
              <FiTag size={64} />
              <h3>هنوز دسته‌بندی‌ای وجود ندارد</h3>
              <p>اولین دسته‌بندی را اضافه کنید</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>
                {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
              </h3>
              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label>نام دسته‌بندی</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="مثال: رمان، تاریخ، علمی"
                    required
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
