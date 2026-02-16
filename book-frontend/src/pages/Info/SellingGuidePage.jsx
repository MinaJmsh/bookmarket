import React from "react";
import { Link } from "react-router-dom";
import { FiUpload, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import "./InfoPages.css";

const SellingGuidePage = () => {
  return (
    <div className="info-page">
      <div className="container">
        <div className="page-header">
          <h1>راهنمای فروش</h1>
          <p>مراحل فروش کتاب در کتاب‌مارکت</p>
        </div>

        <div className="info-content">
          <section className="guide-section">
            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">1</span>
              </div>
              <div className="step-content">
                <h2>ثبت‌نام به عنوان فروشنده</h2>
                <p>
                  ابتدا باید <Link to="/register">ثبت‌نام</Link> کنید. در صورتی
                  که قبلاً ثبت‌نام کرده‌اید، می‌توانید از طریق پنل کاربری نقش
                  خود را به فروشنده تغییر دهید.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">2</span>
              </div>
              <div className="step-content">
                <h2>افزودن کتاب</h2>
                <p>
                  از منوی <Link to="/seller/add-book">افزودن کتاب</Link> در پنل
                  فروشنده استفاده کنید. اطلاعات زیر را با دقت وارد کنید:
                </p>
                <ul>
                  <li>عنوان و نام نویسنده کتاب</li>
                  <li>دسته‌بندی مناسب</li>
                  <li>قیمت واقعی و منصفانه</li>
                  <li>وضعیت کتاب (نو یا دست دوم)</li>
                  <li>توضیحات کامل درباره کتاب</li>
                  <li>تصویر واضح از کتاب</li>
                </ul>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">3</span>
              </div>
              <div className="step-content">
                <h2>تأیید کتاب توسط مدیر</h2>
                <p>
                  بعد از ثبت، کتاب شما توسط تیم مدیریت بررسی می‌شود. این فرآیند
                  معمولاً 24 ساعت زمان می‌برد.
                </p>
                <div className="alert alert-info">
                  <FiCheckCircle />
                  <span>
                    از صفحه <Link to="/seller/inventory">انبار من</Link>{" "}
                    می‌توانید وضعیت کتاب‌های خود را پیگیری کنید
                  </span>
                </div>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">4</span>
              </div>
              <div className="step-content">
                <h2>دریافت سفارش</h2>
                <p>
                  وقتی کسی کتاب شما را خریداری کرد، از طریق اعلان مطلع می‌شوید.
                  اطلاعات خریدار برای هماهنگی تحویل در اختیار شما قرار می‌گیرد.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">5</span>
              </div>
              <div className="step-content">
                <h2>تحویل کتاب</h2>
                <p>
                  با خریدار هماهنگ کنید و کتاب را تحویل دهید. توصیه می‌کنیم
                  تحویل را در مکان‌های عمومی و امن انجام دهید.
                </p>
              </div>
            </div>
          </section>

          <section className="tips-section">
            <h2>نکات فروش موفق</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <FiUpload />
                <h3>تصویر باکیفیت</h3>
                <p>
                  از تصاویر واضح و روشن استفاده کنید تا خریداران بهتر کتاب را
                  ببینند
                </p>
              </div>

              <div className="tip-card">
                <FiDollarSign />
                <h3>قیمت‌گذاری منصفانه</h3>
                <p>قیمت واقعی و مناسب با وضعیت کتاب تعیین کنید</p>
              </div>

              <div className="tip-card">
                <FiCheckCircle />
                <h3>توضیحات کامل</h3>
                <p>تمام جزئیات و وضعیت کتاب را به صراحت ذکر کنید</p>
              </div>
            </div>
          </section>

          <section className="pricing-guide">
            <h2>راهنمای قیمت‌گذاری</h2>
            <div className="pricing-table">
              <div className="pricing-row">
                <span className="condition">کتاب نو (بدون استفاده)</span>
                <span className="percentage">70-90% قیمت اصلی</span>
              </div>
              <div className="pricing-row">
                <span className="condition">کتاب کمی استفاده شده</span>
                <span className="percentage">50-70% قیمت اصلی</span>
              </div>
              <div className="pricing-row">
                <span className="condition">کتاب استفاده شده معمولی</span>
                <span className="percentage">30-50% قیمت اصلی</span>
              </div>
              <div className="pricing-row">
                <span className="condition">کتاب قدیمی یا فرسوده</span>
                <span className="percentage">10-30% قیمت اصلی</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SellingGuidePage;
