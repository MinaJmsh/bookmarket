import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import "./AuthPages.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        toast.success("خوش آمدید!");
        navigate("/");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("خطا در ورود به سیستم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>ورود به حساب کاربری</h1>
            <p>به کتاب‌مارکت خوش آمدید</p>
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
                placeholder="نام کاربری خود را وارد کنید"
              />
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
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>

            <Link to="/forgot-password" className="forgot-link">
              فراموشی رمز عبور
            </Link>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <div className="loading"></div>
              ) : (
                <>
                  <FiLogIn /> ورود
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              حساب کاربری ندارید؟ <Link to="/register">ثبت‌نام کنید</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
