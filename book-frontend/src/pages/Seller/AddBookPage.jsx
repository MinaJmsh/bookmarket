import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave, FiArrowRight, FiImage } from "react-icons/fi";
import api from "../../services/api";
import "./SellerPages.css";

const AddBookPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    condition: "used",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("condition", formData.condition);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await api.post("/books/my-inventory/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("کتاب با موفقیت اضافه شد و در انتظار تایید است");
      navigate("/seller/inventory");
    } catch (error) {
      toast.error("خطا در افزودن کتاب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowRight /> بازگشت
        </button>

        <div className="page-header">
          <h1>افزودن کتاب جدید</h1>
          <p>اطلاعات کتاب خود را وارد کنید</p>
        </div>

        <div className="seller-content">
          <div className="book-form-card">
            <form onSubmit={handleSubmit} className="book-form">
              <div className="form-row">
                <div className="form-group">
                  <label>عنوان کتاب *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="عنوان کتاب را وارد کنید"
                  />
                </div>

                <div className="form-group">
                  <label>نویسنده *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    placeholder="نام نویسنده"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>دسته‌بندی *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>قیمت (تومان) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="قیمت کتاب"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>وضعیت کتاب *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="new">نو</option>
                  <option value="used">دست دوم</option>
                </select>
              </div>

              <div className="form-group">
                <label>توضیحات *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="توضیحات کامل درباره کتاب..."
                />
              </div>

              <div className="form-group">
                <label>
                  <FiImage /> تصویر کتاب
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading"></div>
                ) : (
                  <>
                    <FiSave /> ذخیره کتاب
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
