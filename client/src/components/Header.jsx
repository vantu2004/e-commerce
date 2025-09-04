import React from "react";
import { useAuth } from "../context/UseAuth";

export default function Header() {
  const { user, logout } = useAuth();

  console.log("header");
  console.log(user);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header>
      <div>
        {user ? (
          <div style={{ position: "relative" }}>
            <span
              style={{
                cursor: "pointer",
                backgroundColor: "lightgray",
                padding: "5px",
                borderRadius: "5px",
              }}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {user.fullName}
            </span>
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  zIndex: 10,
                }}
              >
                <button onClick={() => (window.location.href = "/profile")}>
                  Profile
                </button>
                <button onClick={() => (window.location.href = "/orders")}>
                  Đơn hàng của tôi
                </button>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login">Đăng nhập</a>
        )}
      </div>
    </header>
  );
}
