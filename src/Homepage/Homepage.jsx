import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Homepage.css';
import { fetchBooks } from '../config';

const { Header, Footer, Content } = Layout;
const { Search } = Input;

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
        book => (book?.title?.toLowerCase().includes(searchTerm) || book?.author?.toLowerCase().includes(searchTerm))
    );

    const menuItems = [
        { label: 'Home', key: '1' },
        { label: 'Shop', key: '2' },
        { label: 'Contact', key: '3' },
        { label: (<span>Cart (0)</span>), key: '4', icon: <ShoppingCartOutlined /> },
    ];

    return (
        <Layout>
            <Header style={headerStyle}>
                <div className="logo" style={{ float: 'left', color: '#fff', fontSize: '20px' }}>Capybook</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
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
                <Row gutter={[16, 40]}>
                    {filteredBooks.map((book) => (
                        <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                cover={
                                    <img
                                        alt={book.title}
                                        src={book.image || 'https://via.placeholder.com/150'}
                                        style={{ height: '250', objectFit: 'fill' }}
                                    />
                                }
                                bordered={false}
                                bodyStyle={{ padding: '10px' }}
                                style={{ width: 250, overflow: 'hidden' }}
                            >
                                <Badge.Ribbon text={`$${book.bookPrice}`} color="volcano">
                                    <Card.Meta
                                        title={book.title}
                                        description={<div style={{ fontWeight: 'bold' }}>{book.bookTitle}</div>}
                                        style={{ padding: '10px' }}
                                    />
                                </Badge.Ribbon>
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
