import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography, Dropdown, Button, Select, Divider, TreeSelect } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined, BellOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { fetchBooks, fetchCategories } from '../config'; // Fetch books and categories from API

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

    // Handle moving to the next or previous set of books
    const handleNextPage = (categoryId) => {
        if (!isTransitioning) {
            setIsTransitioning(true); // Start animation
            setTimeout(() => {
                setCurrentPage(prev => ({
                    ...prev,
                    [categoryId]: (prev[categoryId] + 1) % (booksByCategory.find(c => c.category.catID === categoryId)?.pages?.length || 1),
                }));
                setIsTransitioning(false); // End animation after transition
            }, 400); // Duration matches CSS transition time
        }
    };

    const handlePrevPage = (categoryId) => {
        if (!isTransitioning) {
            setIsTransitioning(true); // Start animation
            setTimeout(() => {
                setCurrentPage(prev => ({
                    ...prev,
                    [categoryId]: (prev[categoryId] - 1 + (booksByCategory.find(c => c.category.catID === categoryId)?.pages?.length || 1)) % (booksByCategory.find(c => c.category.catID === categoryId)?.pages?.length || 1),
                }));
                setIsTransitioning(false); // End animation after transition
            }, 400); // Duration matches CSS transition time
        }
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

    // Group books by category and paginate them
    const booksByCategory = categories?.map(category => {
        const booksInCategory = sortedBooks.filter(book => book.catID === category.catID);
        const pages = paginateBooks(booksInCategory, 6); // Show 6 books per page
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

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#343a40', padding: '0 20px', height: '64px', color: '#fff' }}>
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
                    <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
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

                {/* Render categories */}
                {booksByCategory?.length > 0 && booksByCategory.map(({ category, pages }) => (
                    pages.length > 0 && (
                        <div key={category.catID} style={{ position: 'relative', padding: '20px', marginBottom: '30px', backgroundColor: '#fff' }}>
                            <Divider orientation="center" style={{ fontSize: '24px', color: '#FF4500', borderColor: '#FF4500', marginBottom: '20px' }}>
                                {category.catName}
                            </Divider>

                            {/* Left Arrow */}
                            <Button
                                icon={<LeftOutlined />}
                                style={{ position: 'absolute', top: '50%', left: '0', zIndex: 1 }}
                                disabled={isTransitioning || currentPage[category.catID] === 0}
                                onClick={() => handlePrevPage(category.catID)}
                            />

                            {/* Books display */}
                            <Row gutter={[16, 16]} className={`fade-in ${isTransitioning ? 'transition' : ''}`}>
                                {pages[currentPage[category.catID]]?.map((book) => (
                                    <Col key={book.bookID} xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <Card
                                            hoverable
                                            onClick={() => handleBookClick(book.bookID)}
                                            className="category-book-card-2"
                                            cover={
                                                <div className="image-container">
                                                    <img alt={book.bookTitle} src={book.image || 'https://via.placeholder.com/150'} className="category-book-image" />
                                                </div>
                                            }
                                        >
                                            <Title level={4} className="book-title-2">{book.bookTitle}</Title>
                                            <Title level={5} type="danger" className="book-price">{`${book.bookPrice} đ`}</Title>
                                            {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Right Arrow */}
                            <Button
                                icon={<RightOutlined />}
                                style={{ position: 'absolute', top: '50%', right: '0', zIndex: 1 }}
                                disabled={isTransitioning || currentPage[category.catID] === pages.length - 1}
                                onClick={() => handleNextPage(category.catID)}
                            />
                        </div>
                    )
                ))}

                {/* All Books Section */}
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
                                <Title level={5} className="book-title">{book.bookTitle}</Title>
                                <Title level={4} type="danger" className="book-price">{`${book.bookPrice} đ`}</Title>
                                {book.discount && <Tag color="volcano" className="book-discount">{`${book.discount}% off`}</Tag>}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0' }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );
};

export default Homepage;
