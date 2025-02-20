import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [quantities, setQuantities] = useState({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(`Error fetching products: ${err.message}`);
      });
  }, [token, navigate]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.ProductID] || 1;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((item) => item.ProductID === product.ProductID);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage(`Added ${quantity} of ${product.ProductName} to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const filteredProducts = products.filter((product) =>
    product.ProductID.toString().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Products</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {message && <div className="alert alert-success text-center">{message}</div>}

      <div className="mb-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-75"
          placeholder="Search by Product ID"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="btn btn-warning ms-2" onClick={() => navigate("/cart")}>
          🛒 Go to Cart
        </button>
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div className="col-md-4 mb-4" key={p.ProductID}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{p.ProductName}</h5>
                  <p className="card-text">Price: ${p.Price}</p>
                  <div className="d-flex align-items-center">
                    <input
                      type="number"
                      min="1"
                      className="form-control w-25 me-2"
                      value={quantities[p.ProductID] || 1}
                      onChange={(e) => handleQuantityChange(p.ProductID, e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-warning text-center">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
