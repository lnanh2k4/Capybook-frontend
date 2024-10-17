import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { updateCategory, fetchCategoryDetail } from "./CategoryAPI";
import "./EditCategory.css";

const EditCategory = () => {
  const { catID } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ID: "",
    CategoryName: "",
    ParentCategory: "",
    Status: "",
  });

  useEffect(() => {
    fetchCategoryDetail(catID)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching category details:", error);
      });
  }, [catID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCategory(catID, formData)
      .then(() => {
        navigate("/category-management");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  const handleCancel = () => {
    navigate("/category-management");
  };
  const goToCategoryManagement = () => {
    navigate("/dashboard/books");
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
          <div className="dashboard-item">
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
          <div className="dashboard-item" onClick={goToCategoryManagement}>
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

      <div className="edit-category-container">
        <form className="edit-category-form" onSubmit={handleSubmit}>
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
                placeholder="Enter Parent Category"
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
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="titlemanagement">
        <div>Edit Category </div>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default EditCategory;
