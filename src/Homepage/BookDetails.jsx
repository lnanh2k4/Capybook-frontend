import { Layout, Descriptions, Button, Image, Menu, Dropdown, Input, Tag, InputNumber } from 'antd'; // Added Tag here
import { fetchBookById } from '../config';
import { ShoppingCartOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Search } = Input; // Correct Search import

const BookDetails = () => {
    const { bookId } = useParams(); // Get bookId from URL
    const navigate = useNavigate(); // Navigation handler

    const [bookData, setBookData] = useState({
        bookTitle: '',
        publicationYear: '',
        author: '',
        dimension: '',
        translator: '',
        hardcover: '',
        publisher: '',
        weight: '',
        bookDescription: '',
        image: null,
        bookPrice: '',
        isbn: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchBookById(bookId)
            .then(response => {
                if (response && response.data) {
                    setBookData(response.data);
                    const imageFromDB = response.data.image;
                    if (imageFromDB && imageFromDB.startsWith(`/uploads/book_`)) {
                        const fullImagePath = `http://localhost:6789${imageFromDB}`;
                        setImagePreview(fullImagePath);
                    } else {
                        setImagePreview(imageFromDB);
                    }
                } else {
                    console.error('No data received from API');
                }
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
            });
    }, [bookId]);

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard">Dashboard</Menu.Item>
            <Menu.Item key="signout">Sign Out</Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#343a40', padding: '0 20px', height: '64px', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>
                <Search
                    placeholder="Search for books or orders"
                    enterButton
                    style={{ maxWidth: '500px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BellOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <Button icon={<UserOutlined />} style={{ color: '#fff' }}>User</Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '20px', backgroundColor: '#f0f2f5', flex: '1 0 auto' }}>
                <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Left section: Image gallery */}
                        <div style={{ flex: '1' }}>
                            <Image
                                width={300}
                                src={imagePreview || 'https://via.placeholder.com/300'}
                                alt={bookData.bookTitle}
                                style={{ borderRadius: '8px' }}
                            />
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <Image
                                    width={60}
                                    src={imagePreview || 'https://via.placeholder.com/60'}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            {/* Buttons moved below image */}
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <Button type="primary" style={{ width: '150px', height: '45px' }}>Buy Now</Button>
                                <Button style={{ width: '150px', height: '45px', borderColor: '#FF4500', color: '#FF4500' }}>Add to Cart</Button>
                            </div>
                        </div>

                        {/* Right section: Book details inside a box */}
                        <div style={{ flex: '1', padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{bookData.bookTitle}</h1>
                                <div style={{ fontSize: '20px', color: '#FF4500', marginBottom: '10px' }}>
                                    {bookData.bookPrice} đ <span style={{ textDecoration: 'line-through', fontSize: '16px', color: '#999' }}>{bookData.originalPrice} đ</span>
                                    <Tag color="volcano" style={{ marginLeft: '10px' }}>{`${bookData.discount}% off`}</Tag>
                                </div>
                                <div style={{ fontSize: '14px', color: '#999' }}>Sold: 52</div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Shipping Information</h3>
                                <div>Shipping to: Ho Chi Minh City</div>
                                <div>Estimated delivery: Oct 26</div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Quantity</h3>
                                <InputNumber min={1} max={10} defaultValue={1} />
                            </div>
                        </div>
                    </div>

                    {/* Additional Book Info */}
                    <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Product Details</h2>
                        <Descriptions bordered column={2} labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'left' }}>
                            <Descriptions.Item label="Author">{bookData.author}</Descriptions.Item>
                            <Descriptions.Item label="Publication Year">{bookData.publicationYear}</Descriptions.Item>
                            <Descriptions.Item label="Dimensions">{bookData.dimension}</Descriptions.Item>
                            <Descriptions.Item label="Publisher">{bookData.publisher}</Descriptions.Item>
                            <Descriptions.Item label="ISBN">{bookData.isbn}</Descriptions.Item>
                            <Descriptions.Item label="Weight">{bookData.weight} g</Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>{bookData.bookDescription}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0', flexShrink: 0 }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default BookDetails;
