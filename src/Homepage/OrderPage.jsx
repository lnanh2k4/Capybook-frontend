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
  Table,
  Modal,
} from "antd";
import {
  fetchAccountDetail,
  fetchPromotions,
  createPayment,
  fetchBookById,
} from "../config";
import { decodeJWT } from "../jwtConfig";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy username từ decodeJWT
  const username = decodeJWT(localStorage.getItem("jwtToken"))?.sub;
  // Lấy dữ liệu từ `location.state`
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
  const [discountedTotal, setDiscountedTotal] = useState(null); // Tổng tiền sau giảm giá

  // Fetch thông tin khách hàng
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        if (username) {
          const response = await fetchAccountDetail(username);
          setAccountInfo(response.data);
          setEditableAddress(response.data.address); // Cập nhật địa chỉ có thể chỉnh sửa
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
    console.log(username);
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
    // Lấy ngày hiện tại và cộng thêm 1 ngày
    const today = new Date();
    today.setDate(today.getDate() + 1); // Cộng thêm 1 ngày

    console.log("Modified Today Date:", today); // Debug

    // Tìm mã khuyến mãi hợp lệ từ danh sách khuyến mãi
    const matchedPromotion = promotions.find(
      (promo) =>
        promo.proCode === promotionCode &&
        new Date(promo.startDate) <= today && // So sánh với ngày đã chỉnh sửa
        new Date(promo.endDate) >= today && // So sánh với ngày đã chỉnh sửa
        promo.quantity > 0 &&
        promo.proStatus === 1 // Chỉ áp dụng mã khuyến mãi còn hiệu lực
    );

    if (matchedPromotion) {
      const discount = matchedPromotion.discount || 0; // Lấy giá trị giảm giá (%)
      const total = calculateTotal(); // Tổng tiền ban đầu
      const discountedTotal = total - (total * discount) / 100; // Tính tổng tiền sau giảm giá

      // Cập nhật tổng tiền giảm giá
      setDiscountedTotal(discountedTotal);

      setPromotionMessage(
        `Promotion "${promotionCode}" applied successfully! You save ${discount}%. Total after discount: ${discountedTotal.toLocaleString()} VND`
      );
    } else {
      setPromotionMessage("Invalid or expired promotion code.");
      setDiscountedTotal(null); // Không áp dụng giảm giá
    }
  };

  const checkBookQuantities = async () => {
    try {
      for (const item of cartItems) {
        console.log("Checking book:", item.bookID);
        const response = await fetchBookById(item.bookID);
        const availableQuantity = response.data.bookQuantity;

        console.log(
          `Book ID: ${item.bookID}, Available: ${availableQuantity}, Requested: ${item.quantity}`
        );

        if (availableQuantity < item.quantity) {
          Modal.warning({
            title: "Insufficient Quantity",
            content:
              "The book quantity is not sufficient. Please check your cart.",
            onOk: () => navigate("/cart/ViewDetail"), // Điều hướng về giỏ hàng
          });
          return false; // Không đủ sách, trả về false
        }
      }
      return true; // Đủ sách, trả về true
    } catch (error) {
      console.error("Error checking book quantity:", error);
      Modal.error({
        title: "Error",
        content: "Unable to check book quantity. Please try again later.",
      });
      return false;
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

  const handleCheckout = async () => {
    const canPurchase = await checkBookQuantities(); // Gọi hàm kiểm tra
    if (!canPurchase) return; // Dừng lại nếu không đủ sách

    try {
      const totalAmount =
        discountedTotal !== null ? discountedTotal : calculateTotal();

      const order = {
        customerInfo: accountInfo,
        cartItems: cartItems.map((item) => ({
          bookID: item.bookID,
          quantity: item.quantity,
          total: item.total,
        })),
        promotion: promotions.find((promo) => promo.proCode === promotionCode),
        totalAmount,
      };

      localStorage.setItem("orderData", JSON.stringify(order));

      const response = await createPayment(totalAmount);
      const paymentUrl = response.data;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      Modal.error({
        content: "Failed to initiate payment. Please try again.",
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
            <Table
              dataSource={cartItems}
              rowKey={(record) => record.bookID}
              pagination={false}
              columns={[
                {
                  title: "Image",
                  dataIndex: "image",
                  key: "image",
                  render: (image) => (
                    <img
                      src={image || "https://via.placeholder.com/80"}
                      alt="Book"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  ),
                },
                {
                  title: "Title",
                  dataIndex: "bookTitle",
                  key: "bookTitle",
                  render: (text) => (
                    <Text style={{ fontSize: "16px" }}>{text}</Text>
                  ),
                },
                {
                  title: "Unit Price",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `${price.toLocaleString()} VND`,
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                  render: (quantity) => <Text>{quantity}</Text>,
                },
                {
                  title: "Total Price",
                  dataIndex: "total",
                  key: "total",
                  render: (total) => `${total.toLocaleString()} VND`,
                },
              ]}
            />
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
              Total Books Price:{" "}
              {discountedTotal !== null
                ? discountedTotal.toLocaleString()
                : calculateTotal().toLocaleString()}{" "}
              VND
            </Text>
          </Row>

          <Row justify="end" style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handleCheckout}>
              Confirm Purchase
            </Button>
          </Row>
        </Card>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#343a40",
          padding: "10px 0",
          bottom: 0,
          position: "sticky",
          width: "100%",
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>
    </Layout>
  );
};

export default OrderPage;
