import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, message } from "antd"; // Import Ant Design components
import { updatePromotion, fetchPromotionDetail } from "../config"; // API để cập nhật và lấy dữ liệu
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment"; // Import moment for date handling

const { RangePicker } = DatePicker;

const EditPromotion = () => {
  const { proID } = useParams(); // Lấy ID của khuyến mãi từ URL
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPromotionDetail(proID)
      .then((response) => {
        const promotion = response.data;
        form.setFieldsValue({
          promotionName: promotion.proName,
          promotionCode: promotion.proCode,
          quantity: promotion.quantity,
          discount: promotion.discount, // Cập nhật ở đây
          dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
        });
      })
      .catch((error) => {
        console.error("Error fetching promotion details:", error);
        message.error("Failed to fetch promotion details");
      })
      .finally(() => setLoading(false));
  }, [proID, form]);

  const handleSubmit = async (values) => {
    try {
      const [startDate, endDate] = values.dateRange;
      const promotionData = {
  proName: values.promotionName,
  proCode: values.promotionCode,
  quantity: values.quantity,
  discount: values.discount,
  startDate: startDate.format("YYYY-MM-DD"),
  endDate: endDate.format("YYYY-MM-DD"),
  proStatus: 1,
};

      console.log("Promotion data to be updated:", promotionData);

      await updatePromotion(proID, promotionData);
      message.success("Promotion updated successfully");
      navigate("/dashboard/promotion-management");
    } catch (error) {
      console.error("Error updating promotion:", error);
      message.error("Failed to update promotion");
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isEmpty = !values.promotionName || values.promotionName.trim() === "";
    setIsFormEmpty(isEmpty);
  };

  const handleResetOrBack = () => {
    navigate("/dashboard/promotion-management");
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <div>Promotion Management - Edit Promotion</div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          onFieldsChange={handleFormChange}
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber
              min={0}
              placeholder="Enter quantity"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[
              { required: true, message: "Please select the date range" },
            ]}
          >
            <RangePicker
              placeholder={["Start date", "End date"]}
              style={{ width: "100%" }}
              inputReadOnly // Ngăn không cho nhập trực tiếp vào trườn
              onFocus={() => form.setFieldsValue({ dateRange: null })}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
            <Button
              htmlType="button"
              onClick={handleResetOrBack}
              style={{ marginLeft: "20px" }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default EditPromotion;
