import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography, Dropdown, Button, Badge } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Homepage.css'; // Ensure this path is correct for your CSS file
import { fetchBooks } from '../config';

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4096ff',
    padding: '0 20px',
    height: '64px',
    color: '#fff',
};

const contentStyle = {
    minHeight: '600px',
    padding: '20px',
    backgroundColor: '#f0f2f5',
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
    padding: '10px 0',
};

const Homepage = () => {
    const [books, setBooks] = useState([]); // State for books
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const navigate = useNavigate(); // Initialize navigate for routing

    // Fetch books when the component mounts
    useEffect(() => {
        fetchBooks().then(response => {
            setBooks(response.data);
        }).catch(error => {
            console.error('Failed to fetch books:', error);
        });
    }, []);

    // Handle search input
    const handleSearch = useCallback((value) => {
        setSearchTerm(value.toLowerCase());
    }, []);

    // Filter books based on the search term
    const filteredBooks = books.filter(
        (book) => book?.title?.toLowerCase().includes(searchTerm) || book?.author?.toLowerCase().includes(searchTerm)
    );

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const userMenu = (
        <Menu
            items={[
                { key: 'dashboard', label: 'Dashboard', icon: <AppstoreOutlined />, onClick: handleDashboardClick },
                { key: 'signout', label: 'Sign out', icon: <SettingOutlined /> },
            ]}
        />
    );

    // Define menu items
    const menuItems = [
        { label: 'Home', key: '1' },  // Each object must contain 'label' and 'key'
        { label: 'About', key: '2' },
        { label: 'Books', key: '3' }
    ];

    return (
        <Layout>
            {/* Header */}
            <Header style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>

                {/* Search Bar */}
                <Search
                    placeholder="Search for books or orders"
                    onSearch={handleSearch}
                    enterButton
                    style={{ maxWidth: '500px' }}
                />

                {/* Icons for Notifications and Shopping Cart with click events */}
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
                            chó Khanh
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={contentStyle}>
                <Row gutter={[16, 16]}>
                    {filteredBooks.map((book, index) => (
                        <Col key={book.id || index} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                style={{ width: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                cover={<img alt={book.bookTitle} src={book.image || 'https://via.placeholder.com/150'} style={{ height: '250px', objectFit: 'cover' }} />}
                            >
                                <div style={{ padding: '0px 0px 0 0px' }}>
                                    <Title level={5} style={{ marginBottom: '10px' }}>{book.bookTitle}</Title>
                                    <Title level={4} type="danger">{`${book.bookPrice} đ`}</Title>
                                    <Tag color="volcano">{`${book.discount}% off`}</Tag>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>

            {/* Footer */}
            <Footer style={footerStyle}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default Homepage;