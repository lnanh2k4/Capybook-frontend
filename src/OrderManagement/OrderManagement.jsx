import React, { useState } from "react";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      fullName: "John Doe",
      orderDate: "2024-10-01",
      orderPrice: 15000,
      orderStatus: "Pending",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      orderDate: "2024-09-28",
      orderPrice: 20000,
      orderStatus: "Shipped",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const handleDetail = (id) => {
    // Điều hướng đến trang chi tiết kèm theo id
    navigate(`/order-detail/${id}`);
  };

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const filteredOrders = orders.filter((order) =>
    order.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="titlemanagement">
        <div>Order Management</div>
      </div>
      <div className="table-container">
        <div className="action-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Full Name..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Order Date</th>
              <th>Order Price</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.fullName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.orderPrice.toFixed(2)} VND</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="detail"
                        onClick={() => handleDetail(order.id)}
                      >
                        Detail
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default OrderManagement;
