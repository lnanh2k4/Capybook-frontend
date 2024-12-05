import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Modal,
  Select,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { viewCart, fetchPromotions, createPayment, handlePaymentReturn } from "../config"; // API functions
import { decodeJWT } from "../jwtConfig";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const CartDetails = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const username = decodeJWT().sub; // Fetch username directly

  // Shipping Information
  const [accountInfo, setAccountInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    phone: "123456789",
    address: "123 Main Street",
  });
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [editableAccountInfo, setEditableAccountInfo] = useState(accountInfo);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await viewCart(username);
        const formattedData = data.map((item) => ({
          id: item.cartID,
          name: item.bookID.bookTitle || "Unknown",
          price: item.bookID.bookPrice || 0,
          originalPrice: item.bookID.originalPrice || 0,
          discount: item.bookID.discount || 0,
          quantity: item.quantity,
          total: (item.bookID.bookPrice || 0) * (item.quantity || 1),
          image: item.bookID.image || "https://via.placeholder.com/50",
        }));
        setCartItems(formattedData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
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
    const fetchActivePromotions = async () => {
      try {
        const response = await fetchPromotions();
        const currentDate = new Date();
        const activePromotions = response.data.filter((promo) => {
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);
          return (
            startDate <= currentDate &&
            endDate >= currentDate &&
            promo.quantity > 0 &&
            promo.approveBy !== null
          );
        });
        setPromotions(activePromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    if (username) {
      fetchCart();
      fetchActivePromotions();
    } else {
      navigate("/auth/login");
    }
  }, [username, navigate]);

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
    return Math.round(finalTotal * discountRate);
  };

  const handlePurchase = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsEditingShipping(false);
  };

  const handleEditShipping = () => {
    setIsEditingShipping(true);
    setEditableAccountInfo(accountInfo); // Copy current account info
  };

  const handleSaveShipping = () => {
    setIsEditingShipping(false);
    setAccountInfo(editableAccountInfo); // Update the main account info
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          <div
            className="logo"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            Capybook
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BellOutlined
            style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
          />
          <ShoppingCartOutlined
            style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                  Profile
                </Menu.Item>
                <Menu.Item
                  key="signout"
                  onClick={() => navigate("/auth/login")}
                >
                  Logout
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: "#fff" }}
            >
              {username || "Login"}
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <Card title="Shopping Cart" style={{ width: "100%" }}>
          {cartItems.map((item) => (
            <Row key={item.id} align="middle" style={{ marginBottom: "10px" }}>
              <Col span={6}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <Text>{item.name}</Text>
              </Col>
              <Col span={4}>
                <Text>{item.originalPrice.toLocaleString()} VND</Text>
              </Col>
              <Col span={4}>
                <Text>{item.price.toLocaleString()} VND</Text>
              </Col>
              <Col span={4}>
                <Text>{item.quantity}</Text>
              </Col>
              <Col span={4}>
                <Text>{item.total.toLocaleString()} VND</Text>
              </Col>
            </Row>
          ))}
          <Divider />
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Col>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                Total amount: {calculateFinalTotal().toLocaleString()} VND
              </Text>
              <Button
                type="primary"
                style={{ marginLeft: "20px" }}
                onClick={handlePurchase}
              >
                Purchase
              </Button>
            </Col>
          </Row>
        </Card>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#343a40",
          padding: "10px 0",
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>

      <Modal
        title="Purchase Summary"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="80%"
      >
        <Card
          title="Shipping Information"
          extra={
            isEditingShipping ? (
              <Button type="primary" size="small" onClick={handleSaveShipping}>
                Save
              </Button>
            ) : (
              <Button type="link" size="small" onClick={handleEditShipping}>
                Edit
              </Button>
            )
          }
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
                <strong>Name:</strong> {accountInfo.firstName}{" "}
                {accountInfo.lastName}
              </p>
              <p>
                <strong>Phone:</strong> {accountInfo.phone}
              </p>
              <p>
                <strong>Address:</strong> {accountInfo.address}
              </p>
            </div>
          )}
        </Card>
        <Card title="Promotion" style={{ marginTop: "20px" }}>
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
        <Card title="Books" style={{ marginTop: "20px" }}>
          {cartItems.map((item) => (
            <Row key={item.id} align="middle" style={{ marginBottom: "10px" }}>
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
              Discounted Price: {calculateDiscountedTotal().toLocaleString()}{" "}
              VND
            </Text>
          </Row>
        )}
        <Row justify="end" style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            onClick={async () => {
              // Tính tổng tiền sau khi áp dụng giảm giá
              const finalPrice = calculateDiscountedTotal();
              console.log("Purchase confirmed!");
              console.log("Selected Promotion ID:", selectedPromotion);
              console.log("Final Total with Discount:", finalPrice.toLocaleString());

              // Gọi hàm handleCheckout với finalPrice
              const handleCheckout = async () => {
                console.log("Initiating checkout...");
                try {
                  // Tính tổng tiền và in ra log
                  console.log("Total amount for payment:", finalPrice);

                  // Gọi API tạo thanh toán
                  const response = await createPayment(finalPrice);
                  const paymentUrl = response.data;

                  // Chuyển hướng tới URL thanh toán
                  console.log("Redirecting to payment URL:", paymentUrl);
                  window.location.href = paymentUrl;
                } catch (error) {
                  // Xử lý lỗi
                  console.error("Error during checkout:", error.response?.data || error.message);
                  Modal.error({
                    content: 'Failed to initiate payment. Please try again.',
                  });
                }
              };

              // Thực thi hàm checkout
              await handleCheckout();
            }}
          >
            Purchase
          </Button>

        </Row>
      </Modal>
    </Layout>
  );
};

export default CartDetails;
