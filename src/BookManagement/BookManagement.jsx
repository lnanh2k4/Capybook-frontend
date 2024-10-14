import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './BookManagement.css';

function BookManagement() {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [formData, setFormData] = useState({
        title: '',
        publicationYear: '',
        author: '',
        dimensions: '',
        translator: '',
        hardcover: '',
        publisher: '',
        weight: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [books, setBooks] = useState([
        { id: 1, title: 'Book A', author: 'Nguyen Van A', translator: 'Nguyen Van B', price: '50.000' },
        { id: 2, title: 'Book B', author: 'Nguyen Van A', translator: 'Nguyen Van B', price: '35.000' },
        { id: 3, title: 'Book C', author: 'Nguyen Van A', translator: 'Nguyen Van B', price: '30.000' },
        { id: 4, title: 'Book D', author: 'Nguyen Van A', translator: 'Nguyen Van B', price: '35.000' },
        { id: 5, title: 'Book E', author: 'Nguyen Van A', translator: 'Nguyen Van B', price: '120.000' },
    ]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const goToAddBook = () => {
        navigate('/add-book');
    };
    const goToEditBook = () => {
        navigate('/book-edit');

    };
    const goToBookDetail = () => {
        navigate('/book-detail');
    };

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
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.translator}</td>
                                <td>{book.price}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={goToBookDetail}>Detail</button>
                                        <button className="edit" onClick={goToEditBook}>Edit</button>
                                        <button className="delete">Delete</button>
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

export default BookManagement; // Exporting the correct component name
