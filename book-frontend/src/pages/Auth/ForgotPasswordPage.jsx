import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { FiUser, FiMail, FiLock, FiKey } from "react-icons/fi";
import "./AuthPages.css";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    contact: "",
    code: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/password-reset/request/", {
        username: formData.username,
        contact: formData.contact,
      });

      toast.success(response.data.message || "کد تأیید ارسال شد");

      // نمایش کد برای تست (در محیط تولید این خط حذف شود)
      if (response.data.code_for_testing) {
        toast.info(`کد شما (برای تست): ${response.data.code_for_testing}`);
      }

      setStep(2); // رفتن به مرحله بعدی
    } catch (error) {
      console.error("Password reset request error:", error.response?.data);
      toast.error(error.response?.data?.detail || "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/password-reset/confirm/", {
        contact: formData.contact,
        code: formData.code,
        new_password: formData.new_password,
      });

      toast.success("رمز عبور با موفقیت تغییر کرد");
      window.location.href = "/login";
    } catch (error) {
      console.error("Password reset confirm error:", error.response?.data);
      toast.error(
        error.response?.data?.detail || "کد نامعتبر یا رمز عبور ضعیف است",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>بازیابی رمز عبور</h1>
            <p>
              {step === 1
                ? "اطلاعات خود را وارد کنید"
                : "کد دریافتی و رمز جدید را وارد کنید"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="auth-form">
              <div className="form-group">
                <label>
                  <FiUser /> نام کاربری
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="نام کاربری خود را وارد کنید"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiMail /> ایمیل یا شماره موبایل
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="example@email.com یا 09xxxxxxxxx"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? <div className="loading"></div> : "دریافت کد"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label>
                  <FiKey /> کد تأیید
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="کد دریافتی را وارد کنید"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiLock /> رمز عبور جدید
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="رمز عبور جدید"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? <div className="loading"></div> : "تغییر رمز عبور"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <Link to="/login">بازگشت به صفحه ورود</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
