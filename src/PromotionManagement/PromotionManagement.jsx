import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Table,
  Button,
  Input,
  Select,
  message,
  Tag,
  Modal,
  Timeline,
  Pagination,
} from "antd";
import {
  fetchPromotions,
  searchPromotions,
  deletePromotion,
  updatePromotion,
  fetchPromotionLogs,
  fetchStaffByUsername, // Sử dụng fetchStaffByUsername thay cho fetchStaffDetail
  fetchStaffDetail,
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
  const [logModalVisible, setLogModalVisible] = useState(false);
  const username = decodeJWT(localStorage.getItem("jwtToken")).sub;
  const [staffID, setStaffID] = useState(null); // Lưu staffID
  const [logs, setLogs] = useState([]);
  const [logLoading, setLogLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filterActivity, setFilterActivity] = useState("all");

  // Fetch staffID khi component mount
  useEffect(() => {
    const fetchStaffID = async () => {
      try {
        const response = await fetchStaffByUsername(username); // Lấy thông tin staff bằng username
        setStaffID(response.data.staffID);
      } catch (error) {
        console.error("Error fetching staff:", error);
        message.error("Failed to fetch staff information.");
      }
    };

    fetchStaffID();
    fetchPromotionsData();
  }, [username, filterStatus]);

  // Fetch promotions data
  const fetchPromotionsData = () => {
    setLoading(true);
    fetchPromotions()
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

          const sortedPromotions = filteredPromotions.sort(
            (a, b) => b.proID - a.proID
          );
          setPromotions(sortedPromotions);
        }
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
        message.error("Failed to fetch promotions.");
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

  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const handleLogClick = async (
    action = null,
    startDate = null,
    endDate = null
  ) => {
    setLogLoading(true);
    try {
      const response = await fetchPromotionLogs(action, startDate, endDate);
      console.log("Logs fetched from API:", response.data); // Debugging logs

      let logsData = response.data || [];

      // Sắp xếp logs theo `proLogId` từ cao xuống thấp
      logsData = logsData.sort((a, b) => b.proLogId - a.proLogId);

      const logsWithUsernames = await Promise.all(
        logsData.map(async (log) => {
          try {
            const staffResponse = await fetchStaffDetail(log.staffId); // Fetch username
            const username = staffResponse.data.username; // Giả định API trả về username
            return { ...log, username: username || "Unknown" };
          } catch (error) {
            console.error(
              `Error fetching username for staffId ${log.staffId}`,
              error
            );
            return { ...log, username: "Unknown" };
          }
        })
      );

      console.log("Logs with usernames:", logsWithUsernames); // Debugging logs
      setLogs(logsWithUsernames);
      setLogModalVisible(true);
    } catch (error) {
      console.error("Error fetching promotion logs:", error);
      message.error("Unable to load promotion logs.");
    } finally {
      setLogLoading(false);
    }
  };

  const handleFilterActivity = (value) => {
    setFilterActivity(value);

    if (value === "all") {
      setLogs(originalLogs); // Hiển thị tất cả logs nếu chọn "all"
      return;
    }

    const filteredLogs = originalLogs.filter((log) => {
      if (value === "create") return log.proAction === 1;
      if (value === "approve") return log.proAction === 2;
      if (value === "reject") return log.proAction === 3;
      return true;
    });

    setLogs(filteredLogs); // Cập nhật logs theo bộ lọc
  };

  // Approve promotion
  const handleApprove = (record) => {
    if (!staffID) {
      message.error("Unable to perform action. Staff ID not found.");
      return;
    }

    Modal.confirm({
      title: "Approve Promotion",
      content: `Are you sure you want to approve promotion "${record.proName}"?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await updatePromotion(record.proID, {
            actionId: 2, // Approve action
            staffID: staffID, // Pass staffID
          });
          message.success(
            `Promotion "${record.proName}" approved successfully.`
          );
          fetchPromotionsData(); // Refresh promotions data
        } catch (error) {
          console.error("Error approving promotion:", error);
          message.error("Failed to approve promotion.");
        }
      },
    });
  };

  // Decline promotion
  const handleDecline = (record) => {
    if (!staffID) {
      message.error("Unable to perform action. Staff ID not found.");
      return;
    }

    Modal.confirm({
      title: "Decline Promotion",
      content: `Are you sure you want to decline promotion "${record.proName}"?`,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await updatePromotion(record.proID, {
            actionId: 3, // Decline action
            staffID: staffID, // Pass staffID
          });
          message.success(
            `Promotion "${record.proName}" declined successfully.`
          );
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
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "center", // Canh giữa nội dung
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Select
                defaultValue="all"
                value={filterActivity}
                onChange={handleFilterActivity}
                style={{ width: "200px" }} // Tùy chỉnh chiều rộng nếu cần
              >
                <Option value="all">All Activities</Option>
                <Option value="create">Created</Option>
                <Option value="approve">Approved</Option>
                <Option value="reject">Rejected</Option>
              </Select>
            </div>
          }
          visible={logModalVisible}
          onCancel={() => setLogModalVisible(false)}
          footer={null}
          width={1000}
        >
          {logLoading ? (
            <p>Loading...</p>
          ) : logs.length > 0 ? (
            <>
              <Timeline>
                {paginatedLogs.map((log) => (
                  <Timeline.Item
                    key={log.proLogId}
                    color={
                      log.proAction === 3
                        ? "red"
                        : log.proAction === 2
                        ? "green"
                        : "blue"
                    }
                  >
                    <p>
                      {log.proAction === 1
                        ? `${
                            log.username || "Unknown"
                          } created promotion (ID: ${log.proId || "N/A"})`
                        : log.proAction === 2
                        ? `Admin ${
                            log.username || "Unknown"
                          } approved promotion (ID: ${log.proId || "N/A"})`
                        : `Admin ${
                            log.username || "Unknown"
                          } rejected promotion (ID: ${log.proId || "N/A"})`}
                    </p>
                    <small>
                      {log.proLogDate
                        ? moment(log.proLogDate).format("DD/MM/YYYY")
                        : "Unknown Date"}
                    </small>
                  </Timeline.Item>
                ))}
              </Timeline>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={logs.length}
                onChange={handlePageChange}
              />
            </>
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
