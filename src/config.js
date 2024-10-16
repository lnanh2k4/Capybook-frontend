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

export { fetchAccounts, fetchBooks, fetchBookDetail, addBook, updateBook, deleteBook, fetchBookById }

const fetchPromotions = () => client.get('v1/promotions/');

const fetchPromotionDetail = (proID) => {
    console.log("Fetching promotion detail for ID:", proID);  // Log the proID
    return client.get(`/v1/promotions/${proID}`);
};

const addPromotion = (promotion) => client.post('/v1/promotions/', promotion);

const updatePromotion = (id, promotion) => client.put(`/v1/promotions/${id}`, promotion);

const deletePromotion = (proID) => {
    console.log("Deleting promotion with ID:", proID);  // Kiểm tra proID trước khi gọi API
    return client.delete(`/v1/promotions/${proID}`);
  };

  export {fetchPromotions, fetchPromotionDetail, addPromotion, updatePromotion, deletePromotion}