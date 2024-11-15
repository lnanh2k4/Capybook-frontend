import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message, Modal, TreeSelect } from "antd";
import { fetchCategories, searchCategories, deleteCategory } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState([]); // Tất cả các danh mục
  const [filteredCategories, setFilteredCategories] = useState([]); // Danh mục được lọc để hiển thị trong bảng
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]); // Dữ liệu cho TreeSelect
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục được chọn
  const [expandedKeys, setExpandedKeys] = useState([]); // Các mục mở rộng trong TreeSelect

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

          setAllCategories(updatedCategories);
          setFilteredCategories(updatedCategories); // Ban đầu hiển thị tất cả các danh mục

          // Tạo cấu trúc treeData từ dữ liệu category
          setTreeData(buildTreeData(updatedCategories));
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

  // Hàm xây dựng cấu trúc treeData cho TreeSelect
  const buildTreeData = (categories) => {
    const map = {};
    const roots = [];

    categories.forEach((category) => {
      map[category.catID] = {
        title: category.catName,
        value: category.catID,
        key: category.catID,
        children: [],
      };
    });

    categories.forEach((category) => {
      if (category.parentCatID && map[category.parentCatID]) {
        map[category.parentCatID].children.push(map[category.catID]);
      } else if (!category.parentCatID) {
        roots.push(map[category.catID]);
      }
    });

    return roots;
  };

  // Hàm tìm tất cả các danh mục con của một danh mục
  const findAllDescendants = (categoryId, categories) => {
    const descendants = [];
    const findChildren = (parentId) => {
      categories.forEach((cat) => {
        if (cat.parentCatID === parentId) {
          descendants.push(cat.catID);
          findChildren(cat.catID);
        }
      });
    };
    findChildren(categoryId);
    return descendants;
  };

  const handleTreeSelectChange = (value) => {
    setSelectedCategory(value);

    if (value) {
      // Tìm tất cả các danh mục con của danh mục được chọn
      const descendantIds = findAllDescendants(value, allCategories);
      const filtered = allCategories.filter(
        (category) =>
          category.catID === value || descendantIds.includes(category.catID)
      );
      setFilteredCategories(filtered);
    } else {
      // Nếu không có danh mục nào được chọn, hiển thị tất cả
      setFilteredCategories(allCategories);
    }
  };

  const handleTreeExpand = (keys) => {
    setExpandedKeys(keys);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);

    // Lọc danh sách dựa trên tìm kiếm
    const filtered = allCategories.filter((category) =>
      category.catName.toLowerCase().includes(value.toLowerCase())
    );

    // Nếu có danh mục được chọn trong TreeSelect, áp dụng lọc thêm
    if (selectedCategory) {
      const descendantIds = findAllDescendants(selectedCategory, allCategories);
      const filteredBySelection = filtered.filter(
        (category) =>
          category.catID === selectedCategory || descendantIds.includes(category.catID)
      );
      setFilteredCategories(filteredBySelection);
    } else {
      setFilteredCategories(filtered);
    }
  };

  const handleEditCategory = (category) => {
    navigate(`/dashboard/category/${category.catID}`);
  };

  const handleDelete = async (catID) => {
    const categoryToDelete = allCategories.find((category) => category.catID === catID);
    const childCategories = allCategories.filter(
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
        message.success("Category marked as deleted (status set to 0) successfully");

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

              setAllCategories(updatedCategories);
              // Áp dụng lọc lại sau khi xóa
              if (selectedCategory) {
                const descendantIds = findAllDescendants(selectedCategory, updatedCategories);
                const filtered = updatedCategories.filter(
                  (category) =>
                    category.catID === selectedCategory ||
                    descendantIds.includes(category.catID)
                );
                setFilteredCategories(filtered);
              } else {
                setFilteredCategories(updatedCategories);
              }

              setTreeData(buildTreeData(updatedCategories));
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
      } catch (error) {
        console.error("Error soft deleting category:", error);
        message.error("Failed to soft delete category");
      }
    }
  };

  const goToAddCategory = () => {
    navigate("/dashboard/category/add");
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => goToCategoryDetail(record.catID)}>
            <InfoCircleOutlined />
          </Button>
          <Button type="link" onClick={() => handleEditCategory(record)}>
            <EditOutlined style={{ color: 'orange' }} />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.catID)}>
            <DeleteOutlined />
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
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Button type="primary" onClick={goToAddCategory}>
            Add Category
          </Button>

          <TreeSelect
            style={{ width: 300 }}
            value={selectedCategory}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="Select a category"
            treeDefaultExpandAll={false}
            treeExpandedKeys={expandedKeys}
            onChange={handleTreeSelectChange}
            onTreeExpand={handleTreeExpand}
            allowClear
          />

          <Input
            placeholder="Search by category name"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
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
