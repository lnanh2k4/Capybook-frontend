import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Menu,
  Card,
  Input,
  Row,
  Col,
  Tag,
  Typography,
  Dropdown,
  Button,
  Select,
  Divider,
  TreeSelect,
  Modal,
  message,
  notification
} from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { fetchBooks, fetchAccountDetail, fetchCategories, logout, sortBooks, fetchNotifications, fetchBooksByCategory, searchBook } from "../config"; // Fetch books and categories from API
import { decodeJWT } from "../jwtConfig";
import { set } from "@ant-design/plots/es/core/utils";

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const Homepage = () => {
  const [books, setBooks] = useState([]); // State for books
  const [categories, setCategories] = useState([]); // State for categories
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
  const [sortOrder, setSortOrder] = useState("default"); // State for sorting
  const [currentPage, setCurrentPage] = useState({}); // Track the current page for each category
  const [isTransitioning, setIsTransitioning] = useState(false); // Track animation state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [modalBooks, setModalBooks] = useState([]); // Books to display in the modal
  const [modalCategory, setModalCategory] = useState(null); // The selected category for the modal
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for routing

  // Fetch books and categories when the component mounts
  useEffect(() => {
    fetchBooks().then(response => {
      console.log(response)
      setBooks(response.data);
    }).catch(error => {
      console.error('Failed to fetch books:', error);
    });

    fetchCategories().then(response => {
      setCategories(response.data.filter(category => category.catStatus != 0));
    }).catch(error => {
      console.error('Failed to fetch categories:', error);
    });


  }, []);
  // Hàm xây dựng cấu trúc treeData cho TreeSelect
  const buildTreeData = (categories) => {
    const map = {};
    const roots = [];
    roots.push(map[0] = {
      title: "All",
      value: 0,
      key: 0
    })
    categories.forEach((category) => {
      map[category.catID] = {
        title: category.catName,
        value: category.catID,
        key: category.catID,
      };
      roots.push(map[category.catID])
    });

    return roots;
  };
  // Handle search input
  const handleSearch = async (value) => {
    setLoading(true); // Kích hoạt trạng thái tải
    try {
      if (!value.trim()) {
        // Nếu searchTerm trống, hiển thị toàn bộ sách
        const response = await fetchBooks(); // Gọi API để lấy tất cả sách
        setBooks(response.data.filter((book) => book.bookStatus === 1)); // Lọc sách hợp lệ
        message.info("Displaying all books."); // Hiển thị thông báo
      } else {
        // Nếu có từ khóa, thực hiện tìm kiếm
        const response = await searchBook(value); // Gọi API tìm kiếm
        setBooks(response.data);
        message.success("Search completed."); // Hiển thị thông báo
      }
    } catch (error) {
      console.error("Error searching books:", error);
      message.error("Failed to load books.");
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };


  // Handle sorting
  const handleSortChange = async (value) => {
    try {
      setSortOrder(value);
      const [sortBy, sortOrder = "asc"] = value.split(/(?=[A-Z])/); // Phân tách `value` thành `sortBy` và `sortOrder`
      const response = await sortBooks(sortBy.toLowerCase(), sortOrder.toLowerCase()); // Gọi API với đúng tham số
      setBooks(response.data); // Cập nhật danh sách sách đã được sắp xếp từ backend
    } catch (error) {
      console.error("Failed to sort books:", error);
      message.error("Failed to sort books. Please try again."); // Hiển thị thông báo lỗi
    }
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
  const filteredBooks = async (categoryID) => {

    if (categoryID != 0) {
      try {
        const response = await fetchBooksByCategory(categoryID);
        console.log(response);
        setBooks(response.data.filter((book) => book.bookStatus === 1));// Chỉ lấy sách có trạng thái hợp lệ
        setSelectedCategory(categoryID);
      } catch {
        const response = await fetchBooks();
        setBooks(response.data.filter((book) => book.bookStatus === 1));// Chỉ lấy sách có trạng thái hợp lệ
        setSelectedCategory(0);
        message.error("There isn's any book in this category!")
      }
    } else {
      const response = await fetchBooks();
      setBooks(response.data.filter((book) => book.bookStatus === 1));// Chỉ lấy sách có trạng thái hợp lệ
      setSelectedCategory(categoryID);
    }
  }

  // Sort books based on selected criteria
  const sortedBooks = books.length > 0 ? [...books] : [...books];

  const handleNotificationClick = () => {
    navigate("/notifications")
  }
  const handleDashboardClick = () => {
    navigate("/dashboard/income-statistic");
  };

  const handleBookClick = (bookId) => {
    navigate(`/detail/${bookId}`); // Adjust this route based on your router configuration
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const showModal = (category, books) => {
    console.log("Opening modal with:", category, books); // Log modal state
    if (!books || books.length === 0) {
      console.error("No books to show in modal");
      return;
    }
    setModalCategory(category);
    setModalBooks(books);
    setIsModalVisible(true); // This should trigger modal to show
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close modal
  };

  const userMenu = () => {
    if (decodeJWT()) {
      return (
        <Menu>
          {decodeJWT().scope != "CUSTOMER" ? (
            <Menu.Item
              key="dashboard"
              icon={<AppstoreOutlined />}
              onClick={handleDashboardClick}
            >
              Dashboard
            </Menu.Item>
          ) : (
            <Menu.Item
              key="profile"
              icon={<AppstoreOutlined />}
              onClick={() => {
                navigate("/profile");
              }}
            >
              Profile
            </Menu.Item>
          )}
          <Menu.Item
            key="order-history"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate("/OrderHistory")}
          >
            Order History
          </Menu.Item>
          <Menu.Item
            key="signout"
            icon={<SettingOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      );
    } else navigate("/auth/login");
  };

  // Group books by category and paginate them
  const booksByCategory = categories
    ?.map((category) => {
      const booksInCategory = sortedBooks.filter((book) =>
        book.bookCategories?.some((bookCategory) => bookCategory.catId?.catID === category.catID)
      );
      if (booksInCategory.length === 0) {
        return null; // Loại bỏ danh mục nếu không có sách
      }
      const pages = paginateBooks(booksInCategory, 6); // 6 books per page
      return { category, pages };
    })
    .filter((item) => item !== null); // Loại bỏ các giá trị null




  // Initialize current page for each category
  useEffect(() => {
    const initialPages = {};
    booksByCategory?.forEach(({ category }) => {
      initialPages[category.catID] = 0;
    });
    setCurrentPage(initialPages);
  }, [booksByCategory]);

  const normalizeImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith("/uploads/book_")) {
      return `http://localhost:6789${imageUrl}`; // Add base URL if needed
    }
    return imageUrl || "https://via.placeholder.com/150"; // Default image
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0fa4d6",
          padding: "0 20px",
          height: "64px",
          color: "#fff",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")} // Navigate to homepage when clicked
        >
          <img
            src="/logo-capybook.png"
            alt="Capybook Logo"
            style={{ height: "40px", marginRight: "20px" }}
          />
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>Capybook</div>
        </div>

        <Search
          placeholder="Search for books or orders"
          enterButton
          style={{ maxWidth: "500px" }}
          onSearch={(value) => handleSearch(value)} // Gọi hàm tìm kiếm khi nhấn Enter
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<BellOutlined
              style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
            />}
            style={{ color: "#fff" }}
            onClick={handleNotificationClick}
          >
          </Button>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
          />
          <Dropdown
            overlay={userMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: "#fff" }}
            >
              {localStorage.getItem("jwtToken")
                ? decodeJWT(localStorage.getItem("jwtToken")).sub
                : "Login"}
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
                  onChange={(value) => filteredBooks(value)} // Gán `catID` vào `selectedCategory`
                  defaultValue={0}
                  treeData={buildTreeData(categories)}
                  style={{ width: 200 }}
                />
              </Col>

            </Row>
          </Col>
        </Row>
        <Card>
          {
            selectedCategory ?
              (
                <>
                  {categories.at(selectedCategory - 1).catName} type: {categories.at(selectedCategory - 1).catDescription}
                </>
              ) : (

                "Welcome to CapyBook!"
              )
          }
        </Card>
        <br></br>
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
                      <Button type="primary" onClick={() => showModal(category, pages.flat())}>View more</Button>
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
        title={modalCategory?.catName || "Books"}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={900}
      >
        {/* Render các sách từ modalBooks */}
        <Row gutter={[16, 16]}>
          {modalBooks.map((book) => (
            <Col key={book.bookID} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card
                hoverable
                onClick={() => handleBookClick(book.bookID)}
                cover={
                  <img
                    alt={book.bookTitle}
                    src={normalizeImageUrl(book.image)}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
              >
                <Title level={5}>{book.bookTitle}</Title>
                <Title
                  level={4}
                  type="danger"
                >{`${book.bookPrice.toLocaleString("vi-VN")} đ`}</Title>
                {book.discount && (
                  <Tag color="volcano">{`${book.discount}% off`}</Tag>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      <Footer
        style={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#343a40",
          padding: "10px 0",
        }}
      >
        <div>© {new Date().getFullYear()} Capybook Management System</div>
        <div>All Rights Reserved</div>
      </Footer>
    </Layout >
  );
};

export default Homepage;
