import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, message, Tag } from "antd"; // Import Ant Design components
import { fetchOrders, searchOrders, deleteOrder, fetchOrderDetail   } from "../config"; // Import các hàm API
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const OrderManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Sử dụng để lưu giá trị tìm kiếm
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tất cả các đơn hàng khi lần đầu vào trang
 useEffect(() => {
  setLoading(true);
  fetchOrders()
    .then((response) => {
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Expected an array but got", response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  // Hàm thực hiện khi nhấn nút search
  const handleSearch = (value) => {
    if (!value) {
      // Nếu không có giá trị tìm kiếm, fetch lại tất cả các đơn hàng
      fetchOrders()
        .then((response) => {
          if (Array.isArray(response.data)) {
            const activeOrders = response.data.filter(
              (order) => order.orderStatus === 1
            );
            setOrders(activeOrders);
          } else {
            console.error("Expected an array but got", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          message.error("Failed to fetch orders");
        })
        .finally(() => setLoading(false));
    } else {
      // Thực hiện tìm kiếm với searchTerm
      setLoading(true);
      searchOrders(value) // Gọi API tìm kiếm với giá trị searchTerm
        .then((response) => {
          if (Array.isArray(response.data)) {
            const activeOrders = response.data.filter(
              (order) => order.orderStatus === 1
            );
            setOrders(activeOrders);
          } else {
            console.error("Expected an array but got", response.data);
          }
        })
        .catch((error) => {
          console.error("Error searching orders:", error);
          message.error("Failed to search orders");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleDelete = async (orderID) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        // Soft delete by setting orderStatus to 0
        await deleteOrder(orderID);
        setOrders(orders.filter((order) => order.orderID !== orderID));
        message.success("Order deleted successfully");
      } catch (error) {
        console.error("Error deleting order:", error);
        message.error("Failed to delete order");
      }
    }
  };
////
  const goToAddOrder = () => {
    navigate("/dashboard/orders/add");
  };

  const goToEditOrder = (orderID) => {
    navigate(`/dashboard/orders/edit${orderID}`);
  };

  const goToOrderDetail = (orderID) => {
  fetchOrderDetail(orderID)
    .then(response => {
      console.log("Order detail:", response.data);
      navigate(`/dashboard/orders/detail/${orderID}`);
    })
    .catch(error => {
      console.error("Error fetching order detail:", error);
      message.error("Failed to fetch order detail");
    });
};



  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.orderStatus === 1 ? "green" : "red"}>
          {record.orderStatus === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => goToOrderDetail(record.orderID)}>
            Detail
          </Button>
          <Button type="link" onClick={() => goToEditOrder(record.orderID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.orderID)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="main-container">
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      <div className="dashboard-content">
        <div className="titlemanagement">
          <h1>Order Management</h1>
        </div>

        <div
          className="action-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Button type="primary" onClick={goToAddOrder}>
            Add Order
          </Button>
          <Search
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Lưu giá trị nhập vào searchTerm
            onSearch={handleSearch} // Thực hiện tìm kiếm khi nhấn vào icon search
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderID"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
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
