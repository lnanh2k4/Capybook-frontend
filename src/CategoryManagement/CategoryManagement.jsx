import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message } from "antd"; // Import Ant Design components
import { fetchCategories, deleteCategory } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((response) => {
        if (Array.isArray(response.data)) {
          // Filter categories where catStatus === 1 (active categories)
          const activeCategories = response.data.filter(
            (category) => category.catStatus === 1
          );
          setCategories(activeCategories);
        } else {
          console.error("Expected an array but got", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        message.error("Failed to fetch categories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (catID) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        // Soft delete by setting catStatus to 0
        await deleteCategory(catID);
        setCategories(
          categories.filter((category) => category.catID !== catID)
        );
        message.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        message.error("Failed to delete category");
      }
    }
  };

  const goToAddCategory = () => {
    navigate("/dashboard/category/add");
  };

  const goToEditCategory = (catID) => {
    navigate(`/dashboard/edit-category/${catID}`);
  };

  const goToCategoryDetail = (catID) => {
    navigate(`/dashboard/category-detail/${catID}`);
  };

  const columns = [
    {
      title: "Category ID",
      dataIndex: "catID",
      key: "catID",
    },
    {
      title: "Category Name",
      dataIndex: "catName",
      key: "catName",
    },
    {
      title: "Category Status",
      dataIndex: "catStatus",
      key: "catStatus",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => goToCategoryDetail(record.catID)}>
            Detail
          </Button>
          <Button type="link" onClick={() => goToEditCategory(record.catID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.catID)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Filter categories based on the search term
  const filteredCategories = categories.filter(
    (category) =>
      category.catStatus === 1 &&
      category.catName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <h1>Category Management</h1>
        </div>

        <div
          className="action-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Button type="primary" onClick={goToAddCategory}>
            Add Category
          </Button>
          <Search
            placeholder="Search by category name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="catID"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default CategoryManagement;
