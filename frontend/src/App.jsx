import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { fetchCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // phải đợi checkAuth xong mới load tiếp
    if (!checkingAuth && user) {
      fetchCartItems();
    }
  }, [checkingAuth, user, fetchCartItems]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden z-9 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/secret-dashboard"
            element={
              user && user.role === "ADMIN" ? (
                <AdminPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/category/:category" element={<CategoryPage />} />

          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/purchase-success"
            element={
              checkingAuth ? <LoadingSpinner /> : <PurchaseSuccessPage />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
