import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, TreeSelect, message } from "antd";
import { fetchCategories, addCategory } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import TextArea from "antd/es/input/TextArea.js";
import {
  decodeJWT,
  checkAdminRole,
  checkSellerStaffRole,
} from "../jwtConfig.jsx";

function AddCategory() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState(true);

  useEffect(() => {
    if (!checkSellerStaffRole() && !checkAdminRole()) {
      return navigate("/404");
    }
  }, []);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isEmpty = !values.catName || values.catName.trim() === "";
    setIsFormEmpty(isEmpty);
  };

  const handleSubmit = async (values) => {
    try {
      const categoryData = {
        catName: values.catName,
        catDescription: values.catDescription,
        catStatus: 1,
      };

      await addCategory(categoryData);
      message.success("Category added successfully");
      navigate("/dashboard/category");
    } catch (error) {
      console.error("Error adding category:", error);
      message.error("Failed to add category");
    }
  };

  const handleResetOrBack = () => {
    if (isFormEmpty) {
      navigate("/dashboard/category");
    } else {
      form.resetFields();
      setIsFormEmpty(true);
    }
  };

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <div>Category Management - Add Category</div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          onFieldsChange={handleFormChange}
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Form.Item
            label="Category Name"
            name="catName"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            label="Category description"
            name="catDescription"
            rules={[{ required: false }]}
            style={{ maxWidth: "600px", margin: "auto" }}
          >
            <TextArea placeholder="Enter category description" />
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
        <div>© Copyright {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
}

export default AddCategory;
