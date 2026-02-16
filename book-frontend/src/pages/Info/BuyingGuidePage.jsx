import React from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "./InfoPages.css";

const BuyingGuidePage = () => {
  return (
    <div className="info-page">
      <div className="container">
        <div className="page-header">
          <h1>راهنمای خرید</h1>
          <p>مراحل خرید کتاب از کتاب‌مارکت</p>
        </div>

        <div className="info-content">
          <section className="guide-section">
            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">1</span>
              </div>
              <div className="step-content">
                <h2>جستجو و یافتن کتاب</h2>
                <p>
                  از صفحه <Link to="/books">کتاب‌ها</Link> شروع کنید و با
                  استفاده از فیلترها کتاب مورد نظر خود را پیدا کنید. می‌توانید
                  بر اساس دسته‌بندی، نویسنده، قیمت و وضعیت کتاب جستجو کنید.
                </p>
                <ul>
                  <li>استفاده از نوار جستجو برای یافتن سریع کتاب</li>
                  <li>فیلتر کردن بر اساس قیمت و وضعیت</li>
                  <li>مرتب‌سازی نتایج بر اساس جدیدترین یا ارزان‌ترین</li>
                </ul>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">2</span>
              </div>
              <div className="step-content">
                <h2>بررسی جزئیات کتاب</h2>
                <p>
                  روی کتاب مورد نظر کلیک کنید تا جزئیات کامل آن را مشاهده کنید:
                </p>
                <ul>
                  <li>عنوان، نویسنده و توضیحات کامل کتاب</li>
                  <li>قیمت و وضعیت (نو یا دست دوم)</li>
                  <li>اطلاعات فروشنده و راه‌های تماس</li>
                  <li>تصاویر کتاب</li>
                </ul>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">3</span>
              </div>
              <div className="step-content">
                <h2>ثبت سفارش</h2>
                <p>
                  بعد از اطمینان از انتخاب خود، روی دکمه "خرید کتاب" کلیک کنید.
                  اگر حساب کاربری ندارید، ابتدا باید{" "}
                  <Link to="/register">ثبت‌نام</Link> کنید.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">4</span>
              </div>
              <div className="step-content">
                <h2>پرداخت آنلاین</h2>
                <p>
                  به صفحه پرداخت منتقل می‌شوید. روش پرداخت خود را انتخاب کنید:
                </p>
                <ul>
                  <li>پرداخت آنلاین با کلیه کارت‌های بانکی</li>
                  <li>پرداخت از کیف پول (در صورت وجود موجودی)</li>
                </ul>
                <div className="alert alert-success">
                  <FiCheckCircle />
                  <span>
                    تمام تراکنش‌ها از طریق درگاه امن بانکی انجام می‌شود
                  </span>
                </div>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-icon">
                <span className="step-number">5</span>
              </div>
              <div className="step-content">
                <h2>تأیید و پیگیری سفارش</h2>
                <p>
                  پس از پرداخت موفق، کد پیگیری برای شما ارسال می‌شود. می‌توانید
                  از بخش <Link to="/my-orders">سفارشات من</Link> وضعیت سفارش خود
                  را پیگیری کنید.
                </p>
              </div>
            </div>
          </section>

          <section className="tips-section">
            <h2>نکات مهم</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <FiAlertCircle />
                <h3>بررسی اطلاعات</h3>
                <p>
                  قبل از خرید، اطلاعات فروشنده و توضیحات کتاب را به دقت بررسی
                  کنید
                </p>
              </div>

              <div className="tip-card">
                <FiCheckCircle />
                <h3>حفظ کد پیگیری</h3>
                <p>کد پیگیری سفارش خود را یادداشت کنید یا اسکرین‌شات بگیرید</p>
              </div>

              <div className="tip-card">
                <FiShoppingCart />
                <h3>تحویل کتاب</h3>
                <p>
                  با فروشنده هماهنگ کنید و کتاب را به صورت حضوری تحویل بگیرید
                </p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2>سوالات متداول</h2>

            <div className="faq-item">
              <h3>آیا می‌توانم سفارش خود را لغو کنم؟</h3>
              <p>
                بله، قبل از تحویل کتاب می‌توانید با پشتیبانی تماس بگیرید و
                درخواست لغو سفارش دهید.
              </p>
            </div>

            <div className="faq-item">
              <h3>اگر کتاب مشکل داشت چه کنم؟</h3>
              <p>
                در صورت وجود هرگونه مشکل، از بخش{" "}
                <Link to="/support">پشتیبانی</Link> تیکت ارسال کنید.
              </p>
            </div>

            <div className="faq-item">
              <h3>چگونه با فروشنده تماس بگیرم؟</h3>
              <p>
                اطلاعات تماس فروشنده (شماره موبایل) در صفحه جزئیات کتاب نمایش
                داده می‌شود.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BuyingGuidePage;
