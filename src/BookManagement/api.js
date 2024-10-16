import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:6789/api/', // Địa chỉ API của bạn
});

export const fetchBooks = () => client.get('v1/books/');
export const fetchBookDetail = (id) => client.get(`/v1/books/${id}`); // Hàm lấy chi tiết sách


export const addBook = (formData) => {
    return client.post('v1/books/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
export const updateBook = (bookId, formDataToSend) => {
    return axios.put(`http://localhost:6789/api/v1/books/${bookId}`, formDataToSend);
};
export const deleteBook = (id) => client.delete(`api/books/${id}`);
export const fetchBookById = (bookId) => client.get(`v1/books/${bookId}`);


