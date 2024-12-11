import React, { useState } from "react";
import { Modal, Button, InputNumber, Table, Typography, Tag } from "antd";
import {
  ShoppingCartOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { addBookToCart, createPayment } from "../config";
import { useNavigate } from "react-router-dom";

const AddBookToCart = ({ username, bookId, bookData }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Kiểm tra giá trị props truyền vào
  console.log("Username:", username);
  console.log("Book ID:", bookId);
  console.log("Book Data:", bookData);

  const handleShowCart = () => {
    setIsModalVisible(false);
    console.log("Navigating to cart page...");
    navigate("/cart/ViewDetail");
  };

  const handleCancel = () => {
    console.log("Modal closed");
    setIsModalVisible(false);
  };

  const handleAddToCart = async () => {
    console.log("Adding book to cart with the following details:");
    console.log("Username:", username);
    console.log("Book ID:", bookId);
    console.log("Quantity:", quantity);

    try {
      await addBookToCart(username, bookId, quantity);

      console.log("API call successful. Updating cart items...");
      const newCartItem = {
        key: bookId,
        name: bookData.bookTitle,
        price: bookData.bookPrice || 0,
        originalPrice: bookData.originalPrice || 0,
        discount: bookData.discount || 0,
        quantity: quantity,
        total: quantity * (bookData.bookPrice || 0),
        image: bookData.image || "https://via.placeholder.com/50",
      };

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.key === bookId
        );
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity = quantity;
          updatedItems[existingItemIndex].total =
            updatedItems[existingItemIndex].quantity *
            updatedItems[existingItemIndex].price;
          return updatedItems;
        } else {
          return [...prevItems, newCartItem];
        }
      });

      console.log("Book added to cart successfully. Showing modal...");
      setIsModalVisible(true);
    } catch (error) {
      console.error(
        "Error adding book to cart:",
        error.response?.data || error.message
      );
      Modal.error({
        content: "Failed to add book to cart. Please try again.",
      });
    }
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout with the following book details:");
    console.log("Book Data:", bookData);
    console.log("Quantity:", quantity);

    if (quantity <= 0 || bookData.bookQuantity < quantity) {
      Modal.error({
        title: "Invalid Quantity",
        content: "Please select a valid quantity before proceeding.",
      });
      return;
    }

    navigate("/OrderPage", {
      state: {
        bookData: [
          {
            bookID: bookId,
            bookTitle: bookData.bookTitle,
            price: bookData.bookPrice,
            quantity: quantity,
            total: quantity * bookData.bookPrice,
            image: bookData.image,
          },
        ],
      },
    });
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.image}
            alt={text}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <Typography.Text>{text}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div>
          <Typography.Text>{text.toLocaleString()}đ</Typography.Text>
          <br />
          <Typography.Text delete style={{ color: "#999" }}>
            {record.originalPrice.toLocaleString()}đ
          </Typography.Text>
          <Tag color="volcano" style={{ marginLeft: 5 }}>
            -{record.discount}%
          </Tag>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <Typography.Text>{total.toLocaleString()}đ</Typography.Text>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          style={{
            width: "150px",
            height: "45px",
            backgroundColor:
              bookData.bookQuantity === 0 ? "#d9d9d9" : "#FF4500",
            borderColor: bookData.bookQuantity === 0 ? "#d9d9d9" : "#FF4500",
            fontWeight: "bold",
            color: bookData.bookQuantity === 0 ? "#999" : "#fff",
            cursor: bookData.bookQuantity === 0 ? "not-allowed" : "pointer",
          }}
          onClick={handleCheckout}
          disabled={bookData.bookQuantity === 0} // Vô hiệu hóa nếu hết sách
        >
          Buy now
        </Button>

        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Quantity
          </div>
          <InputNumber
            min={1}
            max={bookData.bookQuantity} // Giới hạn tối đa bằng số lượng trong kho
            defaultValue={1}
            value={quantity}
            style={{ width: "60px" }}
            onChange={(value) => {
              if (value > bookData.bookQuantity) {
                Modal.warning({
                  title: "Exceeds Stock Quantity",
                  content: `Only ${bookData.bookQuantity} items are available in stock.`,
                });
                setQuantity(bookData.bookQuantity); // Đặt lại số lượng về tối đa
              } else {
                console.log("Quantity changed to:", value);
                setQuantity(value);
              }
            }}
          />
        </div>

        <Button
          style={{
            width: "150px",
            height: "45px",
            borderColor: bookData.bookQuantity === 0 ? "#d9d9d9" : "#FF4500",
            color: bookData.bookQuantity === 0 ? "#999" : "#FF4500",
            fontWeight: "bold",
            cursor: bookData.bookQuantity === 0 ? "not-allowed" : "pointer",
          }}
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={bookData.bookQuantity === 0} // Chuyển thành không nhấn được nếu quantity = 0
        >
          Add to cart
        </Button>
      </div>

      <Modal
        title={
          <Typography.Text strong style={{ fontSize: "16px" }}>
            Added to cart
          </Typography.Text>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "20px", marginRight: "10px" }}
          />
          <Typography.Text style={{ fontSize: "14px", color: "#666" }}>
            Book added to cart successfully!
          </Typography.Text>
        </div>
        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}>
                <Typography.Text strong>Total:</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>
                  {cartItems
                    .reduce((acc, item) => acc + item.total, 0)
                    .toLocaleString()}
                  đ
                </Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            marginBottom: "20px",
          }}
        >
          <Typography.Text strong style={{ fontSize: "16px" }}>
            Cart Subtotal:{" "}
            {cartItems
              .reduce((acc, item) => acc + item.total, 0)
              .toLocaleString()}
            đ
          </Typography.Text>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button onClick={handleShowCart}>Go to Cart</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBookToCart;
