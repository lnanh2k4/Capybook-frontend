import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:6789/api/'
});

export const fetchBooks = () => client.get('v1/books/');
export const fetchBookDetail = (id) => client.get(`/v1/books/${id}`); // Hàm lấy chi tiết sách
export const addBook = (book) => client.post('/books/', book);
export const updateBook = (id, book) => client.put(`/books/${id}`, book);
export const deleteBook = (id) => client.delete(`/books/${id}`);
export const fetchBookById = (bookId) => client.get(`/v1/books/${bookId}`);

