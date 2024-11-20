import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Descriptions, Button, Table, message, Card } from "antd";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { fetchOrderDetail, fetchAccountDetail, fetchBookDetail, fetchPromotionDetail } from "../config";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    if (id) {
      try {
        const orderData = await fetchOrderDetail(id);
        console.log("Order Data:", orderData.data);
        setOrder(orderData.data);

        const username = orderData?.data?.order?.username;
        if (username) {
          const userData = await fetchAccountDetail(username);
          console.log("User Data:", userData.data);
          setUser(userData.data);
        }

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



  if (!order || !user) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Book ID",
      dataIndex: ["book", "bookID"],
      key: "bookID",
      render: (text, record) => (record.book ? record.book.bookID : "N/A"),
    },
    {
      title: "Title",
      dataIndex: ["book", "bookTitle"],
      key: "bookTitle",
      render: (text, record) => (record.book ? record.book.bookTitle : "N/A"),
    },
    {
      title: "Author",
      dataIndex: ["book", "author"],
      key: "author",
      render: (text, record) => (record.book ? record.book.author : "N/A"),
    },
    {
      title: "Publisher",
      dataIndex: ["book", "publisher"],
      key: "publisher",
      render: (text, record) => (record.book ? record.book.publisher : "N/A"),
    },
    {
      title: "Year",
      dataIndex: ["book", "publicationYear"],
      key: "publicationYear",
      render: (text, record) => (record.book ? record.book.publicationYear : "N/A"),
    },
    {
      title: "ISBN",
      dataIndex: ["book", "isbn"],
      key: "isbn",
      render: (text, record) => (record.book ? record.book.isbn : "N/A"),
    },
    {
      title: "Unit Price",
      dataIndex: ["book", "bookPrice"],
      key: "bookPrice",
      render: (price) => `$${price || 0}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Final Price",
      key: "finalPrice",
      render: (_, record) => `$${record.quantity * (record.book?.bookPrice || 0)}`,
    },
  ];

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card title="Order Management - View Order Detail" style={{ marginBottom: "30px", padding: "20px" }}>
          <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
            <Descriptions.Item label="Customer Name">{user.firstName} {user.lastName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
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
    ${orderDetails.reduce((acc, item) => acc + item.quantity * (item.book?.bookPrice || 0), 0).toFixed(2)}
  </Descriptions.Item>
  <Descriptions.Item label="Discount (%)" span={3}>
    {order.discount || 0}%
  </Descriptions.Item>
  <Descriptions.Item label="Total Price" span={3}>
    ${(
      orderDetails.reduce((acc, item) => acc + item.quantity * (item.book?.bookPrice || 0), 0) *
      (1 - (order.discount || 0) / 100)
    ).toFixed(2)}
  </Descriptions.Item>
</Descriptions>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Button type="primary" onClick={() => navigate(-1)}>Back to Order Management</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
