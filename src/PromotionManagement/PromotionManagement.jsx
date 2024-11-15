import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message, Tag } from "antd"; // Import Ant Design components
import { fetchPromotions, searchPromotions, deletePromotion } from "../config"; // Import API functions
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment"; // Import moment for date comparison
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all promotions on first render
  useEffect(() => {
    setLoading(true);
    fetchPromotions()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const activePromotions = response.data.filter(
            (promo) => promo.proStatus === 1
          );
          setPromotions(activePromotions);
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
  }, []);

  // Handle search function
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      // Fetch all promotions if search term is empty
      fetchPromotions()
        .then((response) => {
          if (Array.isArray(response.data)) {
            const activePromotions = response.data.filter(
              (promo) => promo.proStatus === 1
            );
            setPromotions(activePromotions);
          } else {
            console.error("Expected an array but got", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching promotions:", error);
          message.error("Failed to fetch promotions");
        })
        .finally(() => setLoading(false));
    } else {
      // Perform search with the search term
      setLoading(true);
      searchPromotions(value)
        .then((response) => {
          if (Array.isArray(response.data)) {
            const activePromotions = response.data.filter(
              (promo) => promo.proStatus === 1
            );
            setPromotions(activePromotions);
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

  const handleDelete = async (proID) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        // Soft delete by setting proStatus to 0
        await deletePromotion(proID);
        setPromotions(promotions.filter((promo) => promo.proID !== proID));
        message.success("Promotion deleted successfully");
      } catch (error) {
        console.error("Error deleting promotion:", error);
        message.error("Failed to delete promotion");
      }
    }
  };

  const goToAddPromotion = () => {
    navigate("/dashboard/add-promotion");
  };

  const goToEditPromotion = (proID) => {
    navigate(`/dashboard/edit-promotion/${proID}`);
  };

  const goToPromotionDetail = (proID) => {
    navigate(`/dashboard/promotion-detail/${proID}`);
  };

  // Function to check if promotion is active based on startDate and endDate
  const isPromotionActive = (startDate, endDate) => {
    const today = moment();
    const start = moment(startDate);
    const end = moment(endDate);
    return today.isBetween(start, end, "day", "[]");
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
      title: "Promotion Code",
      dataIndex: "proCode",
      key: "proCode",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
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
        const active = isPromotionActive(record.startDate, record.endDate);
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
            onClick={() => goToPromotionDetail(record.proID)}
          >
            <InfoCircleOutlined />
          </Button>
          <Button type="link" onClick={() => goToEditPromotion(record.proID)}>
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
          <Button type="primary" onClick={goToAddPromotion}>
            Add Promotion
          </Button>
          <Search
            placeholder="Search by promotion name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
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
