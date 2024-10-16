import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, updateBook } from '../config';
import DashboardContainer from "../DashBoardContainer.jsx";
function EditBook() {
    const { bookId } = useParams(); // Lấy bookId từ URL
    const navigate = useNavigate();

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
        bookPrice: '', // Đúng với tên cột trong database
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (bookId) {
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
        } else {
            console.error('bookId is not defined');
        }
    }, [bookId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            setImagePreview(URL.createObjectURL(file)); // Hiển thị ảnh mới
            setFormData({ ...formData, image: file });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

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

            await updateBook(bookId, formDataToSend);
            navigate("/dashboard/books");
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const goToBookManagement = () => {
        navigate("/dashboard/books");
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="add-book-container">
                <form className="add-book-form" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="bookTitle"
                                value={formData.bookTitle || ''} // Đảm bảo không bao giờ là undefined
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
                                name="dimension" // Changed from "dimensions" to "dimension"
                                value={formData.dimension || ''}
                                onChange={handleChange}
                                placeholder="Dimensions of the book"
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="text" name="bookPrice" value={formData.bookPrice} onChange={handleChange} placeholder="Price of the book" />
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
                            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="International Standard Book Number" />
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

                    <div className="form-group">
                        <label className="description">Description</label>
                        <textarea
                            name="bookDescription" // Changed from "description" to "bookDescription"
                            value={formData.bookDescription || ''}
                            onChange={handleChange}
                            placeholder="Description of the book"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit </button>
                        <button type="button" onClick={goToBookManagement}>Cancel</button>
                    </div>
                </form>

            </div>

            <div className="titlemanagement">
                <div>Book Management - Edit Book</div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default EditBook;
