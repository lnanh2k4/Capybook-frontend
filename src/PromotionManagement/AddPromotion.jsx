import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, message } from "antd"; // Import Ant Design components
import { addPromotion } from "../config"; // API to add promotion
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const AddPromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const promotionData = {
        proName: values.promotionName,
        proCode: values.promotionCode,
        quantity: values.quantity,
        discount: values.discountQuantity,
        startDate: values.startDate.format('YYYY-MM-DD'), // Formatting date
        endDate: values.endDate.format('YYYY-MM-DD'),
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

  const handleReset = () => {
    form.resetFields(); // Reset form fields
  };

  // Custom validator to check if endDate is after startDate
  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue('startDate');
    if (value && startDate && value.isBefore(startDate, 'day')) {
      return Promise.reject(new Error('End date cannot be before start date'));
    }
    return Promise.resolve();
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
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please select the start date" }]}
          >
            <DatePicker placeholder="Select start date" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: "Please select the end date" },
              { validator: validateEndDate } // Custom validator for date
            ]}
          >
            <DatePicker placeholder="Select end date" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={handleReset} style={{ marginLeft: '20px' }}>
              Reset
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
