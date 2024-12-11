import React, { useEffect, useState } from "react";
import {
  Layout,
  Result,
  Button,
  Spin,
  message,
  Menu,
  Dropdown,
  Typography,
} from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { handlePaymentReturn, addOrder, deleteCartItem, viewCart } from "../config"; // API gọi backend
import { decodeJWT } from "../jwtConfig";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [order, setOrder] = useState(null); // Lưu thông tin order
  const navigate = useNavigate();
  const location = useLocation();
  const username = decodeJWT().sub;
  const [cartItems, setCartItems] = useState([]);
  // Lấy thông tin từ localStorage
  useEffect(() => {
    const storedOrder = localStorage.getItem("orderData");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    } else {
      message.error("No order data found. Redirecting to cart.");
      navigate("/cart");
    }
  }, [navigate]);

  // Gọi API để xác minh giao dịch
  const fetchPaymentResult = async () => {
    try {
      const response = await handlePaymentReturn(
        new URLSearchParams(location.search)
      );
      setPaymentResult(response);

      if (response.status === "success") {
        await saveOrderToBackend(); // Thêm đơn hàng vào backend
      } else {
        message.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching payment result:", error);
      setPaymentResult({
        status: "error",
        message: error.response?.data?.message || "Unable to process payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Thêm đơn hàng vào backend
  const saveOrderToBackend = async () => {
    try {
      if (!order) {
        throw new Error("Order data is missing.");
      }

      const orderDetails = order.cartItems.map((item) => {
        if (!item.bookID) {
          throw new Error(`Missing bookID for item: ${JSON.stringify(item)}`);
        }
        return {
          bookID: item.bookID,
          quantity: item.quantity,
          totalPrice: item.total,
        };
      });

      const orderDTO = {
        username: order.customerInfo.username,
        proID: order.promotion?.proID || null,
        orderDate: new Date().toISOString(),
        orderStatus: 1,
        orderAddress: order.customerInfo.address,
        email: order.customerInfo.email,
        totalAmount: order.totalAmount,
      };

      const response = await addOrder({ orderDTO, orderDetails });

      // Kiểm tra trạng thái phản hồi
      if (response.status === 201) {
        message.success("Order saved successfully!");
        localStorage.removeItem("orderData");
      } else {
        throw new Error(response.data || "Failed to save order.");
      }
    } catch (error) {
      console.error("Error saving order:", error.message);
      message.error(error.message || "Failed to save order.");
    }
  };

  useEffect(() => {
    if (order) {
      fetchPaymentResult(); // Chỉ gọi API xác minh thanh toán khi có order
    }
  }, [order]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };







  const userMenu = () => {
    if (decodeJWT()) {
      return (
        <Menu>
          {decodeJWT().scope !== "CUSTOMER" ? (
            <Menu.Item
              key="dashboard"
              icon={<AppstoreOutlined />}
              onClick={() => navigate("/dashboard/income-statistic")}
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

  if (loading) {
    return (
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#0fa4d6",
            padding: "0 20px",
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
        </Header>
        <Content style={{ textAlign: "center", marginTop: "20%" }}>
          <Spin size="large" tip="Processing payment..." />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            color: "#fff",
            backgroundColor: "#343a40",
            padding: "10px 0",
          }}
        >
          © {new Date().getFullYear()} Capybook Management System
        </Footer>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#0fa4d6",
          padding: "0 20px",
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
      </Header>
      <Content style={{ padding: "20px", minHeight: "600px" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Payment Status
        </Title>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {paymentResult?.status === "success" ? (
            <Result
              status="success"
              title="Payment Successful!"
              subTitle={
                <>
                  <p>{paymentResult.message}</p>
                  <p>
                    <strong>Transaction ID:</strong>{" "}
                    {paymentResult.transactionId}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> {paymentResult.amount} VND
                  </p>
                </>
              }
              extra={[
                <Button
                  type="primary"
                  key="cart"
                  onClick={() => {
                    // Đồng bộ hóa giỏ hàng
                    navigate("/"); // Điều hướng tới trang giỏ hàng
                  }}
                >
                  Go to HomgePage
                </Button>
                ,
                <Button key="orders" onClick={() => navigate("/OrderHistory")}>
                  View Orders
                </Button>,
              ]}
            />
          ) : (
            <Result
              status="error"
              title="Payment Failed"
              subTitle={paymentResult?.message}
              extra={[
                <Button
                  type="primary"
                  key="retry"
                  onClick={() => navigate("/cart")}
                >
                  Retry Payment
                </Button>,
                <Button key="support" onClick={() => navigate("/support")}>
                  Contact Support
                </Button>,
              ]}
            />
          )}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#343a40",
          padding: "10px 0",
        }}
      >
        © {new Date().getFullYear()} Capybook Management System
      </Footer>
    </Layout>
  );
};

export default PaymentSuccessPage;
