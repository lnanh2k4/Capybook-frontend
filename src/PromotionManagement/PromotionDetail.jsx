import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Input, message } from "antd";
import { fetchPromotionDetail } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const PromotionDetail = () => {
  const { proID } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [createdByStaffID, setCreatedByStaffID] = useState("N/A");
  const [approvedByStaffID, setApprovedByStaffID] = useState("N/A");

  useEffect(() => {
    // Fetch promotion details
    fetchPromotionDetail(proID)
      .then((response) => {
        console.log("Fetched promotion data:", response.data);
        setFormData(response.data);

        // Set staffID directly for createdBy and approvedBy
        setCreatedByStaffID(response.data.createdBy || "N/A");
        setApprovedByStaffID(response.data.approvedBy || "N/A");
      })
      .catch((error) => {
        console.error("Error fetching promotion details:", error);
        message.error("Failed to fetch promotion details");
      });
  }, [proID]);

  const goToPromotionManagement = () => {
    navigate("/dashboard/promotion-management");
  };

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="dashboard-content">
        <Card
          title={`Promotion Detail - ${formData.proName || "N/A"}`}
          bordered={false}
          style={{ width: "100%", margin: "auto", maxWidth: "800px" }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label>Promotion ID</label>
            <Input value={formData.proID || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Promotion Name</label>
            <Input value={formData.proName || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Promotion Code</label>
            <Input value={formData.proCode || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Start Date</label>
            <Input value={formData.startDate || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>End Date</label>
            <Input value={formData.endDate || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Discount</label>
            <Input value={formData.discount || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Quantity</label>
            <Input value={formData.quantity || "N/A"} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Created By</label>
            <Input value={createdByStaffID} disabled />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Approved By</label>
            <Input value={approvedByStaffID} disabled />
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
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
