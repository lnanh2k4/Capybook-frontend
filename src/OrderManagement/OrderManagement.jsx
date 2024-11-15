import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, Modal, message, Tag, Select } from "antd";
import { fetchOrders, searchOrders, updateOrder, deleteOrder } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        setLoading(true);
        fetchOrders()
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                    setError("");
                } else {
                    setError("Failed to fetch orders");
                }
            })
            .catch((error) => {
                setError("Failed to fetch orders");
                message.error("Failed to fetch orders");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = (value) => {
        setSearchKey(value);
        setLoading(true);

        if (!value) {
            loadOrders(); 
        } else {
            searchOrders(value)
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        setOrders(response.data);
                        setError("");
                    } else {
                        setError("Failed to search orders");
                    }
                })
                .catch((error) => {
                    setError("Failed to search orders");
                    message.error("Failed to search orders");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleEditStatus = (order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.orderStatus);
        setIsModalVisible(true);
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    const handleUpdate = () => {
        if (selectedOrder) {
            const updatedOrder = { orderStatus: selectedStatus }; 

            updateOrder(selectedOrder.orderID, updatedOrder)
                .then(() => {
                    setOrders(orders.map(order =>
                        order.orderID === selectedOrder.orderID ? { ...order, orderStatus: selectedStatus } : order
                    ));
                    setIsModalVisible(false);
                    message.success("Order status updated successfully");
                })
                .catch((error) => {
                    message.error("Failed to update order status");
                });
        }
    };

    const handleDeleteOrder = () => {
        deleteOrder(selectedOrder.orderID)
            .then(() => {
                setOrders(orders.filter(order => order.orderID !== selectedOrder.orderID));
                message.success("Order deleted successfully");
            })
            .catch(() => {
                message.error("Failed to delete order");
            })
            .finally(() => {
                setIsDeleteModalVisible(false);
            });
    };

    const goToAddOrder = () => {
        navigate("/dashboard/orders/add");
    };

    const goToOrderDetail = (id) => {
        navigate(`/dashboard/orders/detail/${id}`);
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
            title: "Order Date",
            dataIndex: "orderDate",
            key: "orderDate",
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => {
                let color = "blue";
                let text = "Processing";
                switch (record.orderStatus) {
                    case 0:
                        color = "blue";
                        text = "Processing";
                        break;
                    case 1:
                        color = "yellow";
                        text = "Delivering";
                        break;
                    case 2:
                        color = "green";
                        text = "Delivered";
                        break;
                    case 3:
                        color = "red";
                        text = "Cancelled";
                        break;
                    default:
                        color = "gray";
                        text = "Unknown";
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => goToOrderDetail(record.orderID)}>
                        <InfoCircleOutlined title="Detail" />
                    </Button>
                    <Button type="link" style={{ color: "orange" }} onClick={() => handleEditStatus(record)}>
                        <EditOutlined title="Edit" />
                    </Button>
                    {/* <Button type="link" danger onClick={() => { setSelectedOrder(record); setIsDeleteModalVisible(true); }}>
                        <DeleteOutlined title="Delete" />
                    </Button> */}
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
                <h1>Order Management</h1>
                <div className="action-container" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Button type="primary" onClick={goToAddOrder}>Add Order</Button>
                    <Search
                        placeholder="Search by Order ID"
                        value={searchKey}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                </div>
                <Table columns={columns} dataSource={orders} rowKey="orderID" loading={loading} pagination={{ pageSize: 10 }} />
                {error && <p style={{ color: "red" }}>{error}</p>}

                <Modal
                    title="Edit Order Status"
                    open={isModalVisible}
                    onOk={handleUpdate}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <p>Select new status:</p>
                    <Select value={selectedStatus} style={{ width: "100%" }} onChange={handleStatusChange}>
                        <Option value={0}>Processing</Option>
                        <Option value={1}>Delivering</Option>
                        <Option value={2}>Delivered</Option>
                        <Option value={3}>Cancelled</Option>
                    </Select>
                </Modal>

                {/* <Modal
                    title="Delete Order Confirmation"
                    open={isDeleteModalVisible}
                    onOk={handleDeleteOrder}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    okButtonProps={{ danger: true }}
                >
                    <p>Do you want to delete order #{selectedOrder?.orderID}?</p>
                </Modal> */}
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
