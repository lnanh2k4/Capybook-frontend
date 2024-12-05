import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Card,
  Descriptions,
  Table,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "../jwtConfig";
import {
  fetchOrders,
  fetchOrderDetail,
  fetchBookDetail,
  logout,
} from "../config";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all orders and their details
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        // Lấy username từ JWT
        const username = decodeJWT(localStorage.getItem("jwtToken")).sub;
        console.log("Decoded Username:", username);

        // Gọi API để lấy danh sách tất cả các đơn hàng
        const ordersResponse = await fetchOrders();
        const ordersData = ordersResponse.data;
        console.log("Fetched Orders Data:", ordersData);

        // Lọc các đơn hàng thuộc về người dùng hiện tại
        const userOrders = ordersData.filter(
          (order) => order.customerName && order.customerName === username
        );
        console.log("Filtered User Orders:", userOrders);

        setOrders(userOrders);

        // Lấy chi tiết các đơn hàng của người dùng
        const orderDetailsPromises = userOrders.map((order) =>
          fetchOrderDetail(order.orderID)
        );
        const orderDetailsResponses = await Promise.all(orderDetailsPromises);

        const detailsMap = {};
        for (let i = 0; i < orderDetailsResponses.length; i++) {
          const orderDetails = orderDetailsResponses[i].data.orderDetails;

          const bookPromises = orderDetails.map((detail) =>
            fetchBookDetail(detail.bookID)
          );
          const booksResponses = await Promise.all(bookPromises);

          const updatedDetails = orderDetails.map((detail, index) => ({
            ...detail,
            book: booksResponses[index].data || {},
          }));

          detailsMap[userOrders[i].orderID] = updatedDetails;
        }

        setOrderDetailsMap(detailsMap);
      } catch (error) {
        message.error("Failed to fetch orders or details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const renderOrderDetailsTable = (orderID) => {
    const details = orderDetailsMap[orderID] || [];
    const columns = [
      {
        title: "Book ID",
        dataIndex: ["book", "bookID"],
        key: "bookID",
      },
      {
        title: "Title",
        dataIndex: ["book", "bookTitle"],
        key: "bookTitle",
      },
      {
        title: "Author",
        dataIndex: ["book", "author"],
        key: "author",
      },
      {
        title: "ISBN",
        dataIndex: ["book", "isbn"],
        key: "isbn",
      },
      {
        title: "Unit Price",
        dataIndex: ["book", "bookPrice"],
        key: "bookPrice",
        render: (price) => `$${price || 0}`,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Final Price",
        key: "finalPrice",
        render: (_, record) =>
          `$${(record.quantity * (record.book?.bookPrice || 0)).toFixed(2)}`,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={details}
        rowKey={(record) => record.book?.bookID || record.ODID}
        pagination={false}
        size="small"
      />
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleNotificationClick = () => {
    navigate("/notifications")
  }

  const userMenu = () => {
    if (decodeJWT()) {
      return (
        <Menu>
          {decodeJWT().scope !== "CUSTOMER" ? (
            <Menu.Item
              key="dashboard"
              icon={<AppstoreOutlined />}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Menu.Item>
          ) : (
            <Menu.Item
              key="profile"
              icon={<AppstoreOutlined />}
              onClick={() => navigate("/profile")}
            >
              Profile
            </Menu.Item>
          )}
          <Menu.Item
            key="order-history"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate("/OrderHistory")}
          >
            Order History
          </Menu.Item>
          <Menu.Item
            key="signout"
            icon={<SettingOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      );
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0fa4d6",
          padding: "0 20px",
          height: "64px",
          color: "#fff",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo-capybook.png"
            alt="Capybook Logo"
            style={{ height: "40px", marginRight: "20px" }}
          />
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>Capybook</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<BellOutlined
              style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
            />}
            style={{ color: "#fff" }}
            onClick={handleNotificationClick}
          >
          </Button>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
          />
          <Dropdown
            overlay={userMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: "#fff" }}
            >
              {localStorage.getItem("jwtToken")
                ? decodeJWT(localStorage.getItem("jwtToken")).sub
                : "Login"}
            </Button>
          </Dropdown>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ padding: "20px", minHeight: "600px" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Order History
        </Title>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? ( // Kiểm tra nếu không có đơn hàng nào
          <div style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
            You don't have any orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <Card
              key={order.orderID}
              title={`Order ID: ${order.orderID}`}
              style={{ marginBottom: "20px", border: "1px solid #ddd" }}
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Customer Name">
                  {order.customerName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  {order.orderDate}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {order.orderStatus === 0
                    ? "Processing"
                    : order.orderStatus === 1
                      ? "Delivering"
                      : order.orderStatus === 2
                        ? "Delivered"
                        : "Cancelled"}
                </Descriptions.Item>
              </Descriptions>

              <Title level={4} style={{ marginTop: "20px" }}>
                Order Details
              </Title>
              {renderOrderDetailsTable(order.orderID)}

              <Descriptions
                title="Order Summary"
                bordered
                style={{ marginTop: "20px" }}
              >
                <Descriptions.Item label="Total Books Price" span={3}>
                  $
                  {orderDetailsMap[order.orderID]
                    ?.reduce(
                      (acc, item) =>
                        acc + item.quantity * (item.book?.bookPrice || 0),
                      0
                    )
                    .toFixed(2) || "0.00"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))
        )}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#343a40",
          color: "#fff",
          padding: "10px",
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>
    </Layout>
  );
};

export default OrderHistory;
