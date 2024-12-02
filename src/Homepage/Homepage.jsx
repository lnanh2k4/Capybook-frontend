import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography, Dropdown, Button, Select, Divider, TreeSelect, Modal } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined, BellOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { fetchBooks, fetchCategories, logout } from '../config'; // Fetch books and categories from API
import { decodeJWT } from '../jwtConfig'



const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const Homepage = () => {
    const [books, setBooks] = useState([]); // State for books
    const [categories, setCategories] = useState([]); // State for categories
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
    const [sortOrder, setSortOrder] = useState('default'); // State for sorting
    const [currentPage, setCurrentPage] = useState({}); // Track the current page for each category
    const [isTransitioning, setIsTransitioning] = useState(false); // Track animation state
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [modalBooks, setModalBooks] = useState([]); // Books to display in the modal
    const [modalCategory, setModalCategory] = useState(null); // The selected category for the modal


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

    // Paginate books for each category (6 books per page)
    const paginateBooks = (books, pageSize) => {
        const pages = [];
        for (let i = 0; i < books.length; i += pageSize) {
            pages.push(books.slice(i, i + pageSize));
        }
        return pages;
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
        navigate(`/detail/${bookId}`); // Adjust this route based on your router configuration
    };

    const handleLogout = () => {
        logout()
        navigate("/");
    }
    const showModal = (category, books) => {
        console.log('Opening modal with:', category, books); // Log modal state
        if (!books || books.length === 0) {
            console.error('No books to show in modal');
            return;
        }
        setModalCategory(category);
        setModalBooks(books);
        setIsModalVisible(true);  // This should trigger modal to show
    };

    const closeModal = () => {
        setIsModalVisible(false); // Close modal
    };

    const userMenu = () => {
        if (localStorage.getItem("jwtToken")) {
            return (

                <Menu>
                    {
                        decodeJWT(localStorage.getItem("jwtToken")).scope != "CUSTOMER" ? (<Menu.Item key="dashboard" icon={<AppstoreOutlined />} onClick={handleDashboardClick}>
                            Dashboard
                        </Menu.Item>) : (<Menu.Item key="profile" icon={<AppstoreOutlined />} onClick={() => { navigate("/profile") }}>
                            Profile
                        </Menu.Item>)
                    }

                    <Menu.Item key="signout" icon={<SettingOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </Menu>
            )
        } else navigate("/auth/login");
    }

    // Group books by category and paginate them
    const booksByCategory = categories?.map(category => {
        const booksInCategory = sortedBooks.filter(book => book.catID === category.catID);
        const pages = paginateBooks(booksInCategory, 6); // 6 books per page
        return { category, pages };
    });

    // Initialize current page for each category
    useEffect(() => {
        const initialPages = {};
        booksByCategory?.forEach(({ category }) => {
            initialPages[category.catID] = 0;
        });
        setCurrentPage(initialPages);
    }, [booksByCategory]);

    const normalizeImageUrl = (imageUrl) => {
        if (imageUrl && imageUrl.startsWith('/uploads/book_')) {
            return `http://localhost:6789${imageUrl}`; // Add base URL if needed
        }
        return imageUrl || 'https://via.placeholder.com/150'; // Default image
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0fa4d6', padding: '0 20px', height: '64px', color: '#fff' }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate('/')} // Navigate to homepage when clicked
                >
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
                    <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<UserOutlined />}
                            style={{ color: '#fff' }}
                        >

                            {localStorage.getItem("jwtToken") ? decodeJWT().sub : "Login"}

                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ minHeight: '600px', padding: '20px', backgroundColor: '#8e9a9e' }}>
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
                                <TreeSelect
                                    placeholder="Filter by Category"
                                    onChange={handleCategoryChange}
                                    treeData={categories.map(category => ({
                                        title: category.catName,
                                        value: category.catID,
                                        key: category.catID,
                                        children: []
                                    }))}
                                    style={{ width: 200 }}
                                    allowClear
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {selectedCategory
                    ? (
                        <Row gutter={[16, 16]}>
                            {sortedBooks.map((book) => (
                                <Col key={book.bookID} xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Card
                                        hoverable
                                        className="book-card"
                                        onClick={() => handleBookClick(book.bookID)}
                                        cover={
                                            <div className="image-container">
                                                <img alt={book.bookTitle} src={normalizeImageUrl(book.image)} className="book-image" />
                                            </div>
                                        }
                                    >
                                        <Title level={5} className="book-title">{book.bookTitle}</Title>
                                        <Title level={4} type="danger" className="book-price">{`${book.bookPrice.toLocaleString('vi-VN')} đ`}</Title>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )
                    : (
                        <>
                            {booksByCategory.map(({ category, pages }) => (
                                <div key={category.catID} style={{ position: 'relative', padding: '20px', marginBottom: '30px', backgroundColor: '#fff' }}>
                                    <Divider orientation="center" style={{ fontSize: '24px', color: '#FF4500', borderColor: '#FF4500', marginBottom: '20px' }}>
                                        {category.catName}
                                    </Divider>
                                    <Row gutter={[16, 16]} className={`fade-in`}>
                                        {pages[currentPage[category.catID]]?.map((book) => (
                                            <Col key={book.bookID} xs={24} sm={12} md={8} lg={4} xl={4}>
                                                <Card
                                                    hoverable
                                                    onClick={() => handleBookClick(book.bookID)}
                                                    className="category-book-card-2"
                                                    cover={
                                                        <img
                                                            alt={book.bookTitle}
                                                            src={normalizeImageUrl(book.image)}
                                                            style={{ height: '150px', objectFit: 'cover' }}
                                                        />
                                                    }
                                                >
                                                    <Title level={4} className="book-title-2">{book.bookTitle}</Title>
                                                    <Title level={5} type="danger" className="book-price">{`${book.bookPrice.toLocaleString('vi-VN')} đ`}</Title>
                                                    {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    {pages.length > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                            <Button type="primary" onClick={() => showModal(category, pages.flat())}>Show more</Button>
                                        </div>
                                    )}
                                </div>
                            ))}

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
                                                    <img alt={book.bookTitle} src={normalizeImageUrl(book.image)} className="book-image" />
                                                </div>
                                            }
                                        >
                                            <Title level={5} className="book-title">{book.bookTitle}</Title>
                                            <Title level={4} type="danger" className="book-price">{`${book.bookPrice.toLocaleString('vi-VN')} đ`}</Title>
                                            {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
            </Content>
            <Modal
                title={modalCategory?.catName || 'Books'}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
                width={900}
            >
                {/* Render các sách từ modalBooks */}
                <Row gutter={[16, 16]}>
                    {modalBooks.map(book => (
                        <Col key={book.bookID} xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card
                                hoverable
                                onClick={() => handleBookClick(book.bookID)}
                                cover={
                                    <img
                                        alt={book.bookTitle}
                                        src={normalizeImageUrl(book.image)}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                }
                            >
                                <Title level={5}>{book.bookTitle}</Title>
                                <Title level={4} type="danger">{`${book.bookPrice.toLocaleString('vi-VN')} đ`}</Title>
                                {book.discount && <Tag color="volcano">{`${book.discount}% off`}</Tag>}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal>


            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0' }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );

};

export default Homepage;
