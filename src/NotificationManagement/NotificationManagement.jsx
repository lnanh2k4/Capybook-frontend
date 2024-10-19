import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Button, Input, message } from 'antd'; // Ant Design components
import { fetchNotifications, deleteAccount } from '../config'; // API imports
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const NotificationManagement = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch accounts from the API
    useEffect(() => {
        setLoading(true);
        fetchNotifications()
            .then(response => {
                setNotification(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                setError('Failed to fetch notifications');
                message.error('Failed to fetch notifications');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDelete = (notID) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            deleteAccount(notification)
                .then(() => {
                    setNotification(notification.filter(notID => notification.notID !== notID));
                    message.success('Notification deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting notification:', error);
                    message.error('Failed to delete notification');
                });
        }
    };

    const goToAddNotification = () => {
        navigate('/dashboard/notifications/add');
    };

    const goToEditNotification = (notID) => {
        navigate(`/dashboard/notifications/${notID}`);
    };

    const goToNotificationDetail = (notID) => {
        navigate(`/dashboard/notifications/detail/${notID}`);
    };

    // Define the columns for the Ant Design Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'notID',
            key: 'notID',
        },
        {
            title: 'Title',
            key: 'notTitle',
            render: (record) => `${record.title}`,
        },
        {
            title: 'Receiver',
            key: 'receiver',
            render: (record) => {
                let receiver = ''
                switch (record.receiver) {
                    case 0:
                        receiver = 'Admin'
                        break;
                    case 1:
                        receiver = 'Customer'
                        break;
                    case 2:
                        receiver = 'Seller staff'
                        break;
                    case 3:
                        receiver = 'Warehouse staff'
                        break;
                    case 4:
                        receiver = 'All'
                        break;
                }
                return receiver
            },
        },
        {
            title: 'Status',
            key: 'status',
            render: (record) => {
                let status = '';
                let color = '';
                switch (record.notStatus) {
                    case 0:
                        status = 'Inactive';
                        color = 'red'
                        break;
                    case 1:
                        status = 'Active';
                        color = 'green'
                        break;
                }

                return <Tag color={color}>
                    {status}
                </Tag>
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => goToNotificationDetail(record.notID)}>Detail</Button>
                    <Button type="link" onClick={() => goToEditNotification(record.notID)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.notID)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const filteredNotifications = notification.filter(notification =>
        notification.notTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${notification.notTitle}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>
            <div className="dashboard-content">
                <div className="title-management">
                    <h1>Notification Management</h1>
                </div>
                <div className="action-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Button type="primary" onClick={goToAddNotification}>Add Notification</Button>
                    <Search
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredNotifications}
                    rowKey="notID"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default NotificationManagement;
