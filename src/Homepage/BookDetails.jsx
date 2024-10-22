import { Layout, Descriptions, Button, Image, Menu, Dropdown, Input } from 'antd'; // Import Search từ Input
import { fetchBookById } from '../config';
import { ShoppingCartOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Search } = Input; // Đúng nơi xuất ra Search

const BookDetails = () => {
    const { bookId } = useParams(); // Lấy bookId từ URL
    const navigate = useNavigate(); // Điều hướng giữa các trang

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
                console.log('Response:', response); // Kiểm tra phản hồi từ API
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
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4096ff', padding: '0 20px', height: '64px', color: '#fff' }}>
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
                        <Button icon={<UserOutlined />} style={{ color: '#fff' }}>chó Vũ</Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <Image
                            width={300}
                            src={imagePreview || 'https://via.placeholder.com/300'}
                            alt={bookData.bookTitle}
                            style={{ borderRadius: '8px' }}
                        />
                        <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'left' }}>
                            <Descriptions.Item label="Title">{bookData.bookTitle}</Descriptions.Item>
                            <Descriptions.Item label="Author">{bookData.author}</Descriptions.Item>
                            <Descriptions.Item label="Publication Year">{bookData.publicationYear}</Descriptions.Item>
                            <Descriptions.Item label="Dimensions">{bookData.dimension}</Descriptions.Item>
                            <Descriptions.Item label="Price">{bookData.bookPrice} đ</Descriptions.Item>
                            <Descriptions.Item label="Publisher">{bookData.publisher}</Descriptions.Item>
                            <Descriptions.Item label="ISBN">{bookData.isbn}</Descriptions.Item>
                            <Descriptions.Item label="Description">{bookData.bookDescription}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Button style={{ marginTop: '20px' }} >Buy Now</Button>
                    <Button style={{ marginTop: '20px' }} >Add to Cart</Button>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#4096ff', padding: '10px 0' }}>
                © {new Date().getFullYear()} Capybook Management System
            </Footer>
        </Layout>
    );
};

export default BookDetails;
