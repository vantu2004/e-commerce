import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

/**
 * Beautiful, responsive, and accessible Navbar
 * - TailwindCSS for styling
 * - Framer Motion for animations
 * - lucide-react for icons
 * - react-router-dom for routing (NavLink highlights active routes)
 *
 * Props (optional):
 *   user?: boolean | object  // truthy means logged in
 *   isAdmin?: boolean
 *   cartCount?: number
 *   onLogout?: () => void
 */
export default function Navbar() {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "ADMIN";

  const cartCount = 2;

  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const navLinkActive =
    "text-emerald-300 bg-emerald-800/30 ring-1 ring-emerald-700/40";
  const navLinkInactive = "text-gray-300 hover:text-emerald-300";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-gray-900/70 border-b border-emerald-700/30 shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              E‑Commerce
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              Home
            </NavLink>

            {user && (
              <Link
                to="/cart"
                className={`${navLinkBase} ${navLinkInactive} relative flex items-center gap-2`}
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 grid place-items-center rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            )}

            {isAdmin && (
              <NavLink
                to="/secret-dashboard"
                className={({ isActive }) =>
                  `${navLinkBase} flex items-center gap-2 bg-emerald-700/90 hover:bg-emerald-600 text-white shadow-sm ${
                    isActive ? "ring-1 ring-emerald-400" : ""
                  }`
                }
              >
                <Lock size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>
            )}

            {/* Auth area (desktop) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                  className="flex items-center gap-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 px-3 py-1.5 transition"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="size-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 grid place-items-center text-gray-900">
                    <User2 size={16} />
                  </div>
                  <ChevronDown size={16} className="opacity-80" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                      role="menu"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5"
                        role="menuitem"
                      >
                        <User2 size={16} /> Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/secret-dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5"
                          role="menuitem"
                        >
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-300 hover:bg-rose-500/10"
                        role="menuitem"
                        onClick={logout}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 transition"
                >
                  <UserPlus size={16} />{" "}
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 transition"
                >
                  <LogIn size={16} />{" "}
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            onClick={() => setOpen((v) => !v)}
            aria-controls="mobile-menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-gray-900/90 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-2">
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block ${navLinkBase} ${
                    isActive ? navLinkActive : navLinkInactive
                  }`
                }
              >
                Home
              </NavLink>

              {user && (
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className={`block ${navLinkBase} ${navLinkInactive} flex items-center gap-2`}
                >
                  <ShoppingCart size={18} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAdmin && (
                <NavLink
                  to="/secret-dashboard"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block ${navLinkBase} ${
                      isActive ? navLinkActive : navLinkInactive
                    } flex items-center gap-2`
                  }
                >
                  <Lock size={16} /> Dashboard
                </NavLink>
              )}

              {!user ? (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2"
                  >
                    <UserPlus size={16} /> Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white px-4 py-2"
                  >
                    <LogIn size={16} /> Login
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white px-4 py-2"
                >
                  <LogOut size={16} /> Log Out
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
