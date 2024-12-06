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
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
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
        console.log("Cart Data:", data); // Remove unused bookId, quantity
        const formattedData = data.map((item) => ({
          id: item.cartID,

          name: item.bookID.bookTitle || "Unknown",
          price: item.bookID.bookPrice || 0,
          originalPrice: item.bookID.originalPrice || 0,
          discount: item.bookID.discount || 0,
          quantity: item.quantity,
          selected: false,
          total: (item.bookID.bookPrice || 0) * (item.quantity || 1),
          image: item.bookID.image || "https://via.placeholder.com/50",
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
      const item = cartItems.find((item) => item.id === itemId); // Sử dụng `id`
      if (item) {
        console.log("Updating cart item with:", {
          username,
          id: item.id,
          quantity: value,
        });
        await updateCartItem(username, item.id, value); // Sử dụng `item.id`
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

  // Handle delete item
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
              }}
            >
              <Col span={1}>
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleSelectItem(item.id)}
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
                  }}
                />
                <Text>{item.name}</Text>
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(value, item.id)}
                  style={{ width: "80px" }}
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
                      bookTitle: item.name,
                      quantity: item.quantity,
                      price: item.price,
                      total: item.total,
                      image: item.image,
                    }));

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
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>
    </Layout>
  );
};

export default CartDetails;
