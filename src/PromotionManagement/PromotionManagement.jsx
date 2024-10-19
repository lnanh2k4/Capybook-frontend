import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message, Tag } from "antd"; // Import Ant Design components
import { fetchPromotions, searchPromotions, deletePromotion } from "../config"; // Import searchPromotions từ API
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from 'moment'; // Import moment for date comparison

const { Search } = Input;

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Sử dụng để lưu giá trị tìm kiếm
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tất cả khuyến mãi khi lần đầu vào trang
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

  // Hàm thực hiện khi nhấn nút search
  const handleSearch = (value) => {
    if (!value) {
      // Nếu không có giá trị tìm kiếm, fetch lại tất cả các promotions
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
      // Thực hiện tìm kiếm với searchTerm
      setLoading(true);
      searchPromotions(value) // Gọi API tìm kiếm với giá trị searchTerm
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
    return today.isBetween(start, end, 'day', '[]');
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
      title: "Status", // New column for active/inactive status
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
          <Button type="link" onClick={() => goToPromotionDetail(record.proID)}>
            Detail
          </Button>
          <Button type="link" onClick={() => goToEditPromotion(record.proID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.proID)}>
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
            onChange={(e) => setSearchTerm(e.target.value)} // Lưu giá trị nhập vào searchTerm
            onSearch={handleSearch} // Thực hiện tìm kiếm khi nhấn vào icon search
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
