import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + Number(item.Price) * item.quantity, 0).toFixed(2);
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvv || !name) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      setMessage("Invalid card number. Must be 16 digits.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setMessage("Invalid CVV. Must be 3 or 4 digits.");
      return;
    }

    setMessage("Payment successful! Redirecting...");
    setTimeout(() => {
      if (cart.length === 0) {
        setMessage("Cart is empty! Cannot place order.");
        return;
      }

      // Generate new order
      const orderTotal = calculateTotal();
      const newOrder = {
        orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
        cart: cart,
        total: orderTotal,
        timestamp: new Date().toISOString(),
      };

      // Retrieve previous orders or initialize an empty array
      const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];

      // Add new order to the orders array
      const updatedOrders = [...previousOrders, newOrder];

      // Save updated orders array to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      // Remove cart from localStorage after successful payment
      localStorage.removeItem("cart");

      // Navigate to the Order page
      navigate("/orders");
    }, 2000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">💳 Payment</h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      <form onSubmit={handlePayment} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Cardholder Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Card Number</label>
          <input
            type="text"
            className="form-control"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Expiry Date (MM/YY)</label>
          <input
            type="text"
            className="form-control"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">CVV</label>
          <input
            type="password"
            className="form-control"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength="4"
            required
          />
        </div>

        <div className="text-center mt-4">
          <h4>Cart Summary</h4>
          <div className="mb-3">
            {cart.map((item, index) => (
              <div key={index} className="d-flex justify-content-between">
                <span>{item.ProductName} x{item.quantity}</span>
                <span>${(Number(item.Price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <h5>Total: ${calculateTotal()}</h5>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Pay Now
        </button>
      </form>

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/cart")}>
          ⬅️ Back to Cart
        </button>
      </div>
    </div>
  );
}

export default Payment;
