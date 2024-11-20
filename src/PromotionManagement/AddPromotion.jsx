import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, message } from "antd";
import { addPromotion } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment";

const { RangePicker } = DatePicker;

const AddPromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isFormEmpty, setIsFormEmpty] = useState(true);

  const handleSubmit = async (values) => {
    try {
      const [startDate, endDate] = values.dateRange;
      const promotionData = {
        proName: values.promotionName,
        proCode: values.promotionCode,
        quantity: values.quantity,
        discount: values.discountPercentage,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        proStatus: 1,
      };

      console.log("Promotion data to be sent:", promotionData);

      await addPromotion(promotionData);
      message.success("Promotion added successfully");
      navigate("/dashboard/promotion-management");
    } catch (error) {
      console.error("Error adding promotion:", error);
      message.error("Failed to add promotion");
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isEmpty = !values.promotionName || values.promotionName.trim() === "";
    setIsFormEmpty(isEmpty);
  };

  const handleResetOrBack = () => {
    if (isFormEmpty) {
      navigate("/dashboard/promotion-management");
    } else {
      form.resetFields();
      setIsFormEmpty(true);
    }
  };

  // Hàm vô hiệu hóa các ngày trong quá khứ
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
          <div>Promotion Management - Add Promotion</div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          onFieldsChange={handleFormChange}
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Form.Item
            label="Promotion Name"
            name="promotionName"
            rules={[
              { required: true, message: "Please enter the promotion name" },
              {
                pattern: /^[a-zA-Z0-9]*$/,
                message: "Promotion Name can only contain letters and numbers",
              },
            ]}
          >
            <Input placeholder="Enter promotion name" />
          </Form.Item>

          <Form.Item
            label="Promotion Code"
            name="promotionCode"
            rules={[
              { required: true, message: "Please enter the promotion code" },
              {
                pattern: /^[a-zA-Z0-9]*$/,
                message: "Promotion Code can only contain letters and numbers",
              },
            ]}
          >
            <Input placeholder="Enter promotion code" />
          </Form.Item>

          <Form.Item
            label="Discount %"
            name="discountPercentage"
            rules={[
              { required: true, message: "Please enter the discount percentage" },
              {
                type: "number",
                min: 1,
                max: 50,
                message: "Discount percentage must be between 1 and 50%",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={50}
              placeholder="Enter discount percentage"
              style={{ width: "100%" }}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber
              min={1}
              placeholder="Enter quantity"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true, message: "Please select the date range" }]}
          >
            <RangePicker
              placeholder={["Start date", "End date"]}
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              htmlType="button"
              onClick={handleResetOrBack}
              style={{ marginLeft: "20px" }}
            >
              {isFormEmpty ? "Back" : "Reset"}
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
