import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import "./AuthPages.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیست");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);

      if (result.success) {
        toast.success("ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید");
        navigate("/login");
      } else {
        if (typeof result.error === "object") {
          Object.values(result.error).forEach((err) => {
            toast.error(Array.isArray(err) ? err[0] : err);
          });
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>ثبت‌نام در کتاب‌مارکت</h1>
            <p>ایجاد حساب کاربری جدید</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FiUser /> نام کاربری
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="نام کاربری"
              />
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
                placeholder="example@email.com"
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
                required
                placeholder="09xxxxxxxxx"
                pattern="09[0-9]{9}"
              />
              <small>شماره موبایل باید با 09 شروع شود و 11 رقم باشد</small>
            </div>

            <div className="form-group">
              <label>
                <FiLock /> رمز عبور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                placeholder="حداقل 8 کاراکتر"
              />
            </div>

            <div className="form-group">
              <label>
                <FiLock /> تکرار رمز عبور
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="تکرار رمز عبور"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? <div className="loading"></div> : "ثبت‌نام"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">وارد شوید</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
