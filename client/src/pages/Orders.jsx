import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UseAuth";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/api/orders/mine", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch(() => setOrders([]));
    }
  }, [user]);

  if (!user) return <p>Bạn cần đăng nhập để xem đơn hàng của mình.</p>;

  return (
    <div>
      <h2>Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              Mã đơn: {order._id} - Tổng tiền: {order.total} - Ngày:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
