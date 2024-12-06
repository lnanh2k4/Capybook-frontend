import React, { useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Input,
  Result,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { createPayment } from "../config";
const { Header, Footer, Content } = Layout;
const { Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ `location.state`
  const cartItems = location.state?.bookData || [];
  const accountInfo = location.state?.accountInfo || {
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  };

  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [editableAccountInfo, setEditableAccountInfo] = useState(accountInfo);

  const [error, setError] = useState(null);

  // Tính tổng tiền
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total, 0);

  const handleSaveShipping = () => {
    setIsEditingShipping(false);
    console.log("Updated Customer Information:", editableAccountInfo);
  };

  const handlePurchase = () => {
    console.log("Purchase Confirmed!");
    console.log("Order Details:", {
      cartItems,
      customerInfo: editableAccountInfo,
      totalPrice: calculateTotal(),
    });
    navigate("/");
  };
  const handleCheckout = async () => {
    console.log("Initiating checkout...");
    try {
      const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);
      console.log("Total amount for payment:", totalAmount);
      const response = await createPayment(totalAmount);
      const paymentUrl = response.data;
      console.log("Redirecting to payment URL:", paymentUrl);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
      Modal.error({
        content: 'Failed to initiate payment. Please try again.',
      });
    }
  };
  // Kiểm tra nếu không có dữ liệu
  if (!cartItems.length) {
    return (
      <Result
        status="error"
        title="No Items Found"
        subTitle="There are no items in the cart. Please add items to continue."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        }
      />
    );
  }

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
      </Header>
      {/* Content */}
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <Card title="Order Summary">
          {/* Shipping Information */}
          <Card
            title="Shipping Information"
            extra={
              isEditingShipping ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={handleSaveShipping}
                >
                  Save
                </Button>
              ) : (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setIsEditingShipping(true)}
                >
                  Edit
                </Button>
              )
            }
            style={{ marginBottom: "20px" }}
          >
            {isEditingShipping ? (
              <div>
                <p>
                  <strong>Name:</strong>{" "}
                  <Input
                    value={editableAccountInfo.firstName}
                    onChange={(e) =>
                      setEditableAccountInfo((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    style={{ width: "48%", marginRight: "4%" }}
                  />
                  <Input
                    value={editableAccountInfo.lastName}
                    onChange={(e) =>
                      setEditableAccountInfo((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    style={{ width: "48%" }}
                  />
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <Input
                    value={editableAccountInfo.phone}
                    onChange={(e) =>
                      setEditableAccountInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  <Input
                    value={editableAccountInfo.address}
                    onChange={(e) =>
                      setEditableAccountInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </p>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Name:</strong> {editableAccountInfo.firstName}{" "}
                  {editableAccountInfo.lastName}
                </p>
                <p>
                  <strong>Phone:</strong> {editableAccountInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {editableAccountInfo.address}
                </p>
              </div>
            )}
          </Card>

          {/* Book List */}
          <Card title="Books">
            {cartItems.map((item, index) => (
              <Row
                key={index}
                align="middle"
                style={{ marginBottom: "10px", padding: "10px" }}
              >
                <Col span={10}>
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.bookTitle}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <Text>{item.bookTitle}</Text>
                </Col>
                <Col span={4}>
                  <Text>{item.price.toLocaleString()} VND</Text>
                </Col>
                <Col span={2}>
                  <Text>{item.quantity}</Text>
                </Col>
                <Col span={4}>
                  <Text>{item.total.toLocaleString()} VND</Text>
                </Col>
              </Row>
            ))}
          </Card>

          {/* Total Price */}
          <Divider />
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
              Total Books Price: {calculateTotal().toLocaleString()} VND
            </Text>
          </Row>
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handleCheckout}>
              Confirm Purchase
            </Button>
          </Row>
        </Card>
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

export default OrderPage;
