import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message, Modal } from "antd";
import { fetchCategories, searchCategories, deleteCategory } from "../config"; // Thêm searchCategories từ API
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tất cả danh mục khi lần đầu vào trang
  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const activeCategories = response.data.filter(
            (category) => category.catStatus === 1
          );
          const updatedCategories = activeCategories.map((category) => {
            const parent = category.parentCatID
              ? response.data.find((cat) => cat.catID === category.parentCatID)?.catName
              : "Parent";
            return { ...category, parent };
          });

          setCategories(updatedCategories);
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

  // Hàm thực hiện khi nhấn nút search
  const handleSearch = () => {
    setLoading(true);
    searchCategories(searchTerm) // Gọi API tìm kiếm
      .then((response) => {
        if (Array.isArray(response.data)) {
          const activeCategories = response.data.filter(
            (category) => category.catStatus === 1
          );
          const updatedCategories = activeCategories.map((category) => {
            const parent = category.parentCatID
              ? response.data.find((cat) => cat.catID === category.parentCatID)?.catName
              : "Parent";
            return { ...category, parent };
          });

          setCategories(updatedCategories);
        } else {
          console.error("Expected an array but got", response.data);
        }
      })
      .catch((error) => {
        console.error("Error searching categories:", error);
        message.error("Failed to search categories");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (catID) => {
    const categoryToDelete = categories.find((category) => category.catID === catID);
    const childCategories = categories.filter(
      (category) => category.parentCatID === catID
    );

    if (childCategories.length > 0) {
      Modal.warning({
        title: "Cannot delete parent category",
        content: `Category "${categoryToDelete.catName}" has child categories and cannot be deleted.`,
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(catID);
        setCategories(categories.filter((category) => category.catID !== catID));
        message.success("Category marked as deleted (status set to 0) successfully");
      } catch (error) {
        console.error("Error soft deleting category:", error);
        message.error("Failed to soft delete category");
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
    navigate(`/dashboard/category/detail/${catID}`);
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
      title: "Type",
      dataIndex: "parent",
      key: "parent",
      render: (parent) => (parent === "Parent" ? "Parent" : `Child of: ${parent}`),
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
            onSearch={handleSearch} // Thực hiện tìm kiếm khi nhấn vào biểu tượng search
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={categories}
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
