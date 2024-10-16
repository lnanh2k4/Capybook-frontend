import React, { useEffect, useState } from 'react';
import { fetchBooks, updateBook, fetchBookById } from '../config'; // Import functions from the API
import { useNavigate } from 'react-router-dom';
import './BookManagement.css'; // Import CSS for styling
import DashboardContainer from "../DashBoardContainer.jsx";
function BookManagement() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search state to filter books

    useEffect(() => {
        fetchBooks().then(response => {
            console.log("Fetched books data:", response.data); // Log fetched book data
            setBooks(response.data);
        }).catch(error => {
            console.error('Error fetching books:', error);
        });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this book?")) {
            try {
                // Fetch the current book data by its ID
                const response = await fetchBookById(id);
                const currentBookData = response.data;

                // Update the book status to 0 (deactivated)
                const updatedBookData = {
                    ...currentBookData,
                    bookStatus: 0
                };

                const formDataToSend = new FormData();
                formDataToSend.append('book', JSON.stringify(updatedBookData));

                // Append the image file if it exists
                if (currentBookData.image) {
                    const imageFile = currentBookData.image;
                    formDataToSend.append('image', imageFile);
                }

                // Update the book
                await updateBook(id, formDataToSend);

                // Update the state to reflect the change
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

    // Filter the books that are active and match the search term
    const activeBooks = books.filter(book =>
        book.bookStatus === 1 &&
        (book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="titlemanagement">
                <div> Book Management</div>
            </div>

            <div className="table-container">
                <div className="action-container">
                    <button className='add-book' onClick={goToAddBook}>Add book</button>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} // Handle search input change
                        />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title</th>
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
                                <td>{book.bookPrice}</td>
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
