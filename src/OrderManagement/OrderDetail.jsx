import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy id từ URL
import "./OrderDetail.css";
import DashboardContainer from "../DashBoardContainer.jsx";
const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const [order, setOrder] = useState(null);

  // Hàm để fetch dữ liệu đơn hàng dựa trên id
  const fetchOrderDetail = async (orderId) => {
    // Thay bằng API thực để lấy dữ liệu từ server
    const fetchedOrder = {
      id: orderId,
      customerName: "John Doe",
      address: "123 Main Street, City, Country",
      phoneNumber: "123-456-7890",
      books: [
        {
          bookNo: 1,
          image: "https://via.placeholder.com/50",
          title: "Book 1",
          quantity: 2,
          unitPrice: 10,
          finalPrice: 20,
        },
        {
          bookNo: 2,
          image: "https://via.placeholder.com/50",
          title: "Book 2",
          quantity: 1,
          unitPrice: 15,
          finalPrice: 15,
        },
      ],
      discount: 5,
    };

    return fetchedOrder;
  };

  // useEffect để fetch dữ liệu đơn hàng khi component được render
  useEffect(() => {
    if (id) {
      fetchOrderDetail(id).then((data) => {
        setOrder(data);
      });
    }
  }, [id]);

  // Nếu dữ liệu chưa được tải về, hiển thị loading
  if (!order) {
    return <div>Loading...</div>;
  }

  const totalBooksPrice = order.books.reduce(
    (acc, book) => acc + book.finalPrice,
    0
  );
  const totalPrice = totalBooksPrice - order.discount;

  // Hàm xử lý khi nhấn nút Back
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="order-detail-container">
      <DashboardContainer />

      {/* Nút Back */}
      <button className="back-button" onClick={handleBack}>
        &#8592; Back
      </button>

      <h1>Order Detail for ID: {id}</h1>

      {/* Thông tin người đặt hàng */}
      <div className="customer-info">
        <p>
          <strong>Full Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
        <p>
          <strong>Phone Number:</strong> {order.phoneNumber}
        </p>
      </div>

      {/* Bảng danh sách các cuốn sách */}
      <table className="book-table">
        <thead>
          <tr>
            <th>Book No</th>
            <th>Image</th>
            <th>Book Title</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Final Price</th>
          </tr>
        </thead>
        <tbody>
          {order.books.map((book) => (
            <tr key={book.bookNo}>
              <td>{book.bookNo}</td>
              <td>
                <img src={book.image} alt={book.title} />
              </td>
              <td>{book.title}</td>
              <td>{book.quantity}</td>
              <td>${book.unitPrice}</td>
              <td>${book.finalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng cộng và giảm giá */}
      <div className="summary">
        <p>
          <strong>Total Books Price:</strong> ${totalBooksPrice}
        </p>
        <p>
          <strong>Discount:</strong> ${order.discount}
        </p>
        <p>
          <strong>Total Price:</strong> ${totalPrice}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
