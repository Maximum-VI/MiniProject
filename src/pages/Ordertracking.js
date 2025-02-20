import React, { useEffect, useState } from "react";

function OrderTracking() {
  const [trackedOrders, setTrackedOrders] = useState([]);

  useEffect(() => {
    // Retrieve confirmed orders from localStorage
    const savedTrackingOrders = JSON.parse(localStorage.getItem("orderTracking")) || [];
    setTrackedOrders(savedTrackingOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    // Update order status in state
    const updatedOrders = trackedOrders.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setTrackedOrders(updatedOrders);

    // Save updated orders in localStorage
    localStorage.setItem("orderTracking", JSON.stringify(updatedOrders));
  };

  if (trackedOrders.length === 0) {
    return <div className="alert alert-warning text-center mt-5">No confirmed orders found!</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🚚 Order Tracking</h2>

      <div className="row">
        {trackedOrders.map((order, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card shadow-sm border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Order ID: {order.orderId}</h5>
              </div>
              <div className="card-body">
                <p><strong>Confirmed Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
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

                {/* Status Dropdown */}
                <div className="mt-3">
                  <label><strong>Status:</strong></label>
                  <select 
                    className="form-select mt-1"
                    value={order.status || "Processing"}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  >
                    <option value="Processing">🟡 Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTracking;
