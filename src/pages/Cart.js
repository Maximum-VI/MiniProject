import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    updateCart(updatedCart);
  };

  const handleRemoveAll = () => {
    // Clear the cart
    updateCart([]);
    localStorage.removeItem("cart");
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + Number(item.Price) * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-warning text-center">Your cart is empty.</div>
      ) : (
        <ul className="list-group">
          {cart.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column">
                <span><strong>{item.ProductName}</strong></span>
                <span>Price: ${Number(item.Price).toFixed(2)}</span>
                <div className="d-flex align-items-center mt-2">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                  >
                    ➖
                  </button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                  >
                    ➕
                  </button>
                </div>
                <span className="mt-2"><strong>Total:</strong> ${(Number(item.Price) * item.quantity).toFixed(2)}</span>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleRemoveFromCart(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="text-center mt-4">
          <h4>Total Price: ${calculateTotal()}</h4>
          <button className="btn btn-secondary me-2" onClick={() => navigate("/products")}>
            ⬅️ Continue Shopping
          </button>
          <button className="btn btn-success me-2" onClick={() => navigate("/payment")}>
            Proceed to Payment
          </button>
          <button className="btn btn-danger me-2" onClick={handleRemoveAll}>
            Remove All
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
