import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography } from 'antd';
import './Homepage.css'; // Ensure this path is correct for your CSS file
import { fetchBooks } from '../config';

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
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
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks().then(response => {
            setBooks(response.data);
        }).catch(error => {
            console.error('Failed to fetch books:', error);
        });
    }, []);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value.toLowerCase());
    }, []);

    const filteredBooks = books.filter(
        book => book?.title?.toLowerCase().includes(searchTerm) || book?.author?.toLowerCase().includes(searchTerm)
    );

    return (
        <Layout>
            <Header style={headerStyle}>
                <div className="logo" style={{ float: 'left', color: '#fff', fontSize: '20px' }}>Capybook</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={[{ label: 'Home', key: '1' }]} />
            </Header>
            <Content style={contentStyle}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1>Book Store</h1>
                    <Search
                        placeholder="Search for books by title or author"
                        onSearch={handleSearch}
                        enterButton
                        style={{ maxWidth: '500px', margin: '0 auto' }}
                    />
                </div>

                <Row gutter={[16, 16]}>
                    {filteredBooks.map((book) => (
                        <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                style={{ width: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                cover={<img alt={book.bookTitle} src={book.image || 'https://via.placeholder.com/150'} style={{ height: '250px', objectFit: 'cover' }} />}
                            >
                                <div style={{ padding: '0px 0px 0 0px' }}>  {/* Reduced bottom padding */}
                                    <Title level={5} style={{ marginBottom: '10px' }}>{book.bookTitle}</Title> {/* Reduced margin between title and description */}
                                    <Title level={4} type="danger">{`${book.bookPrice} đ`}</Title>
                                    <Tag color="volcano">{`${book.discount}% off`}</Tag>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
            <Footer style={footerStyle}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default Homepage;
