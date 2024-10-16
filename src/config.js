import axios from 'axios';
const URLString = 'http://localhost:6789/api/'
const client = axios.create({
    baseURL: URLString, // Địa chỉ API của bạn
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

    return axios.put(`${URLString}v1/books/${bookId}`, formDataToSend);
};
const deleteBook = (id) => client.delete(`/books/${id}`);
const fetchBookById = (bookId) => client.get(`/v1/books/${bookId}`);

const fetchSuppliers = () => client.get('v1/suppliers/');
// Fetch supplier details by ID
const fetchSupplierDetail = (supID) => {
    console.log("Fetching supplier detail for ID:", supID);  // Log the supID
    return client.get(`/v1/suppliers/${supID}`);
};

// Add a new supplier

const addSupplier = (supplier) => client.post('/v1/suppliers/', supplier);

// Update an existing supplier by ID
const updateSupplier = (supID, supplierData) => {
    return client.put(`/v1/suppliers/${supID}`, supplierData, {
        headers: {
            'Content-Type': 'application/json', // Đảm bảo kiểu nội dung là JSON
        }
    });
}
// Soft-delete a supplier (hide it) by ID
const deleteSupplier = (id) => client.delete(`/suppliers/${id}`);

// Fetch supplier by ID (Duplicate method - either remove or keep as an alias to fetchSupplierDetail)
const fetchSupplierById = (supID) => client.get(`/v1/suppliers/${supID}`);


export { fetchAccounts, fetchBooks, fetchBookDetail, addBook, updateBook, deleteBook, fetchBookById, fetchSuppliers, fetchSupplierDetail, addSupplier, updateSupplier, deleteSupplier, fetchSupplierById }

const fetchPromotions = () => client.get('v1/promotions/');

const fetchPromotionDetail = (proID) => {
    console.log("Fetching promotion detail for ID:", proID);  // Log the proID
    return client.get(`/v1/promotions/${proID}`);
};

const addPromotion = (promotion) => client.post('/v1/promotions/', promotion);

const updatePromotion = (id, promotion) => client.put(`/v1/promotions/${id}`, promotion);

const deletePromotion = (proID) => {
    console.log("Marking promotion as deleted with ID:", proID);  // Kiểm tra proID trước khi gọi API
    return client.delete(`/v1/promotions/${proID}`);  // Sử dụng PUT thay vì DELETE
};


export { fetchPromotions, fetchPromotionDetail, addPromotion, updatePromotion, deletePromotion }


