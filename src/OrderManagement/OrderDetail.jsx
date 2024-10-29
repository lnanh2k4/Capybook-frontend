import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy id từ URL
import { Descriptions, Button, Table, message, Card } from "antd"; // Sử dụng Descriptions, Table và Card từ Ant Design
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { fetchOrderDetail, fetchOrderDetailsByOrderID } from "../config"; // Import hàm API để fetch dữ liệu OrderDetail

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const [order, setOrder] = useState(null); // Thông tin đơn hàng chính
  const [orderDetails, setOrderDetails] = useState([]); // Danh sách các sản phẩm trong đơn hàng

  // useEffect để fetch dữ liệu đơn hàng khi component được render
  useEffect(() => {
    if (id) {
      fetchOrderDetail(id)
        .then((data) => {
          setOrder(data);
        })
        .catch((error) => {
          message.error("Failed to fetch order details");
          console.error("Error fetching order details:", error);
        });

      // Fetch order details bằng orderID
      fetchOrderDetailsByOrderID(id)
        .then((response) => {
          // Kiểm tra nếu response trả về không phải là mảng, gán mảng trống
          if (Array.isArray(response.data)) {
            setOrderDetails(response.data);
          } else {
            setOrderDetails([]); // Gán mảng trống nếu không phải là mảng
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            message.error("Order not found.");
          } else {
            message.error("Failed to fetch order items.");
          }
        });
    }
  }, [id]);

  // Nếu dữ liệu chưa được tải về, hiển thị loading
  if (!order) {
    return <div>Loading...</div>;
  }

  // Tính tổng giá tiền từ các OrderDetail
  const totalBooksPrice = Array.isArray(orderDetails)
    ? orderDetails.reduce(
        (acc, item) => acc + item.quantity * item.bookID.bookPrice,
        0
      )
    : 0;

  const totalPrice = totalBooksPrice - (order.discount || 0);

  // Hàm xử lý khi nhấn nút Back
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  // Cấu trúc cột cho bảng hiển thị sách
  const columns = [
    {
      title: "Book No",
      dataIndex: ["bookID", "bookID"],
      key: "bookID.bookID",
    },
    {
      title: "Book Title",
      dataIndex: ["bookID", "bookTitle"],
      key: "bookID.bookTitle",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: ["bookID", "bookPrice"],
      key: "bookID.bookPrice",
      render: (price) => `$${price}`,
    },
    {
      title: "Final Price",
      key: "finalPrice",
      render: (_, record) => `$${record.quantity * record.bookID.bookPrice}`,
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
          headStyle={{ fontSize: "20px", textAlign: "center" }}
        >
          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
            <div style={{ flex: "1", maxWidth: "100%" }}>
              <Descriptions
                bordered
                column={1}
                layout="horizontal"
                style={{ marginBottom: "20px" }} // Giãn phần mô tả với khoảng cách
                labelStyle={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  paddingBottom: "10px",
                }} // Tăng kích thước font chữ cho label
                contentStyle={{
                  fontSize: "14px",
                  paddingBottom: "10px",
                  textAlign: "right",
                }} // Tăng kích thước font chữ cho nội dung và canh phải
              >
                <Descriptions.Item
                  label="Customer Name"
                  contentStyle={{ textAlign: "left" }}
                >
                  {order.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Address" contentStyle={{ textAlign: "left" }}>
                  {order.address}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number" contentStyle={{ textAlign: "left" }}>
                  {order.phoneNumber}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          {/* Bảng danh sách sách trong đơn hàng */}
          <Table
            columns={columns}
            dataSource={orderDetails}
            rowKey={(record) => record.bookID.bookID}
            pagination={false}
            style={{ marginTop: "20px" }}
          />

          {/* Tổng cộng */}
          <Descriptions title="Summary" bordered style={{ marginTop: "20px" }}>
            <Descriptions.Item label="Total Books Price" span={3}>
              ${totalBooksPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Discount" span={3}>
              - ${order.discount || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price" span={3}>
              ${totalPrice}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Button type="primary" onClick={handleBack}>
              Back to Order Management
            </Button>
          </div>
        </Card>
      </div>

      <div
        className="copyright"
        style={{ textAlign: "center", paddingTop: "10px" }}
      >
        <div>© {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default OrderDetail;
