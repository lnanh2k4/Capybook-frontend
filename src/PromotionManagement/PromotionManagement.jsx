import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, Select, message, Tag, Modal } from "antd"; // Import Ant Design components
import { fetchPromotions, searchPromotions, deletePromotion } from "../config"; // Import API functions
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment"; // Import moment for date comparison
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // Default filter status is 'all'

  // Fetch all promotions on first render or when filterStatus changes
  useEffect(() => {
    fetchPromotionsData();
  }, [filterStatus]);
const fetchPromotionsData = () => {
  setLoading(true);
  fetchPromotions()
    .then((response) => {
      if (Array.isArray(response.data)) {
        // Lọc chỉ các promotion có proStatus = 1
        const activePromotions = response.data.filter((promo) => promo.proStatus === 1);

        const today = moment();
        const filteredPromotions = activePromotions.filter((promo) => {
          const startDate = moment(promo.startDate);
          const endDate = moment(promo.endDate);

          if (filterStatus === "active") {
            return today.isBetween(startDate, endDate, "day", "[]");
          }
          if (filterStatus === "inactive") {
            return !today.isBetween(startDate, endDate, "day", "[]");
          }
          return true; // 'all' filter
        });
        setPromotions(filteredPromotions);
      } else {
        console.error("Expected an array but got", response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching promotions:", error);
      message.error("Failed to fetch promotions");
    })
    .finally(() => {
      setLoading(false);
    });
};

const handleSearch = (value) => {
  setSearchTerm(value);

  if (!value.trim()) {
    fetchPromotionsData(); // Nếu không có từ khóa, tải lại toàn bộ
  } else {
    const isNumber = !isNaN(value);
    const id = isNumber ? parseInt(value, 10) : null;
    const term = isNumber ? "" : value;

    setLoading(true);
    searchPromotions(id, term)
      .then((response) => {
        if (Array.isArray(response.data)) {
          // Lọc chỉ promotion có proStatus = 1
          const activePromotions = response.data.filter((promo) => promo.proStatus === 1);

          const today = moment();
          const filteredPromotions = activePromotions.filter((promo) => {
            const startDate = moment(promo.startDate);
            const endDate = moment(promo.endDate);

            if (filterStatus === "active") {
              return today.isBetween(startDate, endDate, "day", "[]");
            }
            if (filterStatus === "inactive") {
              return !today.isBetween(startDate, endDate, "day", "[]");
            }
            return true; // 'all' filter
          });
          setPromotions(filteredPromotions);
        } else {
          console.error("Expected an array but got", response.data);
        }
      })
      .catch((error) => {
        console.error("Error searching promotions:", error);
        message.error("Failed to search promotions");
      })
      .finally(() => {
        setLoading(false);
      });
  }
};

  const handleDelete = (proID) => {
  const promotionToDelete = promotions.find((promo) => promo.proID === proID);
  const isActive = moment().isBetween(
    moment(promotionToDelete.startDate),
    moment(promotionToDelete.endDate),
    "day",
    "[]"
  );

  if (isActive) {
    message.warning(`Cannot delete active promotion "${promotionToDelete.proName}"`);
    return;
  }

  Modal.confirm({
    title: "Confirm Deletion",
    content: `Are you sure you want to delete promotion "${promotionToDelete.proName}"?`,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk: async () => {
      try {
        await deletePromotion(proID);
        message.success("Promotion deleted successfully");
        fetchPromotionsData(); // Refresh the promotion list after deletion
      } catch (error) {
        console.error("Error deleting promotion:", error);
        message.error("Failed to delete promotion");
      }
    },
  });
};


  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  const columns = [
  {
    title: "Promotion ID",
    dataIndex: "proID",
    key: "proID",
  },
  {
    title: "Promotion Name",
    dataIndex: "proName",
    key: "proName",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    render: (quantity) => quantity || 0, // Hiển thị số lượng, nếu null thì hiển thị 0
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Status",
    key: "status",
    render: (_, record) => {
      const active =
        record.quantity > 0 &&
        moment().isBetween(
          moment(record.startDate),
          moment(record.endDate),
          "day",
          "[]"
        );
      return (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/promotion-detail/${record.proID}`)}
        >
          <InfoCircleOutlined />
        </Button>
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/edit-promotion/${record.proID}`)}
        >
          <EditOutlined style={{ color: "orange" }} />
        </Button>
        <Button type="link" danger onClick={() => handleDelete(record.proID)}>
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
          <h1>Promotion Management</h1>
        </div>

        <div
          className="action-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Button type="primary" onClick={() => navigate("/dashboard/add-promotion")}>
            Add Promotion
          </Button>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Select
              defaultValue="all"
              value={filterStatus}
              onChange={handleFilterChange}
              style={{ width: 150 }}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>

            <Search
              placeholder="Search by promotion ID, name, or code"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="proID"
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

export default PromotionManagement;
