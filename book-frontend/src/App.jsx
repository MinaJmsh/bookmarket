import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Homepage";
import BooksPage from "./pages/Bookspage";
import BookDetailPage from "./pages/BookDetailPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";

import ProfilePage from "./pages/User/ProfilePage";
import MyOrdersPage from "./pages/User/MyOrdersPage";
import FavoritesPage from "./pages/User/FavoritesPage";
import NotificationsPage from "./pages/User/NotificationsPage";
import SupportPage from "./pages/User/SupportPage";

import SellerInventoryPage from "./pages/Seller/SellerInventoryPage";
import AddBookPage from "./pages/Seller/AddBookPage";
import EditBookPage from "./pages/Seller/EditBookPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminBooksPage from "./pages/Admin/AdminBooksPage";
import AdminSupportPage from "./pages/Admin/AdminSupportPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";

import BuyingGuidePage from "./pages/Info/BuyingGuidePage";
import SellingGuidePage from "./pages/Info/SellingGuidePage";
import TermsPage from "./pages/Info/TermsPage";
import FAQPage from "./pages/Info/FAQPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <SupportPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/seller/inventory"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerInventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/add-book"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <AddBookPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/edit-book/:id"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <EditBookPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminBooksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSupportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminCategoriesPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
              {/* 
              <Route
                path="/payment/:orderId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/success/:orderId"
                element={
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/failed/:orderId"
                element={
                  <ProtectedRoute>
                    <PaymentFailedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                }
              /> */}

              {/* Info Pages */}
              <Route path="/guide/buying" element={<BuyingGuidePage />} />
              <Route path="/guide/selling" element={<SellingGuidePage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-left"
            autoClose={3000}
            rtl={true}
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
