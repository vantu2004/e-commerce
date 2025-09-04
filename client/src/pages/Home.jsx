import React from "react";
import { useAuth } from "../context/UseAuth";

export default function Home() {
  const { user } = useAuth();
  console.log("home");

  console.log(user);
  return (
    <div>
      <h1>Trang chủ</h1>
      {user ? (
        <p>
          Xin chào, <b>{user.email}</b>!
        </p>
      ) : (
        <p>
          Chào mừng bạn đến với trang chủ. Vui lòng đăng nhập để sử dụng đầy đủ
          chức năng.
        </p>
      )}
    </div>
  );
}
