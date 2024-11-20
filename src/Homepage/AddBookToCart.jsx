import React, { useState } from 'react';
import { Modal, Button, InputNumber, Table, Typography, Tag } from 'antd';
import { ShoppingCartOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { addBookToCart, createPayment } from '../config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddBookToCart = ({ username, bookId, bookData }) => {
    const [quantity, setQuantity] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate(); // Sử dụng useNavigate

    // Hàm mở modal hoặc chuyển hướng đến trang chi tiết giỏ hàng
    const handleShowCart = () => {
        setIsModalVisible(false); // Đóng modal
        navigate('/cart/ViewDetail'); // Chuyển hướng đến trang CartDetails
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Hàm thêm sách vào giỏ hàng
    const handleAddToCart = async () => {
        try {
            await addBookToCart(username, bookId, quantity);

            const newCartItem = {
                key: bookId,
                name: bookData.bookTitle,
                price: bookData.bookPrice || 0,
                originalPrice: bookData.originalPrice || 0,
                discount: bookData.discount || 0,
                quantity: quantity,
                total: quantity * (bookData.bookPrice || 0),
                image: bookData.image || 'https://via.placeholder.com/50',
            };

            setCartItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex((item) => item.key === bookId);
                if (existingItemIndex >= 0) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex].quantity += quantity;
                    updatedItems[existingItemIndex].total =
                        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
                    return updatedItems;
                } else {
                    return [...prevItems, newCartItem];
                }
            });

            setIsModalVisible(true);
        } catch (error) {
            Modal.error({
                content: 'Failed to add book to cart. Please try again.',
            });
        }
    };

    // Hàm xử lý thanh toán
    const handleCheckout = async () => {
        try {
            const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);
            const response = await createPayment(totalAmount);
            const paymentUrl = response.data;
            window.location.href = paymentUrl;
        } catch (error) {
            Modal.error({
                content: 'Failed to initiate payment. Please try again.',
            });
        }
    };

    // Cấu trúc cột bảng
    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={record.image} alt={text} style={{ width: 50, height: 50, marginRight: 10 }} />
                    <Typography.Text>{text}</Typography.Text>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <div>
                    <Typography.Text>{text.toLocaleString()}đ</Typography.Text>
                    <br />
                    <Typography.Text delete style={{ color: '#999' }}>
                        {record.originalPrice.toLocaleString()}đ
                    </Typography.Text>
                    <Tag color="volcano" style={{ marginLeft: 5 }}>-{record.discount}%</Tag>
                </div>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => <Typography.Text>{total.toLocaleString()}đ</Typography.Text>,
        },
    ];

    return (
        <div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button
                    type="primary"
                    style={{
                        width: '150px',
                        height: '45px',
                        backgroundColor: '#FF4500',
                        borderColor: '#FF4500',
                        fontWeight: 'bold',
                    }}
                    onClick={handleCheckout}
                >
                    Buy now
                </Button>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Quantity</div>
                    <InputNumber
                        min={1}
                        max={10}
                        defaultValue={1}
                        style={{ width: '60px' }}
                        onChange={(value) => setQuantity(value)}
                    />
                </div>
                <Button
                    style={{
                        width: '150px',
                        height: '45px',
                        borderColor: '#FF4500',
                        color: '#FF4500',
                        fontWeight: 'bold',
                    }}
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                >
                    Add to cart
                </Button>
            </div>

            <Modal
                title={
                    <Typography.Text strong style={{ fontSize: '16px' }}>
                        Added to cart
                    </Typography.Text>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <CheckCircleOutlined style={{ color: 'green', fontSize: '20px', marginRight: '10px' }} />
                    <Typography.Text style={{ fontSize: '14px', color: '#666' }}>
                        Book added to cart successfully!
                    </Typography.Text>
                </div>
                <Table
                    columns={columns}
                    dataSource={cartItems}
                    pagination={false}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}>
                                <Typography.Text strong>Total:</Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <Typography.Text strong>
                                    {cartItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}đ
                                </Typography.Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderTop: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        marginBottom: '20px',
                    }}
                >
                    <Typography.Text strong style={{ fontSize: '16px' }}>
                        Cart Subtotal: {cartItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}đ
                    </Typography.Text>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#FFD814', borderColor: '#FFD814', color: '#111' }}
                            onClick={handleCheckout}
                        >
                            Proceed to checkout
                        </Button>
                        <Button onClick={handleShowCart}>Go to Cart</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddBookToCart;
