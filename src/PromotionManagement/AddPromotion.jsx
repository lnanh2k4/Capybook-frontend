import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, message } from "antd"; // Import Ant Design components
import { addPromotion } from "../config"; // API to add promotion
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from 'moment'; // Import moment for date handling

const { RangePicker } = DatePicker;

const AddPromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isFormEmpty, setIsFormEmpty] = useState(true);

  const handleSubmit = async (values) => {
    try {
      const [startDate, endDate] = values.dateRange; // Lấy ra startDate và endDate từ RangePicker
      const promotionData = {
        proName: values.promotionName,
        proCode: values.promotionCode,
        quantity: values.quantity,
        discount: values.discountQuantity,
        startDate: startDate.format('YYYY-MM-DD'), // Formatting date
        endDate: endDate.format('YYYY-MM-DD'),
        proStatus: 1, // Default status
      };

      console.log("Promotion data to be sent:", promotionData);

      await addPromotion(promotionData); // API call to add promotion
      message.success("Promotion added successfully");
      navigate("/dashboard/promotion-management"); // Navigate back to promotion management page
    } catch (error) {
      console.error("Error adding promotion:", error);
      message.error("Failed to add promotion");
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isEmpty = !values.promotionName || values.promotionName.trim() === '';
    setIsFormEmpty(isEmpty);
  };

  const handleResetOrBack = () => {
    if (isFormEmpty) {
      navigate("/dashboard/promotion-management"); // Navigate back to promotion management page
    } else {
      form.resetFields(); // Reset form fields
      setIsFormEmpty(true); // Cập nhật trạng thái form về trống
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      if (startDate.isAfter(endDate)) {
        // Hiển thị lỗi và yêu cầu nhập lại nếu start date sau end date
        message.error("Start date cannot be after end date. Please select valid dates.");
        form.setFields([
          {
            name: "dateRange",
            errors: ["Start date cannot be after end date"],
          },
        ]);
      } else {
        // Xóa lỗi nếu ngày hợp lệ
        form.setFields([
          {
            name: "dateRange",
            errors: [],
          },
        ]);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <div>Promotion Management - Add Promotion</div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          onFieldsChange={handleFormChange} // Kiểm tra khi form thay đổi
          style={{ maxWidth: '600px', margin: 'auto' }}
        >
          <Form.Item
            label="Promotion Name"
            name="promotionName"
            rules={[{ required: true, message: "Please enter the promotion name" }]}
          >
            <Input placeholder="Enter promotion name" />
          </Form.Item>

          <Form.Item
            label="Promotion Code"
            name="promotionCode"
            rules={[{ required: true, message: "Please enter the promotion code" }]}
          >
            <Input placeholder="Enter promotion code" />
          </Form.Item>

          <Form.Item
            label="Discount Quantity"
            name="discountQuantity"
            rules={[{ required: true, message: "Please enter the discount quantity" }]}
          >
            <InputNumber min={0} placeholder="Enter discount quantity" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber min={1} placeholder="Enter quantity" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
              label="Date Range"
              name="dateRange"
              rules={[{ required: true, message: "Please select the date range" }]}
            >
              <RangePicker 
                placeholder={["Start date", "End date"]} 
                style={{ width: '100%' }} 
                inputReadOnly
                onChange={handleDateChange} 
              />
            </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={handleResetOrBack} style={{ marginLeft: '20px' }}>
              {isFormEmpty ? 'Back' : 'Reset'}
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

export default AddPromotion;
