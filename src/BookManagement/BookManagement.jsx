import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookManagement.css'; // Import CSS for styling
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { fetchBooks, updateBook, fetchBookById } from '../config'; // Import functions from the API
import { Space, Table, Tag, Button, Input, message } from 'antd';

const { Search } = Input;

function BookManagement() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search state to filter books
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            try {
                const response = await fetchBooks();
                setBooks(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching books:', error);
                setError('Failed to fetch books');
                message.error('Failed to fetch books');
            }
            setLoading(false);
        };

        loadBooks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this book?")) {
            try {
                const currentBookData = await fetchBookById(id);

                const updatedBookData = {
                    ...currentBookData.data,
                    bookStatus: 0
                };

                const formDataToSend = new FormData();
                formDataToSend.append('book', JSON.stringify(updatedBookData));

                if (currentBookData.data.image) {
                    const imageFile = currentBookData.data.image;
                    formDataToSend.append('image', imageFile);
                }

                await updateBook(id, formDataToSend);
                setBooks(books.map(book =>
                    book.bookID === id ? { ...book, bookStatus: 0 } : book
                ));
                message.success('Book deactivated successfully');
            } catch (error) {
                console.error('Error deactivating book:', error);
                message.error('Failed to deactivate book');
            }
        }
    };

    const goToAddBook = () => {
        navigate('/dashboard/books/add');
    };

    const goToEditBook = (bookId) => {
        navigate(`/dashboard/books/edit/${bookId}`);
    };

    const goToBookDetail = (bookId) => {
        navigate(`/dashboard/books/detail/${bookId}`);
    };

    const columns = [
        {
            title: 'Book ID',
            dataIndex: 'bookID',
            key: 'bookID',
        },
        {
            title: 'Title',
            dataIndex: 'bookTitle',
            key: 'bookTitle',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Translator',
            dataIndex: 'translator',
            key: 'translator',
        },
        {
            title: 'Price',
            dataIndex: 'bookPrice',
            key: 'bookPrice',
        },
        {
            title: 'Status',
            dataIndex: 'bookStatus',
            key: 'bookStatus',
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'volcano'}>
                    {status === 1 ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => goToBookDetail(record.bookID)}>Detail</Button>
                    {record.bookStatus === 1 && (
                        <>
                            <Button type="link" onClick={() => goToEditBook(record.bookID)}>Edit</Button>
                            <Button type="link" danger onClick={() => handleDelete(record.bookID)}>Delete</Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];
    const filteredBooks = books.filter(book =>
    (book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Book Management</div>
                </div>
                <div className="action-container">
                    <Button type="primary" onClick={goToAddBook}>Add book</Button>
                    <Search
                        placeholder="Search by title or author"
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 300, marginLeft: '20px' }}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredBooks} // Use filteredBooks here
                    rowKey={record => record.bookID}
                />
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default BookManagement;
