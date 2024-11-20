import React, { useState, useEffect } from 'react';
import { Layout, Card, Checkbox, Button, InputNumber, Row, Col, Typography, Divider, Input, Dropdown, Menu } from 'antd';
import { UserOutlined, ShoppingCartOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { viewCart } from '../config'; // Import API viewCart

const { Header, Footer, Content } = Layout;
const { Text } = Typography;
const { Search } = Input;

const CartDetails = () => {
    const navigate = useNavigate();
    const username = "khanh_dep_trai"; // Thay bằng username thực tế hoặc lấy từ context/session
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Gọi API để lấy dữ liệu giỏ hàng
        const fetchCart = async () => {
            try {
                const data = await viewCart(username);
                const formattedData = data.map(item => ({
                    id: item.cartID,
                    title: item.bookID.bookTitle,
                    price: item.bookID.bookPrice,
                    quantity: item.quantity,
                    selected: true,
                    image: item.bookID.image || 'https://via.placeholder.com/50',
                }));
                setCartItems(formattedData);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCart();
    }, [username]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) =>
            item.selected ? total + item.price * item.quantity : total
            , 0);
    };

    const handleQuantityChange = (value, itemId) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: value } : item
        ));
    };

    const handleSelectItem = (itemId) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId ? { ...item, selected: !item.selected } : item
        ));
    };

    const handleDeleteItem = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setCartItems(cartItems.map(item => ({ ...item, selected: isChecked })));
    };

    const handleSearch = (value) => {
        console.log("Searching for:", value);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard" onClick={() => navigate('/dashboard')}>
                Dashboard
            </Menu.Item>
            <Menu.Item key="signout">
                Sign out
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0fa4d6', padding: '0 20px', height: '64px', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Search
                        placeholder="Search for books or orders"
                        onSearch={handleSearch}
                        enterButton
                        style={{ maxWidth: '500px' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="icon-container" onClick={() => alert('Notification clicked!')}>
                        <BellOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    </div>
                    <div className="icon-container" onClick={() => navigate('/cart')}>
                        <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    </div>
                    <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<UserOutlined />} style={{ color: '#fff' }}>
                            Khanh đẹp trai
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                <Card title="Shopping Cart" style={{ width: '100%' }}>
                    <Row align="middle" style={{ backgroundColor: '#1E90FF', padding: '10px', color: '#fff', fontWeight: 'bold' }}>
                        <Col span={1}>
                            <Checkbox onChange={handleSelectAll} checked={cartItems.every(item => item.selected)} />
                        </Col>
                        <Col span={6}><Text style={{ color: '#fff' }}>Select all books ({cartItems.length} books)</Text></Col>
                        <Col span={4}><Text style={{ color: '#fff' }}>Quantity</Text></Col>
                        <Col span={4}><Text style={{ color: '#fff' }}>Book Price</Text></Col>
                    </Row>
                    <Divider style={{ margin: 0 }} />

                    {cartItems.map(item => (
                        <Row key={item.id} align="middle" style={{ padding: '15px 0', borderBottom: '1px solid #e8e8e8' }}>
                            <Col span={1}>
                                <Checkbox checked={item.selected} onChange={() => handleSelectItem(item.id)} />
                            </Col>
                            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '5px' }} />
                                <div>
                                    <Text>{item.title}</Text>
                                    <Button type="link" style={{ padding: 0, color: '#1E90FF' }}>Detail</Button>
                                </div>
                            </Col>
                            <Col span={4}>
                                <InputNumber min={1} value={item.quantity} onChange={(value) => handleQuantityChange(value, item.id)} style={{ width: '80px' }} />
                            </Col>
                            <Col span={4}><Text>{item.price.toLocaleString()} VND</Text></Col>
                            <Col span={1}>
                                <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteItem(item.id)} />
                            </Col>
                        </Row>
                    ))}

                    <Divider />
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Col>
                            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>Total amount: {calculateTotal().toLocaleString()} VND</Text>
                            <Button type="primary" style={{ marginLeft: '20px' }}>Purchase</Button>
                        </Col>
                    </Row>
                </Card>
            </Content>

            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0' }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default CartDetails;
