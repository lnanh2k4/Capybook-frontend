import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, Select, message, Tag, Modal, Timeline  } from "antd";
import {
  fetchPromotions,
  searchPromotions,
  deletePromotion,
  updatePromotion,
  fetchPromotionLogs,
  fetchStaffDetail// Thêm hàm này
} from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import moment from "moment";
import { decodeJWT } from "../jwtConfig.jsx";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [logModalVisible, setLogModalVisible] = useState(false); // State for Log Modal
  const username = decodeJWT(localStorage.getItem("jwtToken")).sub;
const [logs, setLogs] = useState([]);
const [logLoading, setLogLoading] = useState(false);

  useEffect(() => {
    fetchPromotionsData();
  }, [filterStatus]);

  const fetchPromotionsData = () => {
    setLoading(true);
    fetchPromotions()
      .then((response) => {
        console.log("Promotions loaded:", response.data); // Log dữ liệu promotions
        if (Array.isArray(response.data)) {
          const activePromotions = response.data.filter(
            (promo) => promo.proStatus === 1
          );
          const today = moment();
          const filteredPromotions = activePromotions.filter((promo) => {
            const startDate = moment(promo.startDate);
            const endDate = moment(promo.endDate);

            if (filterStatus === "active") {
              return (
                today.isBetween(startDate, endDate, "day", "[]") &&
                promo.quantity > 0
              );
            }
            if (filterStatus === "inactive") {
              return (
                !today.isBetween(startDate, endDate, "day", "[]") ||
                promo.quantity === 0
              );
            }
            return true;
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
      fetchPromotionsData(); // Reset to full data if search term is empty
    } else {
      const isNumber = !isNaN(value);
      const id = isNumber ? parseInt(value, 10) : null;
      const term = isNumber ? "" : value;

      setLoading(true);
      searchPromotions(id, term)
        .then((response) => {
          if (Array.isArray(response.data)) {
            const activePromotions = response.data.filter(
              (promo) => promo.proStatus === 1
            );

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
              return true;
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

    const isWithinActiveDateRange = moment().isBetween(
      moment(promotionToDelete.startDate),
      moment(promotionToDelete.endDate),
      "day",
      "[]"
    );

    if (isWithinActiveDateRange && promotionToDelete.quantity > 0) {
      message.warning(
        `Cannot delete promotion "${promotionToDelete.proName}" because it is currently active and quantity is greater than 0.`
      );
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
          fetchPromotionsData();
        } catch (error) {
          console.error("Error deleting promotion:", error);
          message.error("Failed to delete promotion");
        }
      },
    });
  };

  const handleLogClick = () => {
  setLogLoading(true);
  fetchPromotionLogs()
  .then(async (response) => {
    const logs = response.data || [];
    if (logs.length === 0) {
      message.info("No activity recorded.");
      setLogs([]);
      setLogModalVisible(true);
      return;
    }

    // Fetch usernames for all staff IDs in logs
    const logsWithUsernames = await Promise.all(
      logs.map(async (log) => {
        try {
          const staffResponse = await fetchStaffDetail(log.staffId.staffID);
          const staffUsername = staffResponse.data?.username || "Unknown"; // Fetch username
          return { ...log, staffUsername }; // Attach username to log
        } catch (error) {
          console.error("Error fetching staff detail:", error);
          return { ...log, staffUsername: "Unknown" }; // Default value
        }
      })
    );

    setLogs(logsWithUsernames); // Set logs with username
    setLogModalVisible(true);
  })
  .catch((error) => {
    console.error("Error fetching promotion logs:", error);
    message.error("Unable to load promotion logs.");
  })
  .finally(() => {
    setLogLoading(false);
  });
};


  const handleApprove = (record) => {
  Modal.confirm({
    title: "Approve Promotion",
    content: `Are you sure you want to approve promotion "${record.proName}"?`,
    okText: "Yes",
    cancelText: "No",
    onOk: async () => {
      try {
        await updatePromotion(record.proID, {
          actionId: 2, // Action for Approve
          username: username, // Current user's username
        });
        message.success(`Promotion "${record.proName}" approved successfully.`);
        fetchPromotionsData(); // Refresh promotions data
      } catch (error) {
        console.error("Error approving promotion:", error);
        message.error("Failed to approve promotion.");
      }
    },
  });
};


  const handleDecline = (record) => {
  Modal.confirm({
    title: "Decline Promotion",
    content: `Are you sure you want to decline promotion "${record.proName}"?`,
    okText: "Yes",
    cancelText: "No",
    okType: "danger",
    onOk: async () => {
      try {
        await updatePromotion(record.proID, {
          actionId: 3, // Action for Decline
          username: username, // Current user's username
        });
        message.success(`Promotion "${record.proName}" declined successfully.`);
        fetchPromotionsData(); // Refresh promotions data
      } catch (error) {
        console.error("Error declining promotion:", error);
        message.error("Failed to decline promotion.");
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
      render: (quantity) => quantity || 0,
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
        // Nếu approvedBy === null, hiển thị trạng thái Inactive
        const active =
          record.approvedBy !== null &&
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
            onClick={() =>
              navigate(`/dashboard/promotion-detail/${record.proID}`)
            }
          >
            <InfoCircleOutlined />
          </Button>

          {record.approvedBy === null ? (
            <>
              <Button
                type="link"
                style={{ color: "green" }}
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
              <Button
                type="link"
                style={{ color: "red" }}
                onClick={() => handleDecline(record)}
              >
                Decline
              </Button>
            </>
          ) : (
            <Button
              type="link"
              onClick={() =>
                navigate(`/dashboard/edit-promotion/${record.proID}`)
              }
            >
              <EditOutlined style={{ color: "orange" }} />
            </Button>
          )}

          {/* Hiển thị nút Delete chỉ khi `approvedBy` không phải là null */}
          {record.approvedBy !== null && (
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record.proID)}
            >
              <DeleteOutlined />
            </Button>
          )}
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
        <div
          className="titlemanagement"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
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
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => navigate("/dashboard/add-promotion")}
            >
              Add Promotion
            </Button>
            <Button
  style={{ backgroundColor: "#1890ff", color: "#fff" }}
  onClick={handleLogClick} // Gắn hàm này
>
  Log
</Button>

          </div>
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

            <Input
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

        {/* Modal for Log */}
        <Modal
  title="Promotion Logs"
  visible={logModalVisible}
  onCancel={() => setLogModalVisible(false)}
  footer={null}
  width={1000}
>
  {logLoading ? (
    <p>Loading...</p>
  ) : logs.length > 0 ? (
    <Timeline>
  {logs.map((log) => (
    <Timeline.Item
      key={log.proLogId}
      color={log.proAction === 3 ? "red" : "green"} // Đỏ nếu bị từ chối
    >
      <p>
        {log.proAction === 1
          ? `${log.staffUsername} created ${log.proId.proName} (ID: ${log.proId.proID})`
          : log.proAction === 2
          ? `Admin ${log.staffUsername} approved ${log.proId.proName} (ID: ${log.proId.proID})`
          : `Admin ${log.staffUsername} rejected ${log.proId.proName} (ID: ${log.proId.proID})`}
      </p>
      <small>{moment(log.proLogDate).format("DD/MM/YYYY")}</small>
    </Timeline.Item>
  ))}
</Timeline>
  ) : (
    <p>No activity recorded.</p>
  )}
</Modal>
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
