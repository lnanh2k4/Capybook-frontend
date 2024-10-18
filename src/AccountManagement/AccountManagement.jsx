import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Button, Input, message } from 'antd'; // Ant Design components
import { fetchAccounts, deleteAccount } from '../config'; // API imports
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Search } = Input;

const AccountManagement = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch accounts from the API
    useEffect(() => {
        setLoading(true);
        fetchAccounts()
            .then(response => {
                setAccounts(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);
                setError('Failed to fetch accounts');
                message.error('Failed to fetch accounts');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDelete = (username) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            deleteAccount(username)
                .then(() => {
                    setAccounts(accounts.filter(account => account.username !== username));
                    message.success('Account deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting account:', error);
                    message.error('Failed to delete account');
                });
        }
    };

    const goToAddAccount = () => {
        navigate('/dashboard/accounts/add');
    };

    const goToEditAccount = (username) => {
        navigate(`/dashboard/accounts/${username}`);
    };

    const goToAccountDetail = (username) => {
        navigate(`/dashboard/accounts/detail/${username}`);
    };

    // Define the columns for the Ant Design Table
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (record) => `${record.lastName} ${record.firstName}`,
        },
        {
            title: 'Sex',
            key: 'sex',
            render: (record) => (record.sex === 0 ? 'Female' : 'Male'),
        },
        {
            title: 'Role',
            key: 'role',
            render: (record) => {
                let roleName = '';
                switch (record.role) {
                    case 0:
                        roleName = 'Admin';
                        break;
                    case 1:
                        roleName = 'Customer';
                        break;
                    case 2:
                        roleName = 'Seller Staff';
                        break;
                    case 3:
                        roleName = 'Warehouse Staff';
                        break;
                    default:
                        roleName = 'Unknown';
                }
                return roleName;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => goToAccountDetail(record.username)}>Detail</Button>
                    <Button type="link" onClick={() => goToEditAccount(record.username)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.username)}>Delete</Button>
                </Space>
            ),
        },
    ];

    // Filter accounts based on search term
    const filteredAccounts = accounts.filter(account =>
        account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${account.lastName} ${account.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>
            <div className="dashboard-content">
                <div className="titlemanagement">
                    <h1>Account Management</h1>
                </div>
                <div className="action-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Button type="primary" onClick={goToAddAccount}>Add Account</Button>
                    <Search
                        placeholder="Search by username or full name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredAccounts}
                    rowKey="username"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
};

export default AccountManagement;
