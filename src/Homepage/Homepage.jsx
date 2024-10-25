import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography, Dropdown, Button, Select, Divider, TreeSelect } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { fetchBooks, fetchCategories } from '../config'; // Fetch books and categories from API

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#343a40', // Dark gray background
    padding: '0 20px',
    height: '64px',
    color: '#fff',
};

const contentStyle = {
    minHeight: '600px',
    padding: '20px',
    backgroundColor: '#8e9a9e', // Darker gray background to align with header
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#343a40', // Dark gray background for footer
    padding: '10px 0',
};

// Card Section background
const categorySectionStyle = {
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    backgroundColor: '#ffffff', // White background for each category section
};

const Homepage = () => {
    const [books, setBooks] = useState([]); // State for books
    const [categories, setCategories] = useState([]); // State for categories
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
    const [sortOrder, setSortOrder] = useState('default'); // State for sorting

    const navigate = useNavigate(); // Initialize navigate for routing

    // Fetch books and categories when the component mounts
    useEffect(() => {
        fetchBooks().then(response => {
            setBooks(response.data);
        }).catch(error => {
            console.error('Failed to fetch books:', error);
        });

        fetchCategories().then(response => {
            setCategories(response.data);
        }).catch(error => {
            console.error('Failed to fetch categories:', error);
        });
    }, []);

    // Handle search input
    const handleSearch = useCallback((value) => {
        setSearchTerm(value.toLowerCase());
    }, []);

    // Handle sorting
    const handleSortChange = (value) => {
        setSortOrder(value);
    };

    // Handle category filter change
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    // Filter books based on the search term, category, and only include those with bookStatus = 1
    const filteredBooks = books
        .filter(book => book.bookStatus === 1) // Only include books with bookStatus = 1
        .filter(book =>
            (book?.bookTitle?.toLowerCase().includes(searchTerm) || book?.author?.toLowerCase().includes(searchTerm)) &&
            (!selectedCategory || book.catID === selectedCategory) // Filter by category
        );

    // Sort books based on selected criteria
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sortOrder === 'priceAsc') return a.bookPrice - b.bookPrice;
        if (sortOrder === 'priceDesc') return b.bookPrice - a.bookPrice;
        if (sortOrder === 'titleAsc') return a.bookTitle.localeCompare(b.bookTitle);
        if (sortOrder === 'titleDesc') return b.bookTitle.localeCompare(a.bookTitle);
        return 0; // Default no sorting
    });

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleBookClick = (bookId) => {
        navigate(`/${bookId}`); // Adjust this route based on your router configuration
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard" icon={<AppstoreOutlined />} onClick={handleDashboardClick}>
                Dashboard
            </Menu.Item>
            <Menu.Item key="signout" icon={<SettingOutlined />}>
                Sign out
            </Menu.Item>
        </Menu>
    );

    // Group books by category
    const booksByCategory = categories.map(category => {
        const booksInCategory = sortedBooks.filter(book => book.catID === category.catID);
        return { category, books: booksInCategory };
    });

    const buildCategoryTree = (categories, parentId = null) => {
        return categories
            .filter(category => category.parentCatID === parentId) // Lọc các category theo parentCatID
            .map(category => ({
                title: category.catName, // Tên category
                value: category.catID,   // Giá trị để truyền cho TreeSelect
                key: category.catID,     // Key cần thiết cho việc expand/collapse
                children: buildCategoryTree(categories, category.catID), // Đệ quy để lấy các danh mục con
            }));
    };

    // Dữ liệu tree cho TreeSelect
    const categoryTreeData = buildCategoryTree(categories.filter(cat => cat.catStatus === 1));

    return (
        <Layout>
            <Header style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>
                <Search
                    placeholder="Search for books or orders"
                    onSearch={handleSearch}
                    enterButton
                    style={{ maxWidth: '500px' }}
                />

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

            <Content style={contentStyle}>
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col>
                        <Row gutter={[8, 8]}>
                            <Col>
                                <Select
                                    placeholder="Sort by"
                                    onChange={handleSortChange}
                                    style={{ width: 200 }}
                                    defaultValue="default"
                                >
                                    <Option value="default">Default</Option>
                                    <Option value="priceAsc">Price (Low to High)</Option>
                                    <Option value="priceDesc">Price (High to Low)</Option>
                                    <Option value="titleAsc">Title (A-Z)</Option>
                                    <Option value="titleDesc">Title (Z-A)</Option>
                                </Select>
                            </Col>
                            <Col>
                                {/* TreeSelect for Category Filter */}
                                <TreeSelect
                                    placeholder="Filter by Category"
                                    onChange={handleCategoryChange}
                                    treeData={categoryTreeData}
                                    style={{ width: 200 }}
                                    allowClear
                                    showSearch={false}
                                    treeDefaultExpandAll={false}
                                />

                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* Render books by category */}
                {booksByCategory.map(({ category, books }) => (
                    books.length > 0 && (
                        <div key={category.catID} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '20px', marginBottom: '30px', backgroundColor: '#fff' }}>
                            <Divider orientation="center" style={{ fontSize: '24px', color: '#FF4500', borderColor: '#FF4500', marginBottom: '20px' }}>
                                {category.catName}
                            </Divider>
                            <Row gutter={[16, 16]}>
                                {books.map((book) => (
                                    <Col key={book.bookID || index} xs={12} sm={8} md={6} lg={4} xl={3}>
                                        <Card
                                            hoverable
                                            onClick={() => handleBookClick(book.bookID)}
                                            className="book-card"
                                            cover={
                                                <div className="image-container">
                                                    <img alt={book.bookTitle} src={book.image || 'https://via.placeholder.com/150'} className="book-image" />
                                                </div>
                                            }
                                        >
                                            <div className="card-content">
                                                <Title level={5} className="book-title">{book.bookTitle}</Title>
                                                <Title level={4} type="danger" className="book-price">{`${book.bookPrice} đ`}</Title>
                                                {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Button type="primary" onClick={() => alert('View more')}>Xem Thêm</Button>
                            </div>
                        </div>
                    )
                ))}


                {/* Render all books section only if no category is selected */}
                {!selectedCategory && (
                    <>
                        <Divider orientation="left" style={{ fontSize: '24px', color: '#080203', borderColor: '#c72a4c', marginBottom: '20px' }}>
                            All Books
                        </Divider>
                        <Row gutter={[16, 16]}>
                            {sortedBooks.map((book, index) => (
                                <Col key={book.bookID || index} xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Card
                                        hoverable
                                        onClick={() => handleBookClick(book.bookID)}
                                        className="book-card"
                                        cover={
                                            <div className="image-container">
                                                <img alt={book.bookTitle} src={book.image || 'https://via.placeholder.com/150'} className="book-image" />
                                            </div>
                                        }
                                    >
                                        <div className="card-content">
                                            <Title level={5} className="book-title">{book.bookTitle}</Title>
                                            <Title level={4} type="danger" className="book-price">{`${book.bookPrice} đ`}</Title>
                                            {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Content>
            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0', flexShrink: 0 }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default Homepage;
