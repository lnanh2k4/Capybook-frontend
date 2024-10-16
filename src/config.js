import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:6789/api/', // Địa chỉ API của bạn
});

const fetchAccounts = () => client.get('v1/accounts/');
const fetchBooks = () => client.get('v1/books/');
const fetchBookDetail = (id) => client.get(`/v1/books/${id}`); // Hàm lấy chi tiết sách


const addBook = (formData) => {
    return client.post('v1/books/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
const updateBook = (bookId, formDataToSend) => {
    return axios.put(`http://localhost:6789/api/v1/books/${bookId}`, formDataToSend);
};
const deleteBook = (id) => client.delete(`/books/${id}`);
const fetchBookById = (bookId) => client.get(`/v1/books/${bookId}`);

const searchBooks = (searchTerm) => {
    return axios.get(`http://localhost:6789/api/v1/books/search`, {
        params: { query: searchTerm }
    });
};

export { fetchAccounts, fetchBooks, fetchBookDetail, addBook, updateBook, deleteBook, fetchBookById, searchBooks }
