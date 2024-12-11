import React, { useState } from "react";
import { Modal, Button, InputNumber, Table, Typography, Tag } from "antd";
import { ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { addBookToCart } from "../config";
import { useNavigate } from "react-router-dom";

const AddBookToCart = ({ username, bookId, bookData }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleShowCart = () => {
    setIsModalVisible(false);
    navigate("/cart/ViewDetail");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddToCart = async () => {
    if (quantity > bookData.bookQuantity) {
      Modal.error({
        title: "Insufficient Stock",
        content: `Only ${bookData.bookQuantity} items are available in stock.`,
      });
      return;
    }

    try {
      await addBookToCart(username, bookId, quantity);
      const existingItemIndex = cartItems.findIndex((item) => item.key === bookId);

      if (existingItemIndex >= 0) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].total =
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
        setCartItems(updatedItems);
      } else {
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
        setCartItems((prevItems) => [...prevItems, newCartItem]);
      }

      setIsModalVisible(true);
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Failed to add book to cart. Please try again.",
      });
    }
  };

  const handleCheckout = () => {
    navigate("/OrderPage", {
      state: {
        bookData: [
          {
            bookID: parseInt(bookId, 10),
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
          {record.discount > 0 && (
            <>
              <br />
              <Typography.Text delete style={{ color: "#999" }}>
                {record.originalPrice.toLocaleString()}đ
              </Typography.Text>
              <Tag color="volcano" style={{ marginLeft: 5 }}>
                -{record.discount}%
              </Tag>
            </>
          )}
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
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          type="primary"
          style={{
            width: "150px",
            height: "45px",
            backgroundColor: bookData.bookQuantity === 0 ? "#d9d9d9" : "#FF4500",
            borderColor: bookData.bookQuantity === 0 ? "#d9d9d9" : "#FF4500",
            fontWeight: "bold",
            color: bookData.bookQuantity === 0 ? "#999" : "#fff",
          }}
          onClick={handleCheckout}
          disabled={bookData.bookQuantity === 0}
        >
          Buy now
        </Button>

        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Quantity</div>
          <InputNumber
            min={1}
            max={bookData.bookQuantity}
            defaultValue={1}
            value={quantity}
            onChange={(value) => {
              setQuantity(value);
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
          }}
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={bookData.bookQuantity === 0}
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
                  {cartItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}đ
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
          }}
        >
          <Typography.Text strong style={{ fontSize: "16px" }}>
            Cart Subtotal: {cartItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}đ
          </Typography.Text>
          <Button onClick={handleShowCart}>Go to Cart</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddBookToCart;
