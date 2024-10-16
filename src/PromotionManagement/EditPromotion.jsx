import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updatePromotion, fetchPromotionDetail } from "./PromotionAPI"; // Import API
import "./EditPromotion.css"; // Import CSS
import DashboardContainer from "../DashBoardContainer.jsx";
const EditPromotion = () => {
  const { proID } = useParams(); // Lấy proID từ URL
  const navigate = useNavigate(); // Sử dụng để điều hướng
  const [formData, setFormData] = useState({
    proName: "",
    proCode: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Lấy dữ liệu khuyến mãi chi tiết theo proID
    fetchPromotionDetail(proID)
      .then((response) => {
        setFormData(response.data); // Đưa dữ liệu vào form
      })
      .catch((error) => {
        console.error("Error fetching promotion details:", error);
      });
  }, [proID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API để cập nhật thông tin khuyến mãi
    updatePromotion(proID, formData)
      .then(() => {
        navigate("/promotion-management"); // Điều hướng về Promotion Management sau khi cập nhật
      })
      .catch((error) => {
        console.error("Error updating promotion:", error);
      });
  };

  const handleCancel = () => {
    navigate("/promotion-management"); // Điều hướng về Promotion Management khi cancel
  };

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="add-promotion-container">
        <form className="add-promotion-form">
          <div className="form-left">
            <div className="form-group">
              <label>Promotion Name</label>
              <input
                type="text"
                name="proName"
                value={formData.proName}
                onChange={handleChange}
                placeholder="Enter Promotion Name"
              />
            </div>
            <div className="form-group">
              <label>Promotion Code</label>
              <input
                type="text"
                name="proCode"
                value={formData.proCode}
                onChange={handleChange}
                placeholder="Enter Promotion Code"
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Enter Discount"
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
            <button type="submit" onClick={handleSubmit}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="titlemanagement">
        <div> Promotion Management - Edit Promotion </div>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default EditPromotion;
