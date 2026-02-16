import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiMail,
  FiPhone,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FiBook className="footer-logo-icon" />
              <span>کتاب‌مارکت</span>
            </div>
            <p className="footer-description">
              پلتفرم خرید و فروش کتاب‌های دست دوم - صرفه‌جویی اقتصادی و دسترسی
              راحت‌تر به کتاب‌ها
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FiInstagram />
              </a>
              <a href="#" className="social-link">
                <FiTwitter />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>دسترسی سریع</h4>
            <ul className="footer-links">
              <li>
                <Link to="/books">کتاب‌ها</Link>
              </li>
              <li>
                <Link to="/register">ثبت‌نام</Link>
              </li>
              <li>
                <Link to="/login">ورود</Link>
              </li>
              <li>
                <Link to="/support">پشتیبانی</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>راهنما و پشتیبانی</h4>
            <ul className="footer-links">
              <li>
                <Link to="/guide/buying">راهنمای خرید</Link>
              </li>
              <li>
                <Link to="/guide/selling">راهنمای فروش</Link>
              </li>
              <li>
                <Link to="/terms">قوانین و مقررات</Link>
              </li>
              <li>
                <Link to="/faq">سوالات متداول</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>تماس با ما</h4>
            <ul className="footer-contact">
              <li>
                <FiMail />
                <span>support@bookmarket.ir</span>
              </li>
              <li>
                <FiPhone />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© ۱۴۰۴ کتاب‌مارکت. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
