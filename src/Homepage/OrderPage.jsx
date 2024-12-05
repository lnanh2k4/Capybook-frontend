import React, { useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Select,
  Input,
  Result,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null); // State để theo dõi lỗi

  try {
    // Lấy dữ liệu từ `location.state` hoặc sử dụng giá trị mặc định
    const cartItems = location.state?.cartItems || [];
    const promotions = location.state?.promotions || [];
    const accountInfo = location.state?.accountInfo || {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    };

    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [editableAccountInfo, setEditableAccountInfo] = useState(accountInfo);

    const calculateFinalTotal = () =>
      cartItems.reduce((total, item) => total + item.total, 0);

    const calculateDiscountedTotal = () => {
      const finalTotal = calculateFinalTotal();
      if (!selectedPromotion) return finalTotal;

      const promotion = promotions.find(
        (promo) => promo.proID === selectedPromotion
      );
      if (!promotion) return finalTotal;

      const discountRate = promotion.discount / 100;
      return Math.round(finalTotal * (1 - discountRate));
    };

    const handleSaveShipping = () => {
      setIsEditingShipping(false);
      setEditableAccountInfo(editableAccountInfo);
    };

    const handlePurchase = () => {
      const finalPrice = calculateDiscountedTotal();
      console.log("Purchase confirmed!");
      console.log("Selected Promotion ID:", selectedPromotion);
      console.log("Final Total with Discount:", finalPrice.toLocaleString());
      navigate("/");
    };

    // Nếu không có thông tin giỏ hàng, điều hướng về trang chủ
    if (!cartItems.length || !accountInfo.firstName) {
      navigate("/");
      return null;
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

            <Card title="Promotion" style={{ marginBottom: "20px" }}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select a promotion"
                onChange={(value) => setSelectedPromotion(value)}
              >
                {promotions.map((promo) => (
                  <Option key={promo.proID} value={promo.proID}>
                    {promo.proCode} - {promo.discount}% off
                  </Option>
                ))}
              </Select>
            </Card>

            <Card title="Books">
              {cartItems.map((item) => (
                <Row
                  key={item.id}
                  align="middle"
                  style={{ marginBottom: "10px" }}
                >
                  <Col span={10}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <Text>{item.name}</Text>
                  </Col>
                  <Col span={4}>
                    <Text>{item.originalPrice.toLocaleString()} VND</Text>
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

            <Divider />
            <Row justify="end" style={{ marginTop: "20px" }}>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                Total Books Price: {calculateFinalTotal().toLocaleString()} VND
              </Text>
            </Row>
            {selectedPromotion && (
              <Row justify="end" style={{ marginTop: "10px" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Discounted Price:{" "}
                  {calculateDiscountedTotal().toLocaleString()} VND
                </Text>
              </Row>
            )}
            <Row justify="end" style={{ marginTop: "20px" }}>
              <Button type="primary" onClick={handlePurchase}>
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
  } catch (err) {
    setError(err.message); // Lưu lỗi
    console.error(err);
    return (
      <Result
        status="error"
        title="Something went wrong!"
        subTitle={err.message || "An unexpected error occurred."}
        extra={[
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>,
        ]}
      />
    );
  }
};

export default OrderPage;
