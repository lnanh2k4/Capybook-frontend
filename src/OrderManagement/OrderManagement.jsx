import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Button, Input, Modal, message, Tag, Select, DatePicker } from "antd";
import { fetchOrders, searchOrders, updateOrder } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
    EditOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import moment from "moment";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [dateRange, setDateRange] = useState(null); // State for selected date range
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
                    const sortedOrders = response.data.sort((a, b) => b.orderID - a.orderID);
                    setOrders(sortedOrders);
                    setError("");
                } else {
                    setError("Failed to fetch orders");
                }
            })
            .catch(() => {
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
                        const sortedOrders = response.data.sort((a, b) => b.orderID - a.orderID);
                        applyDateRangeFilter(sortedOrders);
                    } else {
                        setError("Failed to search orders");
                    }
                })
                .catch(() => {
                    setError("Failed to search orders");
                    message.error("Failed to search orders");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            applyDateRangeFilter(orders, dates);
        } else {
            loadOrders(); // If no date range is selected, load all orders
        }
    };

    const applyDateRangeFilter = (data, dates = dateRange) => {
        if (dates) {
            const [start, end] = dates;
            const filteredOrders = data.filter((order) =>
                moment(order.orderDate).isBetween(start, end, "day", "[]")
            );
            setOrders(filteredOrders);
        } else {
            setOrders(data);
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
                .catch(() => {
                    message.error("Failed to update order status");
                });
        }
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
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <RangePicker onChange={handleDateRangeChange} />
                        <Search
                            placeholder="Search by Order ID"
                            value={searchKey}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
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
