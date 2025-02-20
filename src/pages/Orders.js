import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Order() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const handleConfirmOrder = (order) => {
    let confirmedOrders = JSON.parse(localStorage.getItem("orderTracking")) || [];
    confirmedOrders.push(order);
    localStorage.setItem("orderTracking", JSON.stringify(confirmedOrders));

    // Remove confirmed order from orders list
    const updatedOrders = orders.filter((o) => o.orderId !== order.orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Redirect to Order Tracking
    navigate("/order-tracking");
  };

  if (orders.length === 0) {
    return <div className="alert alert-danger text-center mt-5">No orders found!</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📦 Your Orders</h2>

      <div className="row">
        {orders.map((order, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card shadow-sm border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order ID: {order.orderId}</h5>
              </div>
              <div className="card-body">
                <p><strong>Order Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${Number(order.total).toFixed(2)}</p>

                <h6 className="mt-3">🛒 Items:</h6>
                <ul className="list-group">
                  {order.cart.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      {item.ProductName} x{item.quantity}
                      <span className="badge bg-secondary">${(Number(item.Price) * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                {/* Confirm Order Button */}
                <button
                  className="btn btn-success mt-3 w-100"
                  onClick={() => handleConfirmOrder(order)}
                >
                  ✅ Confirm Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
