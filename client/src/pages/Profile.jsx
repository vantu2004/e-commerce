import React, { useState } from "react";
import { useAuth } from "../context/UseAuth";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gọi API cập nhật thông tin
    const res = await fetch("http://localhost:8080/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(user.token);
    if (res.ok) {
      setUser({ ...data, token: user.token });
      alert("Cập nhật thành công!");
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Họ tên"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="SDT"
      />
      <input
        name="avatar"
        value={form.avatar}
        onChange={handleChange}
        placeholder="Avatar URL"
      />
      <button type="submit">Lưu</button>
    </form>
  );
}
