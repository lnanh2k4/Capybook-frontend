import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Modal, Button, Input, message } from 'antd'; // Ant Design components
import { fetchAccounts, deleteAccount, searchAccount } from '../config'; // API imports
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
    DeleteOutlined,
    EditOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import Footer from '../FooterForDashboard/Footer.jsx';

const StaffManagement = () => {

    //navigation
    const navigate = useNavigate();

    //navigate to add staff page
    const goToAddStaff = () => {
        navigate('/dashboard/staffs/add');
    };
    // navigate to edit staff page
    const goToEditStaff = (username) => {
        navigate(`/dashboard/staffs/${username}`);
    };

    const goToStaffDetail = (username) => {
        navigate(`/dashboard/staffs/detail/${username}`);
    };

    //user state of accounts, search, loading, error
    const [accounts, setAccounts] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState();

    // Fetch accounts from the API
    useEffect(() => {
        setLoading(true);
        fetchAccounts()
            .then(response => {
                setAccounts(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching staffs:', error);
                setError('Failed to fetch staffs');
                message.error('Failed to fetch staffs');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    //Handle Modal Delete
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const showModal = (username) => {
        setIsModalDeleteOpen(true);
        setUsername(username)
    };
    const handleOk = () => {
        setIsModalDeleteOpen(false);
        deleteAccount(username)
            .then(() => {
                setAccounts(accounts.filter(account => account.username !== username));
                message.success('Staff is deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting staff:', error);
                message.error('Failed to delete staff');
            });
    };
    const handleCancel = () => {
        setIsModalDeleteOpen(false);
    };

    //Handle Search
    const handleSearch = (value) => {
        setSearchKey(value)
        if (!value) {
            fetchAccounts()
                .then(response => {
                    setAccounts(response.data);
                    setError('');
                })
                .catch(error => {
                    console.error('Error fetching staff:', error);
                    setError('Failed to fetch staff');
                    message.error('Failed to fetch staff');
                })
                .finally(() => {
                    setLoading(false);
                });

        } else {
            setLoading(true)
            searchAccount(value).then(response => {
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
        }
    }


    // Define the columns for the Ant Design Table
    const columns = [
        {
            title: 'Staff ID',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (record) => `${record.lastName} ${record.firstName}`,
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
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => goToStaffDetail(record.username)}><InfoCircleOutlined title='Detail' /></Button>
                    <Button type="link" style={{ color: 'orange' }} onClick={() => goToEditStaff(record.username)}><EditOutlined title='Edit' /></Button>
                    {

                        (record.role !== 0) && (
                            <Button type="link" danger onClick={() => showModal(record.username)}><DeleteOutlined title='Disable' /></Button>
                        )
                    }

                    <Modal title="Delete Staff Confirmation" open={isModalDeleteOpen} onOk={() => handleOk(record.username)}
                        onCancel={handleCancel} maskClosable={false} closable={false} okButtonProps={{ danger: true }}  >
                        <p>Do you want to delete {username} account?</p>
                    </Modal>
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
                <h1>Staff Management</h1>
                <div className="action-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Button type="primary" onClick={goToAddStaff}>Add Staff</Button>
                    <Input
                        placeholder="Search by username or full name"
                        value={searchKey}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={accounts}
                    rowKey="username"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <Footer></Footer>
        </div>
    );
};

export default StaffManagement;