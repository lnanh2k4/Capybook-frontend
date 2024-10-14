import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import './ViewBookDetail.css';

const sampleBook = {
    title: 'The Great Gatsby',
    publicationYear: '1925',
    author: 'F. Scott Fitzgerald',
    dimensions: '5 x 8 inches',
    translator: '',
    hardcover: 'Yes',
    publisher: 'Scribner',
    weight: '0.5 lbs',
    description: 'A novel set in the 1920s that explores themes of decadence, idealism, resistance to change, and social upheaval.',
    image: null
};

function ViewBookDetail() {
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

    const navigate = useNavigate(); // Thêm useNavigate để điều hướng

    useEffect(() => {
        // Load the sample book data when the component mounts
        loadSampleData();
    }, []);

    const loadSampleData = () => {
        setFormData(sampleBook);
        setImagePreview(null); // Reset the image preview if necessary
    };

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
                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title of the book" />
                        </div>
                        <div className="form-group">
                            <label>Publication Year</label>
                            <input type="text" name="publicationYear" value={formData.publicationYear} onChange={handleChange} placeholder="Publication year" />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author of the book" />
                        </div>
                        <div className="form-group">
                            <label>Dimensions</label>
                            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="Dimensions of the book" />
                        </div>
                    </div>

                    <div className="form-center">
                        <div className="form-group">
                            <label>Translator</label>
                            <input type="text" name="translator" value={formData.translator} onChange={handleChange} placeholder="Translator of the book" />
                        </div>
                        <div className="form-group">
                            <label>Hardcover</label>
                            <input type="text" name="hardcover" value={formData.hardcover} onChange={handleChange} placeholder="Hardcover of the book" />
                        </div>
                        <div className="form-group">
                            <label>Publisher</label>
                            <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher of the book" />
                        </div>
                        <div className="form-group">
                            <label>Weight</label>
                            <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight of the book" />
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
                    </div>

                    <div className="form-bottom">
                        <div className="form-group">
                            <label className='description'>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description of the book" />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="button" onClick={goToBookManagement}>Cancel</button> </div>
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
