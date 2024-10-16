import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useParams và useNavigate
import { fetchBookById } from '../config'; // Import API để lấy chi tiết sách
import './ViewBookDetail.css';

function ViewBookDetail() {
    const { bookId } = useParams(); // Lấy bookId từ URL
    const navigate = useNavigate(); // Điều hướng giữa các trang
    const [formData, setFormData] = useState({
        bookTitle: '',
        publicationYear: '',
        author: '',
        dimension: '', // Đúng với tên cột trong database
        translator: '',
        hardcover: '',
        publisher: '',
        weight: '',
        bookDescription: '', // Đúng với tên cột trong database
        image: null,
        bookPrice: '',
        isbn: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchBookById(bookId)
            .then(response => {
                setFormData(response.data);
                const imageFromDB = response.data.image;
                if (imageFromDB && imageFromDB.startsWith(`/uploads/book_`)) {
                    const fullImagePath = `http://localhost:6789${imageFromDB}`;
                    setImagePreview(fullImagePath);
                } else {
                    setImagePreview(imageFromDB);
                }
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
            });
    }, [bookId]);


    const goToBookManagement = () => {
        navigate('/book-management'); // Điều hướng về trang Book Management
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
            <div className="add-book-container">
                <form className="add-book-form">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="bookTitle" value={formData.bookTitle} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Publication Year</label>
                            <input type="text" name="publicationYear" value={formData.publicationYear} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" name="author" value={formData.author} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Dimensions</label>
                            <input type="text" name="dimensions" value={formData.dimension} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="text" name="bookPrice" value={formData.bookPrice} readOnly />
                        </div>
                    </div>
                    <div className="form-center">
                        <div className="form-group">
                            <label>Translator</label>
                            <input type="text" name="translator" value={formData.translator} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Hardcover</label>
                            <input type="text" name="hardcover" value={formData.hardcover} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Publisher</label>
                            <input type="text" name="publisher" value={formData.publisher} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Weight</label>
                            <input type="text" name="weight" value={formData.weight} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Isbn</label>
                            <input type="text" name="isbn" value={formData.isbn} readOnly />
                        </div>
                    </div>
                    <div className="form-right">
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Selected Preview" />
                            </div>
                        )}

                    </div>
                    <div className="form-bottom">
                        <div className="form-group">
                            <label className='description'>Description</label>
                            <textarea name="description" value={formData.bookDescription} readOnly />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="button" onClick={goToBookManagement}>Cancel</button>
                    </div>

                </form>
            </div>
            <div className="titlemanagement">
                <div> Book Management - View Book Detail </div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default ViewBookDetail;
