import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, message, InputNumber } from "antd"; // Import Ant Design components
import { updatePromotion, fetchPromotionDetail } from "../config"; // Import API
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment";

const { RangePicker } = DatePicker; // Sử dụng RangePicker

const EditPromotion = () => {
  const { proID } = useParams(); // Lấy proID từ URL
  const navigate = useNavigate(); // Sử dụng để điều hướng
  const [form] = Form.useForm(); // Ant Design form
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  fetchPromotionDetail(proID)
    .then((response) => {
      const promotion = response.data;
      form.setFieldsValue({
        ...promotion,
        dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
        proStatus: promotion.proStatus, // Giữ nguyên trạng thái khuyến mãi hiện tại
      });
    })
    .catch((error) => {
      console.error("Error fetching promotion details:", error);
      message.error("Failed to fetch promotion details");
    });
}, [proID, form]);


  const handleSubmit = (values) => {
    const { dateRange, ...rest } = values;

    const updatedPromotion = {
      ...rest,
      startDate: moment(dateRange[0]).format("YYYY-MM-DD"),
      endDate: moment(dateRange[1]).format("YYYY-MM-DD"),
    };

    if (moment(updatedPromotion.endDate).isBefore(updatedPromotion.startDate)) {
      message.error("End date cannot be earlier than start date");
      return;
    }

    updatePromotion(proID, updatedPromotion)
      .then(() => {
        message.success("Promotion updated successfully");
        navigate("/dashboard/promotion-management"); // Điều hướng về Promotion Management sau khi cập nhật
      })
      .catch((error) => {
        console.error("Error updating promotion:", error);
        message.error("Failed to update promotion");
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/promotion-management"); // Điều hướng về Promotion Management khi cancel
  };

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="dashboard-content">
        <div className="titlemanagement">
          <h1>Promotion Management - Edit Promotion</h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: "800px", margin: "auto" }}
        >
          <Form.Item
            label="Promotion Name"
            name="proName"
            rules={[{ required: true, message: "Please enter the promotion name" }]}
          >
            <Input placeholder="Promotion Name" />
          </Form.Item>

          <Form.Item
            label="Promotion Code"
            name="proCode"
            rules={[{ required: true, message: "Please enter the promotion code" }]}
          >
            <Input placeholder="Promotion Code" />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Please enter the discount" }]}
          >
            <InputNumber min={0} placeholder="Discount" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber min={1} placeholder="Quantity" style={{ width: "100%" }} />
          </Form.Item>

          {/* Sử dụng RangePicker để chọn ngày bắt đầu và kết thúc */}
          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true, message: "Please select start and end dates" }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              allowClear
              onChange={(dates) => {
                if (dates && dates.length === 2 && dates[0].isAfter(dates[1])) {
                  message.error("End date cannot be earlier than start date");
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginLeft: "20px" }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
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
