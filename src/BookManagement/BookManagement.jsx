import React, { useEffect, useState } from 'react';
import { fetchBooks, updateBook, fetchBookById } from '../config'; // Import các function từ api.js
import { useNavigate } from 'react-router-dom';
import './BookManagement.css'; // Import file CSS

function BookManagement() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks().then(response => {
            console.log("Fetched books data:", response.data); // In dữ liệu sách ra console
            setBooks(response.data);
        }).catch(error => {
            console.error('Error fetching books:', error);
        });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this book?")) {
            try {
                // Fetch the current book data by its ID (assuming `fetchBookById` is an API call you have).
                const response = await fetchBookById(id);
                const currentBookData = response.data; // Get the existing book data

                // Update the bookStatus to 0
                const updatedBookData = {
                    ...currentBookData,
                    bookStatus: 0 // Set the bookStatus to 0 for deactivation
                };

                // Create a FormData object
                const formDataToSend = new FormData();
                formDataToSend.append('book', JSON.stringify(updatedBookData));

                // Append the image file if it exists
                if (currentBookData.image) {
                    const imageFile = currentBookData.image;
                    formDataToSend.append('image', imageFile);
                }

                await updateBook(id, formDataToSend);

                setBooks(books.map(book =>
                    book.bookID === id ? { ...book, bookStatus: 0 } : book
                ));
            } catch (error) {
                console.error('Error deactivating book:', error);
            }
        }
    };

    const goToAddBook = () => {
        navigate('/dashboard/books/addbook');
    };
    const goToEditBook = (bookId) => {
        navigate(`/dashboard/books/edit/${bookId}`);
    };
    const goToBookDetail = (bookId) => {
        navigate(`/dashboard/books/detail/${bookId}`);
    };
    const activeBooks = books.filter(book => book.bookStatus === 1);
    return (
        <div className="main-container">
            <div className="dashboard-container-alt">
                <div className="logo-container">
                    <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
                </div>
                <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-item">
                        <i className="fas fa-book dashboard-icon"></i>
                        <p>Account Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-user dashboard-icon"></i>
                        <p>Book Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Order Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Promotion Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Category Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Supplier Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Inventory Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Notification Management</p>
                    </div>
                </div>
                <div className="leave-logo-container">
                    <img src="/back_icon.png" className="leave-logo-image" />
                </div>
            </div>
            <div className="titlemanagement">
                <div> Book Management</div>
            </div>
            <div className="table-container">
                <div className="action-container">
                    <button className='add-book' onClick={goToAddBook}>Add book</button> {/* Navigate to Add Book page */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                        />
                        <button className="search-button">Search</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title Book</th>
                            <th>Author</th>
                            <th>Translator</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {activeBooks.map((book) => (
                            <tr key={book.bookID}>
                                <td>{book.bookID}</td>
                                <td>{book.bookTitle}</td>
                                <td>{book.author}</td>
                                <td>{book.translator}</td>
                                <td>{book.bookPrice}</td> {/* Ensure correct case for price field */}
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={() => goToBookDetail(book.bookID)}>Detail</button>
                                        <button className="edit" onClick={() => goToEditBook(book.bookID)}>Edit</button>
                                        <button className="delete" onClick={() => handleDelete(book.bookID)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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