import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Descriptions, message } from "antd"; // Import Ant Design components
import { fetchPromotionDetail } from "../config"; // Import API để lấy chi tiết khuyến mãi
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const PromotionDetail = () => {
  const { proID } = useParams(); // Lấy proID từ URL
  const navigate = useNavigate(); // Điều hướng giữa các trang
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Gọi API để lấy dữ liệu khuyến mãi theo proID
    fetchPromotionDetail(proID)
      .then((response) => {
        console.log("Fetched promotion data:", response.data); // In ra dữ liệu nhận được từ API
        setFormData(response.data); // Cập nhật dữ liệu vào form
      })
      .catch((error) => {
        console.error("Error fetching promotion details:", error);
        message.error("Failed to fetch promotion details");
      });
  }, [proID]); // Chỉ chạy lại khi proID thay đổi

  const goToPromotionManagement = () => {
    navigate("/dashboard/promotion-management"); // Điều hướng về trang Promotion Management
  };

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="dashboard-content">
        <Card
          title={`Promotion Detail - ${formData.proName || "N/A"}`}
          bordered={false}
          style={{ width: '100%', margin: 'auto', maxWidth: '800px' }}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Promotion ID">{formData.proID || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Promotion Name">{formData.proName || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Promotion Code">{formData.proCode || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{formData.startDate || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="End Date">{formData.endDate || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Discount">{formData.discount || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{formData.quantity || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Created By">{formData.createdBy?.username || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Approved By">{formData.approvedBy?.username || "N/A"}</Descriptions.Item>
          </Descriptions>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" onClick={goToPromotionManagement}>
              Back
            </Button>
          </div>
        </Card>
      </div>

      <div className="copyright">
        <div>© Copyright {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default PromotionDetail;
