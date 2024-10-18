import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message } from "antd"; // Import Ant Design components
import { fetchPromotions, deletePromotion } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPromotions()
      .then((response) => {
        if (Array.isArray(response.data)) {
          // Filter promotions where proStatus === 1
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

  // Filter promotions based on the search term
  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.proStatus === 1 &&
      (promo.proName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.proCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <h1>Promotion Management</h1>
        </div>

        <div className="action-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button type="primary" onClick={goToAddPromotion}>
            Add Promotion
          </Button>
          <Search
            placeholder="Search by promotion name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredPromotions}
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
