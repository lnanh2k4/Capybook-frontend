import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../config';
import './AddBook.css';

function AddBook() {
    const [formData, setFormData] = useState({
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
        isbn: '',
        bookQuantity: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: file });
        } else {
            setFormData({
                ...formData,
                [name]: value // Cập nhật giá trị cho trường đang thay đổi
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();

            // Tạo đối tượng dữ liệu sách
            const bookData = {
                bookTitle: formData.bookTitle,
                publicationYear: formData.publicationYear,
                author: formData.author,
                dimension: formData.dimension, // Khớp với tên cột trong database
                translator: formData.translator,
                hardcover: formData.hardcover,
                publisher: formData.publisher,
                weight: formData.weight,
                bookDescription: formData.bookDescription, // Khớp với tên cột trong database
                bookPrice: formData.bookPrice, // Khớp với tên cột trong database
                isbn: formData.isbn,
                bookStatus: 1,
                bookQuantity: formData.bookQuantity
            };

            formDataToSend.append('book', JSON.stringify(bookData));

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await addBook(formDataToSend);
            navigate("/dashboard/books");
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleReset = () => {
        setFormData({
            bookTitle: '',
            publicationYear: '',
            author: '',
            dimension: '', // Khớp với tên cột trong database
            translator: '',
            hardcover: '',
            publisher: '',
            weight: '',
            bookDescription: '', // Khớp với tên cột trong database
            image: null,
            bookPrice: '', // Khớp với tên cột trong database
            isbn: '',
            bookQuantity: ''
        });
        setImagePreview(null);
    };

    const goToBookManagement = () => {
        navigate("/dashboard/books");
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
                    <div className="dashboard-item" onClick={goToBookManagement}>
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
            <div className="add-book-container">
                <form className="add-book-form" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="bookTitle"
                                value={formData.bookTitle || ''}
                                onChange={handleChange}
                                placeholder="Title of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Publication Year</label>
                            <input
                                type="text"
                                name="publicationYear"
                                value={formData.publicationYear || ''}
                                onChange={handleChange}
                                placeholder="Publication year"
                            />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author || ''}
                                onChange={handleChange}
                                placeholder="Author of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Dimensions</label>
                            <input
                                type="text"
                                name="dimension"
                                value={formData.dimension || ''}
                                onChange={handleChange}
                                placeholder="Dimensions of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="text"
                                name="bookPrice"
                                value={formData.bookPrice || ''}
                                onChange={handleChange}
                                placeholder="Price of the book"
                            />
                        </div>
                    </div>

                    <div className="form-center">
                        <div className="form-group">
                            <label>Translator</label>
                            <input
                                type="text"
                                name="translator"
                                value={formData.translator || ''}
                                onChange={handleChange}
                                placeholder="Translator of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Hardcover</label>
                            <input
                                type="text"
                                name="hardcover"
                                value={formData.hardcover || ''}
                                onChange={handleChange}
                                placeholder="Hardcover of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Publisher</label>
                            <input
                                type="text"
                                name="publisher"
                                value={formData.publisher || ''}
                                onChange={handleChange}
                                placeholder="Publisher of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Weight</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight || ''}
                                onChange={handleChange}
                                placeholder="Weight of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Isbn</label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn || ''}
                                onChange={handleChange}
                                placeholder="International Standard Book Number"
                            />
                        </div>
                    </div>

                    <div className="form-right">
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Selected Preview" />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Image</label>
                            <input type="file" name="image" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="text"
                                name="bookQuantity"
                                value={formData.bookQuantity || ''}
                                onChange={handleChange}
                                placeholder="Quantity of the book"
                            />
                        </div>
                    </div>

                    <div className="form-bottom">
                        <div className="form-group">
                            <label className="description">Description</label>
                            <textarea
                                name="bookDescription"
                                value={formData.bookDescription || ''}
                                onChange={handleChange}
                                placeholder="Description of the book"
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div> Book Management - Add Book </div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default AddBook;
