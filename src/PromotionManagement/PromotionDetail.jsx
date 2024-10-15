import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useParams và useNavigate
import { fetchPromotionDetail } from "./PromotionAPI"; // Import API để lấy chi tiết khuyến mãi
import "./PromotionDetail.css";

function PromotionDetail() {
  const { proID } = useParams(); // Lấy proID từ URL
  const navigate = useNavigate(); // Điều hướng giữa các trang
  const [formData, setFormData] = useState({});
  console.log("proID nhận từ URL:", proID);

  useEffect(() => {
    // Gọi API để lấy dữ liệu khuyến mãi theo proID
    fetchPromotionDetail(proID)
      .then((response) => {
        console.log("Fetched promotion data:", response.data); // In ra dữ liệu nhận được từ API
        setFormData(response.data); // Cập nhật dữ liệu vào form
      })
      .catch((error) => {
        console.error("Error fetching promotion details:", error);
      });
  }, [proID]); // Chỉ chạy lại khi proID thay đổi

  const goToPromotionManagement = () => {
    navigate("/promotion-management"); // Điều hướng về trang Promotion Management
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
      <div className="add-promotion-container">
        <form className="add-promotion-form">
          <div className="form-left">
            <div className="form-group">
              <label>Promotion Name</label>
              <input
                type="text"
                name="proName"
                value={formData.proName}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Promotion Code</label>
              <input
                type="text"
                name="proCode"
                value={formData.proCode}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                readOnly
              />
            </div>
          </div>

          <div className="form-center">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                readOnly
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={goToPromotionManagement}>
              Back
            </button>
          </div>
        </form>
      </div>

      <div className="titlemanagement">
        <div> Promotion Management - View Promotion Detail </div>
      </div>
      <div className="copyright">
        <div>© Copyright {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
}

export default PromotionDetail;
