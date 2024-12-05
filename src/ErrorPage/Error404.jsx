import React from 'react';
import { Layout, Button, Input, Dropdown, Menu } from 'antd';
import { BellOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.css'; // Import CSS cho phần hình nền

const { Header, Footer, Content } = Layout;
const { Search } = Input;

const PageNotFound = () => {
    const navigate = useNavigate(); // Dùng để điều hướng về trang chủ

    const handleBackToHome = () => {
        navigate('/'); // Điều hướng về trang chủ
    };

    const handleSearch = (value) => {
        console.log('Search term:', value);
        // Thực hiện chức năng tìm kiếm ở đây hoặc điều hướng người dùng
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard" onClick={() => navigate('/dashboard')}>
                Dashboard
            </Menu.Item>
            <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#343a40', padding: '0 20px', height: '64px', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>

                {/* Center Search */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Search
                        placeholder="Search for books or orders"
                        onSearch={handleSearch}
                        enterButton
                        style={{ maxWidth: '500px' }}
                    />
                </div>

                {/* Icons and User Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="icon-container" onClick={() => alert('Notification clicked!')}>
                        <BellOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    </div>
                    <div className="icon-container" onClick={() => alert('Shopping cart clicked!')}>
                        <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    </div>
                    <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<UserOutlined />}
                            style={{ color: '#fff' }}
                        >
                            Khanh đẹp trai
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content className="not-found-content">

            </Content>

            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0' }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default PageNotFound;
