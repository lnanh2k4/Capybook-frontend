import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, TreeSelect, message } from "antd";
import {
  fetchCategoryDetail,
  fetchCategories,
  updateCategory,
} from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
  decodeJWT,
  checkAdminRole,
  checkSellerStaffRole,
} from "../jwtConfig.jsx";

const EditCategory = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { catID } = useParams();

  useEffect(() => {
    if (!checkSellerStaffRole() && !checkAdminRole()) {
      return navigate("/404");
    }
    const loadCategoryDetail = async () => {
      try {
        const response = await fetchCategoryDetail(catID);
        const category = response.data;

        form.setFieldsValue({
          catName: category.catName,
          catDescription: category.catDescription,
        });
      } catch (error) {
        console.error("Error fetching category detail:", error);
        message.error("Failed to fetch category details");
      }
    };

    loadCategoryDetail();
  }, [catID, form]);

  const handleSubmit = (values) => {
    const updatedCategory = {
      ...values,
      catName: values.catName,
      catDescription: values.catDescription,
      catStatus: values.catStatus || 1,
    };

    updateCategory(catID, updatedCategory)
      .then(() => {
        message.success("Category updated successfully");
        navigate("/dashboard/category");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        message.error("Failed to update category");
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/category");
  };

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <div>Category Management - Edit Category</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: "800px", margin: "auto" }}
        >
          <Form.Item
            label="Category Name"
            name="catName"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>

          <Form.Item
            label="Category Description"
            name="catDescription"
            rules={[
              { required: false, message: "Please enter the description" },
            ]}
          >
            <Input placeholder="Category Description" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
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
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default EditCategory;
