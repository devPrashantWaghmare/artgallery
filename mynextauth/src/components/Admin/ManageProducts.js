import React, { useState, useEffect, useMemo } from "react";
import axios from "../../services/api";
import "../../styles/ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); // To store unique categories dynamically
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    image: "",
    description: "",
    type: "",
    liveClasses: 0,
    recordedDuration: "",
    price: "",
    instructor: "",
    startDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        // Extract unique categories (types) from the products
        const uniqueCategories = Array.from(
          new Set(response.data.map((product) => product.type))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isCategoryMatch =
        categoryFilter === "all" || product.type === categoryFilter;
      const isNameMatch =
        product.title &&
        product.title.toLowerCase().includes(searchTerm.toLowerCase());
      return isCategoryMatch && isNameMatch;
    });
  }, [products, categoryFilter, searchTerm]);

  const handleProductClick = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const fetchedProduct = await axios.get(
        `/api/admin/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedProduct(fetchedProduct.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleEdit = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
    setIsEditFormVisible(true);
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/products/${selectedProduct._id}`,
        selectedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id ? selectedProduct : product
        )
      );
      setIsEditFormVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((product) => product._id !== productId));
        if (selectedProduct && selectedProduct._id === productId)
          setSelectedProduct(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product");
      }
    }
  };

  const toggleAddForm = () => setShowAddForm(!showAddForm);

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/admin/products/addProduct",
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts((prev) => [...prev, response.data]);
      setNewProduct({
        title: "",
        image: "",
        description: "",
        type: "",
        liveClasses: 0,
        recordedDuration: "",
        price: "",
        instructor: "",
        startDate: "",
        expiryDate: "",
      });
      setShowAddForm(false);
      setSearchTerm("");
      setCategoryFilter("all");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product");
    }
  };

  if (loading)
    return <div className="loading-message">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      <button className="add-product-button" onClick={toggleAddForm}>
        {showAddForm ? "Cancel" : "Add New Product"}
      </button>
      <div className="product-filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleAddProduct}
        className={`add-product-form ${showAddForm ? "visible" : ""}`}
      >
        <h3>Add New Product</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newProduct.title}
          onChange={handleAddProductChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleAddProductChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleAddProductChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newProduct.type}
          onChange={handleAddProductChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleAddProductChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {isEditFormVisible && selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditFormVisible(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsEditFormVisible(false)}
            >
              ×
            </button>
            <h3>Edit Product</h3>
            <input
              type="text"
              name="title"
              value={selectedProduct.title}
              onChange={handleEditProductChange}
              required
            />
            <input
              type="text"
              name="image"
              value={selectedProduct.image}
              onChange={handleEditProductChange}
            />
            <textarea
              name="description"
              value={selectedProduct.description}
              onChange={handleEditProductChange}
            />
            <input
              type="text"
              name="type"
              value={selectedProduct.type}
              onChange={handleEditProductChange}
              required
            />
            <input
              type="number"
              name="price"
              value={selectedProduct.price}
              onChange={handleEditProductChange}
              required
            />
            <button onClick={handleSaveEdit}>Save Changes</button>
            <button onClick={() => setIsEditFormVisible(false)}>Cancel</button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Dimensions</th>
            <th>Is Framed</th>
            <th>Copies Available</th>
            <th>Is Digital Print</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {products.map((product) => (
    <tr key={product._id}>
      <td>{product.title}</td>
      <td>{product.type}</td>
      <td>{product.price}</td>
      <td>{product.dimensions}</td>
      <td>{product.isFramed ? "Yes" : "No"}</td>
      <td>{product.copiesAvailable}</td>
      <td>{product.isDigitalPrint ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleProductClick(product._id)}>
                  View
                </button>
                <button onClick={() => handleEdit(product._id)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
            <h3>{selectedProduct.name} Details</h3>
            <p>Category: {selectedProduct.category}</p>
            <p>Price: {selectedProduct.price}</p>
            <p>Instructor: {selectedProduct.instructor}</p>
            <p>Start Date: {selectedProduct.startDate}</p>
            <p>Expiry Date: {selectedProduct.expiryDate}</p>
            <p>Subscribers: {selectedProduct.subscribers?.length || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
