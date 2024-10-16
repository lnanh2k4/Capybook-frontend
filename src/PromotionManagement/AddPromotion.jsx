import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import { addPromotion } from "./PromotionAPI"; // Import API addPromotion
import "./AddPromotion.css";
import DashboardContainer from "../DashBoardContainer.jsx";
const AddPromotion = () => {
  const [formData, setFormData] = useState({
    promotionName: "",
    promotionCode: "",
    quantity: "",
    discountQuantity: "",
    startDate: "",
    endDate: "",
  });

  // Khởi tạo useNavigate để điều hướng
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gọi API addPromotion khi submit form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của form
    addPromotion(formData)
      .then(() => {
        console.log("Promotion added successfully!");
        navigate("/promotion-management");
      })
      .catch((error) => {
        console.error("Error adding promotion:", error);
      });
  };

  const handleReset = () => {
    setFormData({
      promotionName: "",
      promotionCode: "",
      quantity: "",
      discountQuantity: "",
      startDate: "",
      endDate: "",
    });
  };

  const goToPromotionManagement = () => {
    navigate("/promotion-management"); // Điều hướng về Promotion Management
  };

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="add-promotion-container">
        <form className="add-promotion-form" onSubmit={handleSubmit}>
          <div className="form-left">
            <div className="form-group">
              <label>Promotion Name</label>
              <input
                type="text"
                name="promotionName"
                value={formData.promotionName}
                onChange={handleChange}
                placeholder="Enter Promotion Name"
              />
            </div>
            <div className="form-group">
              <label>Promotion Code</label>
              <input
                type="text"
                name="promotionCode"
                value={formData.promotionCode}
                onChange={handleChange}
                placeholder="Enter Promotion Code"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter Quantity"
              />
            </div>
          </div>

          <div className="form-center">
            <div className="form-group">
              <label>Discount Quantity</label>
              <input
                type="number"
                name="discountQuantity"
                value={formData.discountQuantity}
                onChange={handleChange}
                placeholder="Enter Discount Quantity"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" onClick={goToPromotionManagement}>
              Submit
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="titlemanagement">
        <div> Promotion Management - Add Promotion </div>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default AddPromotion;
