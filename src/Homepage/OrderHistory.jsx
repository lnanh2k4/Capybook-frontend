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
  Input,
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
  fetchPromotionDetail,
  fetchAccountDetail,
} from "../config";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Thêm state này
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Kết nối với thanh tìm kiếm
  const navigate = useNavigate();

  // Fetch all orders and initialize filteredOrders
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        // Fetch username từ token
        const username = decodeJWT(localStorage.getItem("jwtToken")).sub;

        // Fetch orders
        const ordersResponse = await fetchOrders();
        const ordersData = ordersResponse.data || []; // Xử lý nếu ordersResponse.data không tồn tại

        // Lọc các orders của user hiện tại và sắp xếp giảm dần theo orderID
        const userOrders = ordersData
          .filter(
            (order) => order.customerName && order.customerName === username
          )
          .sort((a, b) => b.orderID - a.orderID);

        setOrders(userOrders);
        setFilteredOrders(userOrders); // Đồng bộ filteredOrders với orders ban đầu

        // Fetch chi tiết từng order
        const detailsMap = {};
        for (const order of userOrders) {
          const orderDetailsResponse = await fetchOrderDetail(order.orderID);
          const orderDetails = orderDetailsResponse?.data?.orderDetails || [];
          const proID = orderDetailsResponse?.data?.order?.proID;

          // Fetch chi tiết sách
          const books = await Promise.all(
            orderDetails.map((detail) => fetchBookDetail(detail.bookID))
          );
          const updatedDetails = orderDetails.map((detail, index) => ({
            ...detail,
            book: books[index]?.data || {},
          }));

          // Fetch thông tin khuyến mãi
          let promotion = null;
          if (proID) {
            try {
              const promotionResponse = await fetchPromotionDetail(proID);
              promotion = promotionResponse?.data || {};
            } catch (error) {
              console.error(
                `Failed to fetch promotion for proID: ${proID}`,
                error
              );
            }
          }

          // Fetch thông tin khách hàng
          let customerFullName = "N/A";
          try {
            const customerData = await fetchAccountDetail(order.customerName);
            customerFullName = `${customerData?.data?.firstName} ${customerData?.data?.lastName}`;
          } catch (error) {
            console.error(
              `Failed to fetch account for customer: ${order.customerName}`,
              error
            );
          }

          // Lưu vào map
          detailsMap[order.orderID] = {
            details: updatedDetails,
            promotionDiscount: promotion?.discount || 0,
            customerFullName,
          };
        }

        setOrderDetailsMap(detailsMap);
      } catch (error) {
        message.error("Failed to fetch orders or details.");
        console.error("Error in fetchAllOrders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Handle search
  const handleSearch = (searchTerm) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.orderID.toString().includes(lowerCaseTerm) || // Tìm theo Order ID
        (orderDetailsMap[order.orderID]?.details || []).some(
          (detail) =>
            detail.book?.bookTitle?.toLowerCase().includes(lowerCaseTerm) // Tìm theo Book Title
        )
    );
    setFilteredOrders(filtered); // Cập nhật danh sách đã lọc
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const renderOrderDetailsTable = (orderID) => {
    const orderData = orderDetailsMap[orderID];

    // Kiểm tra nếu dữ liệu không hợp lệ hoặc không phải mảng
    if (!orderData || !Array.isArray(orderData.details)) {
      console.error(`Invalid details for orderID: ${orderID}`, orderData);
      return <div>No details available</div>;
    }

    const details = orderData.details;
    const columns = [
      {
        title: "Image",
        dataIndex: ["book", "image"],
        key: "image",
        render: (image) =>
          image ? (
            <img
              src={image}
              alt="Book"
              style={{
                width: "100px", // Gấp đôi kích thước chiều rộng
                height: "100px", // Gấp đôi kích thước chiều cao
                objectFit: "cover", // Duy trì tỷ lệ ảnh
              }}
            />
          ) : (
            "N/A"
          ),
      },
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
        render: (price) => `${formatPrice(price || 0)} VNĐ`,
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
          `${formatPrice(record.quantity * (record.book?.bookPrice || 0))} VNĐ`,
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
    navigate("/notifications");
  };
  const handleCartClick = () => {
    navigate("/cart/ViewDetail");
  };
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
        <Search
          placeholder="Search by Order ID or Book Title"
          value={searchTerm} // Kết nối với state `searchTerm`
          onChange={(e) => {
            setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm
            handleSearch(e.target.value); // Gọi hàm lọc danh sách
          }}
          style={{ width: "400px", marginRight: "20px" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={
              <BellOutlined
                style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
              />
            }
            style={{ color: "#fff" }}
            onClick={handleNotificationClick}
          ></Button>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
            onClick={handleCartClick}

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
        ) : filteredOrders.length === 0 ? ( // Sử dụng filteredOrders ở đây
          <div style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
            No orders found.
          </div>
        ) : (
          filteredOrders.map(
            (
              order // Và ở đây
            ) => (
              <Card
                key={order.orderID}
                title={`Order ID: ${order.orderID}`}
                style={{ marginBottom: "20px", border: "1px solid #ddd" }}
              >
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Customer Name">
                    {orderDetailsMap[order.orderID]?.customerFullName || "N/A"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Order Date">
                    {order.orderDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {order.orderStatus === 0
                      ? "Processing"
                      : order.orderStatus === 1
                        ? "Cancelled"
                        : order.orderStatus === 2
                          ? "Delivering"
                          : order.orderStatus === 3
                            ? "Delivered"
                            : order.orderStatus === 4
                              ? "Returned"
                              : "Unknown"}
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
                    {formatPrice(
                      (orderDetailsMap[order.orderID]?.details || []).reduce(
                        (acc, item) =>
                          acc + item.quantity * (item.book?.bookPrice || 0),
                        0
                      )
                    )}{" "}
                    VNĐ
                  </Descriptions.Item>

                  <Descriptions.Item label="Promotion Discount (%)" span={3}>
                    {orderDetailsMap[order.orderID]?.promotionDiscount || 0}%
                  </Descriptions.Item>

                  <Descriptions.Item
                    label="Total Price After Discount"
                    span={3}
                  >
                    {formatPrice(
                      (orderDetailsMap[order.orderID]?.details || []).reduce(
                        (acc, item) =>
                          acc + item.quantity * (item.book?.bookPrice || 0),
                        0
                      ) *
                      (1 -
                        (orderDetailsMap[order.orderID]?.promotionDiscount ||
                          0) /
                        100)
                    )}{" "}
                    VNĐ
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )
          )
        )}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#343a40",
          padding: "10px 0",
          bottom: 0,
          position: 'fixed',
          width: '100%'
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>
    </Layout>
  );
};

export default OrderHistory;
