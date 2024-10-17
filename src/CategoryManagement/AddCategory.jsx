import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { addCategory as addCategoryFunc } from './CategoryAPI'; // Renamed imported function
import "./AddCategory.css";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    ID: "",
    CategoryName: "",
    ParentCategory: "",
    Status: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategoryFunc(formData)
      .then(() => {
        console.log("Category added successfully!");
        navigate("/category-management");
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  const handleReset = () => {
    setFormData({
      ID: "",
      CategoryName: "",
      ParentCategory: "",
      Status: "",
    });
  };

  const goToCategoryManagement = () => {
    navigate("/category-management");
  };

  return (
    <div className="main-container">
      <div className="dashboard-container-alt">
        <div className="logo-container">
          <img
            src="/logo-capybook.png"
            alt="Cabybook Logo"
            className="logo-image"
          />
        </div>
        <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <i className="fas fa-book dashboard-icon"></i>
            <p>Account Management</p>
          </div>
          <div className="dashboard-item" onClick={goToCategoryManagement}>
            <i className="fas fa-user dashboard-icon"></i>
            <p>Book Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Order Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Promotion Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Category Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Supplier Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Inventory Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Notification Management</p>
          </div>
        </div>
        <div className="leave-logo-container">
          <img src="/back_icon.png" className="leave-logo-image" />
        </div>
      </div>
      <div className="add-category-container">
        <form className="add-category-form" onSubmit={handleSubmit}>
          <div className="form-left">
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                name="ID"
                value={formData.ID}
                onChange={handleChange}
                placeholder="Enter Category ID"
              />
            </div>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                name="CategoryName"
                value={formData.CategoryName}
                onChange={handleChange}
                placeholder="Enter Category Name"
              />
            </div>
            <div className="form-group">
              <label>Parent Category</label>
              <input
                type="text"
                name="ParentCategory"
                value={formData.ParentCategory}
                onChange={handleChange}
                placeholder="Enter Parent Category ID"
              />
            </div>
          </div>

          <div className="form-center">
            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                placeholder="Enter Status"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="add" onClick={goToCategoryManagement}>
              Add
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="titlemanagement">
        <div> Add Category </div>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default AddCategory;
