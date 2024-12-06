import React, { useState, useEffect } from "react";
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
import { fetchAccountDetail, fetchPromotions } from "../config";
import { decodeJWT } from "../jwtConfig";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy username từ decodeJWT
  const username = decodeJWT(localStorage.getItem("jwtToken"))?.sub;

  // State lưu thông tin khách hàng
  const [accountInfo, setAccountInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editableAddress, setEditableAddress] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [promotionMessage, setPromotionMessage] = useState("");
  const [cartItems, setCartItems] = useState(location.state?.bookData || []);
  const [promotions, setPromotions] = useState([]); // Danh sách khuyến mãi
  const [error, setError] = useState(null);

  // Fetch thông tin khách hàng
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        if (username) {
          const response = await fetchAccountDetail(username);
          setAccountInfo(response.data);
          setEditableAddress(response.data.address);
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Unable to fetch account details. Please try again later.");
      }
    };

    fetchAccountInfo();
  }, [username]);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchPromotionsData = async () => {
      try {
        const response = await fetchPromotions();
        console.log("Fetched Promotions:", response.data); // Thêm dòng này để in dữ liệu ra console
        setPromotions(response.data); // Lưu danh sách khuyến mãi vào state
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotionsData();
  }, []);

  // Tính tổng tiền
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.total, 0);

  // Lưu địa chỉ
  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    setAccountInfo((prev) => ({
      ...prev,
      address: editableAddress,
    }));

    console.log("Updated Address:", editableAddress);
    // Logic gọi API để cập nhật địa chỉ (nếu cần)
  };

  // Áp dụng mã khuyến mãi
  const handleApplyPromotion = () => {
    const today = new Date();

    // Tìm mã khuyến mãi hợp lệ từ danh sách khuyến mãi
    const matchedPromotion = promotions.find(
      (promo) =>
        promo.proCode === promotionCode &&
        new Date(promo.startDate) <= today &&
        new Date(promo.endDate) >= today &&
        promo.quantity > 0 &&
        promo.proStatus === 1 // Chỉ áp dụng mã khuyến mãi còn hiệu lực
    );

    if (matchedPromotion) {
      const discount = matchedPromotion.discount || 0; // Lấy giá trị giảm giá (%)
      const total = calculateTotal(); // Tổng tiền ban đầu
      const discountedTotal = total - (total * discount) / 100; // Tính tổng tiền sau giảm giá

      setPromotionMessage(
        `Promotion "${promotionCode}" applied successfully! You save ${discount}%. Total after discount: ${discountedTotal.toLocaleString()} VND`
      );
    } else {
      setPromotionMessage("Invalid or expired promotion code.");
    }
  };

  // Xử lý mua hàng
  const handlePurchase = () => {
    console.log("Purchase Confirmed!");
    console.log("Order Details:", {
      cartItems,
      customerInfo: accountInfo,
      totalPrice: calculateTotal(),
    });
    navigate("/");
  };

  // Kiểm tra nếu giỏ hàng rỗng
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
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <Card title="Order Summary">
          {/* Shipping Information */}
          <Card title="Shipping Information" style={{ marginBottom: "20px" }}>
            <div>
              <p>
                <strong>Name:</strong> {accountInfo.firstName}{" "}
                {accountInfo.lastName}
              </p>
              <p>
                <strong>Phone:</strong> {accountInfo.phone}
              </p>
              <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <strong>Address:</strong>
                {isEditingAddress ? (
                  <>
                    <Input
                      value={editableAddress}
                      onChange={(e) => setEditableAddress(e.target.value)}
                      style={{ flex: "1", maxWidth: "400px" }}
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleSaveAddress}
                    >
                      Save
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      onClick={() => {
                        setIsEditingAddress(false);
                        setEditableAddress(accountInfo.address);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span>{accountInfo.address}</span>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </p>
            </div>
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
          {/* Promotion */}
          <Card title="Apply Promotion" style={{ marginTop: "20px" }}>
            <Row
              align="middle"
              style={{ marginBottom: "10px", padding: "10px" }}
            >
              <Col span={18}>
                <Input
                  placeholder="Enter promotion code"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  onClick={handleApplyPromotion}
                  style={{ marginLeft: "10px" }}
                >
                  Apply
                </Button>
              </Col>
            </Row>
            {promotionMessage && (
              <Text
                type="success"
                style={{ marginTop: "10px", display: "block" }}
              >
                {promotionMessage}
              </Text>
            )}
          </Card>
          {/* Total Price */}
          <Divider />
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
              {promotionMessage ? (
                <>{promotionMessage}</>
              ) : (
                <>Total Books Price: {calculateTotal().toLocaleString()} VND</>
              )}
            </Text>
          </Row>
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handlePurchase}>
              Confirm Purchase
            </Button>
          </Row>
        </Card>
      </Content>
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
