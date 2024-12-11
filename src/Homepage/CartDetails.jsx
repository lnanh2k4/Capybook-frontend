import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Checkbox,
  Button,
  InputNumber,
  Row,
  Col,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { viewCart, updateCartItem, deleteCartItem } from "../config"; // API functions
import { decodeJWT } from "../jwtConfig";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

const CartDetails = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const username = decodeJWT().sub; // Fetch username directly

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await viewCart(username);
        const formattedData = data.map((item) => ({
          id: item.cartID,
          bookID: item.bookID?.bookID, // Không nên gán `null`, thay vào đó cần kiểm tra lỗi nếu thiếu
          name: item.bookID?.bookTitle || "Unknown",
          price: item.bookID?.bookPrice || 0,
          quantity: item.quantity,
          selected: false,
          total: (item.bookID.bookPrice || 0) * (item.quantity || 1),
          image: item.bookID.image || "https://via.placeholder.com/50",
          bookStatus: item.bookID.bookStatus,
          bookQuantity: item.bookID.bookQuantity || 0,
        }));
        setCartItems(formattedData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (username) {
      fetchCart();
    } else {
      navigate("/auth/login");
    }
  }, [username, navigate]);

  // Calculate total amount
  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) =>
        item.selected ? total + item.price * item.quantity : total,
      0
    );

  // Handle quantity change
  const handleQuantityChange = async (value, itemId) => {
    try {
      const item = cartItems.find((item) => item.id === itemId);

      if (item) {
        // Kiểm tra nếu số lượng chuyển về 0
        if (value === 0) {
          Modal.confirm({
            title: "Remove book from cart",
            content: `Are you sure you want to remove "${item.name}" from your cart?`,
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
              await handleDeleteItem(itemId); // Xóa sách khỏi giỏ hàng
            },
          });
          return;
        }

        // Cập nhật số lượng nếu hợp lệ
        if (value > item.stockQuantity) {
          alert(`You can only order up to ${item.stockQuantity} items.`);
          return;
        }
        if (value < 1) {
          alert("Quantity cannot be less than 1.");
          return;
        }

        console.log("Updating cart item with:", {
          username,
          id: item.id,
          quantity: value,
        });

        await updateCartItem(username, item.id, value);

        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: value, total: value * item.price }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  // Handle select item
  const handleSelectItem = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.id === itemId);
      if (item) {
        await deleteCartItem(username, item.id);
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  // Handle select all items
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: isChecked }))
    );
  };
  const handleDashboardClick = () => {
    navigate("/dashboard/income-statistic");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const userMenu = () => {
    if (decodeJWT()) {
      return (
        <Menu>
          {decodeJWT().scope != "CUSTOMER" ? (
            <Menu.Item
              key="dashboard"
              icon={<AppstoreOutlined />}
              onClick={handleDashboardClick}
            >
              Dashboard
            </Menu.Item>
          ) : (
            <Menu.Item
              key="profile"
              icon={<AppstoreOutlined />}
              onClick={() => {
                navigate("/profile");
              }}
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
    } else navigate("/auth/login");
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
          <Button
            type="text"
            icon={
              <BellOutlined
                style={{
                  fontSize: "24px",
                  marginRight: "20px",
                  color: "#fff",
                }}
              />
            }
            style={{ color: "#fff" }}
          ></Button>
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
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <Card title="Shopping Cart" style={{ width: "100%" }}>
          <Row
            align="middle"
            style={{
              backgroundColor: "#1E90FF",
              padding: "10px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            <Col span={1}>
              <Checkbox
                onChange={handleSelectAll}
                checked={cartItems.every((item) => item.selected)}
              />
            </Col>
            <Col span={6}>
              <Text style={{ color: "#fff" }}>Product</Text>
            </Col>
            <Col span={4}>
              <Text style={{ color: "#fff" }}>Quantity</Text>
            </Col>
            <Col span={4}>
              <Text style={{ color: "#fff" }}>Price</Text>
            </Col>
            <Col span={4}>
              <Text style={{ color: "#fff" }}>Total</Text>
            </Col>
            <Col span={1}></Col>
          </Row>
          <Divider style={{ margin: 0 }} />
          {cartItems.map((item) => (
            <Row
              key={item.id}
              align="middle"
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #e8e8e8",
                backgroundColor:
                  item.bookStatus === 0 ? "#f8d7da" : "transparent", // Màu nền nếu không khả dụng
              }}
            >
              <Col span={1}>
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleSelectItem(item.id)}
                  disabled={item.bookStatus === 0} // Không cho chọn sản phẩm
                />
              </Col>
              <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                    opacity: item.bookStatus === 0 ? 0.5 : 1, // Làm mờ nếu không khả dụng
                  }}
                />
                <Text delete={item.bookStatus === 0}>{item.name}</Text>
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={item.bookQuantity}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(value, item.id)}
                  style={{ width: "80px" }}
                  disabled={item.bookStatus === 0} // Không cho thay đổi số lượng
                />
              </Col>
              <Col span={4}>
                <Text>{item.price.toLocaleString()} VND</Text>
              </Col>
              <Col span={4}>
                <Text>{item.total.toLocaleString()} VND</Text>
              </Col>
              <Col span={1}>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteItem(item.id)}
                />
              </Col>
              {item.bookStatus === 0 && (
                <Col span={24}>
                  <Text type="danger">
                    This product is unavailable or has been removed.
                  </Text>
                </Col>
              )}
            </Row>
          ))}

          <Divider />
          <Row justify="end" style={{ marginTop: "20px" }}>
            <Col>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                Total amount: {calculateTotal().toLocaleString()} VND
              </Text>

              <Button
                type="primary"
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  const selectedBooks = cartItems
                    .filter((item) => item.selected) // Lọc sách được chọn
                    .map((item) => ({
                      bookID: item.bookID, // Thêm bookID vào đối tượng
                      bookTitle: item.name,
                      quantity: item.quantity,
                      price: item.price,
                      total: item.total,
                      image: item.image,
                    }));
                  console.log("Data being sent to OrderPage from CartDetail:");
                  console.log({ bookData: selectedBooks });
                  if (selectedBooks.length === 0) {
                    alert("Please select at least one book to purchase.");
                    return;
                  }

                  navigate("/OrderPage", {
                    state: { bookData: selectedBooks },
                  });
                }}
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

export default CartDetails;
