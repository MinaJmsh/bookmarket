import React from "react";
import { FiAlertCircle, FiCheckCircle, FiShield } from "react-icons/fi";
import "./InfoPages.css";

const TermsPage = () => {
  return (
    <div className="info-page">
      <div className="container">
        <div className="page-header">
          <h1>قوانین و مقررات</h1>
          <p>شرایط استفاده از کتاب‌مارکت</p>
        </div>

        <div className="info-content">
          <div className="alert alert-warning">
            <FiAlertCircle />
            <span>
              لطفاً قبل از استفاده از خدمات کتاب‌مارکت، قوانین زیر را با دقت
              مطالعه کنید.
            </span>
          </div>

          <section className="terms-section">
            <h2>۱. پذیرش قوانین</h2>
            <p>
              با ثبت‌نام و استفاده از خدمات کتاب‌مارکت، شما تمامی قوانین و
              مقررات این پلتفرم را می‌پذیرید. در صورت عدم موافقت با هر یک از
              شرایط، لطفاً از خدمات استفاده نکنید.
            </p>
          </section>

          <section className="terms-section">
            <h2>۲. حساب کاربری</h2>
            <ul className="terms-list">
              <li>اطلاعات ثبت‌نام باید صحیح و کامل باشد</li>
              <li>هر فرد تنها مجاز به ایجاد یک حساب کاربری است</li>
              <li>رمز عبور خود را محرمانه نگه دارید</li>
              <li>
                مسئولیت تمام فعالیت‌های انجام شده از حساب شما بر عهده شماست
              </li>
              <li>در صورت مشاهده فعالیت مشکوک، بلافاصله به ما اطلاع دهید</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۳. قوانین فروش</h2>
            <h3>۳.۱. محتوای مجاز</h3>
            <ul className="terms-list">
              <li>فقط کتاب‌های قانونی و دارای مجوز قابل فروش هستند</li>
              <li>فروش کتاب‌های کپی‌رایت شده یا غیرقانونی ممنوع است</li>
              <li>کتاب‌های با محتوای نامناسب یا خلاف قوانین حذف می‌شوند</li>
            </ul>

            <h3>۳.۲. قیمت‌گذاری</h3>
            <ul className="terms-list">
              <li>قیمت‌گذاری باید منصفانه و مطابق با وضعیت کتاب باشد</li>
              <li>قیمت‌های غیرمنطقب یا کلاهبرداری ممنوع است</li>
              <li>پس از تأیید، قیمت نباید به صورت غیرمعقول تغییر کند</li>
            </ul>

            <h3>۳.۳. توضیحات و تصاویر</h3>
            <ul className="terms-list">
              <li>توضیحات باید کامل، دقیق و صادقانه باشد</li>
              <li>تصاویر باید واقعی و مربوط به خود کتاب باشد</li>
              <li>اطلاعات گمراه‌کننده ممنوع است</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۴. قوانین خرید</h2>
            <ul className="terms-list">
              <li>
                خریدار موظف است قبل از خرید، اطلاعات کتاب را با دقت بررسی کند
              </li>
              <li>
                پس از خرید و پرداخت، لغو سفارش تنها با موافقت فروشنده امکان‌پذیر
                است
              </li>
              <li>خریدار باید در زمان مقرر، کتاب را تحویل بگیرد</li>
              <li>در صورت بروز مشکل، باید از طریق تیکت پشتیبانی اقدام شود</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۵. پرداخت و تراکنش‌های مالی</h2>
            <ul className="terms-list">
              <li>تمام پرداخت‌ها از طریق درگاه‌های معتبر بانکی انجام می‌شود</li>
              <li>کتاب‌مارکت مسئولیتی در قبال مشکلات درگاه بانکی ندارد</li>
              <li>
                استرداد وجه تنها در موارد خاص و با تأیید مدیریت امکان‌پذیر است
              </li>
              <li>کاربران باید اطلاعات پرداخت خود را محرمانه نگه دارند</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۶. تحویل و انتقال</h2>
            <ul className="terms-list">
              <li>تحویل کتاب به صورت حضوری و با هماهنگی طرفین انجام می‌شود</li>
              <li>کتاب‌مارکت واسط معرفی است و مسئولیتی در قبال تحویل ندارد</li>
              <li>توصیه می‌شود تحویل در مکان‌های عمومی و امن انجام شود</li>
              <li>مسئولیت بررسی کتاب در زمان تحویل بر عهده خریدار است</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۷. حریم خصوصی</h2>
            <ul className="terms-list">
              <li>اطلاعات شخصی کاربران محفوظ و محرمانه نگهداری می‌شود</li>
              <li>
                اطلاعات تماس تنها بین خریدار و فروشنده به اشتراک گذاشته می‌شود
              </li>
              <li>کتاب‌مارکت حق دارد داده‌های آماری غیرشخصی را استفاده کند</li>
              <li>اطلاعات کاربران بدون اجازه به شخص ثالث داده نمی‌شود</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۸. رفتارهای ممنوع</h2>
            <div className="prohibited-list">
              <div className="prohibited-item">
                <FiAlertCircle className="icon-warning" />
                <div>
                  <h4>کلاهبرداری و فریب</h4>
                  <p>
                    هرگونه فعالیت کلاهبرداری منجر به مسدودی دائمی حساب می‌شود
                  </p>
                </div>
              </div>

              <div className="prohibited-item">
                <FiAlertCircle className="icon-warning" />
                <div>
                  <h4>هرزنامه و تبلیغات</h4>
                  <p>ارسال پیام‌های تبلیغاتی یا هرزنامه به کاربران ممنوع است</p>
                </div>
              </div>

              <div className="prohibited-item">
                <FiAlertCircle className="icon-warning" />
                <div>
                  <h4>سوءاستفاده از سیستم</h4>
                  <p>ایجاد حساب‌های متعدد یا سوءاستفاده از امکانات ممنوع است</p>
                </div>
              </div>

              <div className="prohibited-item">
                <FiAlertCircle className="icon-warning" />
                <div>
                  <h4>محتوای نامناسب</h4>
                  <p>
                    انتشار محتوای توهین‌آمیز، تهدیدآمیز یا نامناسب ممنوع است
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="terms-section">
            <h2>۹. مسئولیت‌ها</h2>
            <ul className="terms-list">
              <li>
                کتاب‌مارکت صرفاً یک پلتفرم واسط است و مسئولیت معاملات با کاربران
                است
              </li>
              <li>
                ما مسئولیتی در قبال کیفیت، صحت یا قانونی بودن کتاب‌ها نداریم
              </li>
              <li>اختلافات باید بین خریدار و فروشنده حل شود</li>
              <li>
                در صورت تخلف، کتاب‌مارکت حق حذف محتوا یا مسدودی حساب را دارد
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>۱۰. تغییرات قوانین</h2>
            <p>
              کتاب‌مارکت حق دارد این قوانین را در هر زمان تغییر دهد. تغییرات در
              همین صفحه منتشر می‌شود و استفاده مستمر از خدمات به معنای پذیرش
              قوانین جدید است.
            </p>
          </section>

          <section className="terms-section">
            <h2>۱۱. قانون حاکم</h2>
            <p>
              این قوانین تابع قوانین جمهوری اسلامی ایران است و هرگونه اختلاف در
              صلاحیت محاکم قضایی ایران حل و فصل خواهد شد.
            </p>
          </section>

          <div className="alert alert-success">
            <FiCheckCircle />
            <span>
              با رعایت این قوانین، به ایجاد یک جامعه سالم و امن کمک کنید.
            </span>
          </div>

          <section className="contact-section">
            <h2>تماس با ما</h2>
            <p>
              در صورت هرگونه سوال یا ابهام درباره قوانین، از طریق{" "}
              <a href="/support">پشتیبانی</a> با ما در تماس باشید.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
