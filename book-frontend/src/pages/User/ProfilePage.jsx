import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./UserPages.css";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch("/profile/", formData);
      updateUser(response.data);
      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error("خطا در به‌روزرسانی پروفایل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <div className="container">
        <div className="page-header">
          <h1>پروفایل من</h1>
          <p>مدیریت اطلاعات حساب کاربری</p>
        </div>

        <div className="user-content">
          <div className="user-card">
            <div className="user-info-header">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div>
                <h2>{user?.username}</h2>
                <p className="user-role">
                  {user?.role === "admin"
                    ? "مدیر"
                    : user?.role === "seller"
                      ? "فروشنده"
                      : "خریدار"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>نام</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="نام خود را وارد کنید"
                  />
                </div>

                <div className="form-group">
                  <label>نام خانوادگی</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="نام خانوادگی خود را وارد کنید"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiMail /> ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiPhone /> شماره موبایل
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  pattern="09[0-9]{9}"
                  required
                />
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
                    <FiSave /> ذخیره تغییرات
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

export default ProfilePage;
