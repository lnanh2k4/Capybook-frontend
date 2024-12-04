import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Descriptions, Button, Table, message, Card } from "antd";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
  fetchOrderDetail,
  fetchAccountDetail,
  fetchBookDetail,
  fetchPromotionDetail,
} from "../config";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [phone, setPhone] = useState(""); // State lưu phone

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch order details
          const orderData = await fetchOrderDetail(id);
          console.log("Order Data:", orderData.data);
          setOrder(orderData.data);

          // Fetch account to get phone number
          const username = orderData?.data?.order?.username;
          if (username) {
            const accountData = await fetchAccountDetail(username);
            console.log("Account Data:", accountData.data);
            setPhone(accountData.data.phone || "N/A");
          }

          // Fetch order details data
          const orderDetailsData = orderData.data.orderDetails;
          console.log("Order Details Data:", orderDetailsData);

          const bookIDs = orderDetailsData.map((item) => item.bookID);
          const bookPromises = bookIDs.map((bookID) => fetchBookDetail(bookID));
          const bookResponses = await Promise.all(bookPromises);
          const books = bookResponses.map((res) => res.data);
          console.log("Fetched Book Data:", books);

          const updatedOrderDetails = orderDetailsData.map((item) => {
            const book = books.find((book) => book.bookID === item.bookID);
            return {
              ...item,
              book: book || {},
            };
          });

          console.log("Updated Order Details:", updatedOrderDetails);
          setOrderDetails(updatedOrderDetails);

          // Fetch promotion details if applicable
          const proID = orderData.data.order?.proID;
          if (proID) {
            const promotionData = await fetchPromotionDetail(proID);
            console.log("Promotion Data:", promotionData.data);
            setOrder((prevOrder) => ({
              ...prevOrder,
              discount: promotionData.data.discount,
            }));
          }
        } catch (error) {
          message.error("Failed to fetch data");
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Book ID",
      dataIndex: "bookID",
      key: "bookID",
      render: (text, record) => record.bookID || "N/A",
    },
    {
      title: "Title",
      dataIndex: ["book", "bookTitle"],
      key: "bookTitle",
      render: (text, record) => (record.book ? record.book.bookTitle : "N/A"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      render: (_, record) => {
        const unitPrice =
          record.totalPrice && record.quantity
            ? (record.totalPrice / record.quantity).toFixed(2)
            : "N/A";
        return `$${unitPrice}`;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price || 0}`,
    },
  ];

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div
        className="dashboard-content"
        style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <Card
          title="Order Management - View Order Detail"
          style={{ marginBottom: "30px", padding: "20px" }}
        >
          <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
            <Descriptions.Item label="Customer Name">
              {order.order.username}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">{phone}</Descriptions.Item>
            <Descriptions.Item label="Address">
              {order.order.orderAddress || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Table
            columns={columns}
            dataSource={orderDetails}
            rowKey={(record) => record.book?.bookID || record.ODID}
            pagination={false}
            style={{ marginTop: "20px" }}
          />

          <Descriptions title="Summary" bordered style={{ marginTop: "20px" }}>
            <Descriptions.Item label="Total Books Price" span={3}>
              $
              {orderDetails
                .reduce(
                  (acc, item) =>
                    acc + item.quantity * (item.book?.bookPrice || 0),
                  0
                )
                .toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Discount (%)" span={3}>
              {order.discount || 0}%
            </Descriptions.Item>
            <Descriptions.Item label="Total Price" span={3}>
              $
              {(
                orderDetails.reduce(
                  (acc, item) =>
                    acc + item.quantity * (item.book?.bookPrice || 0),
                  0
                ) *
                (1 - (order.discount || 0) / 100)
              ).toFixed(2)}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Button type="primary" onClick={() => navigate(-1)}>
              Back to Order Management
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
