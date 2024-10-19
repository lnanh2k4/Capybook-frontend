import axios from 'axios';
const URLString = 'http://localhost:6789/api/'
const client = axios.create({
    baseURL: URLString, // Địa chỉ API của bạn
});

const addAccount = (account) => {
    return client.post('v1/accounts/', account, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
const fetchAccounts = () => client.get('v1/accounts/');
const fetchAccountDetail = (username) => client.get(`v1/accounts/detail/${username}`);
const deleteAccount = (username) => client.delete(`v1/accounts/delete/${username}`);
const updateAccount = (username, formDataToSend) => {
    return axios.put(`${URLString}v1/accounts/${username}`, formDataToSend);
};
const fetchNotifications = () => client.get('v1/notifications/');

const fetchBooks = () => client.get('v1/books/');
const fetchBookDetail = (id) => client.get(`/v1/books/${id}`); // Hàm lấy chi tiết sách
const addBook = (formData) => {
    return client.post('/v1/books', formData, {
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
    console.log("Fetching promotion detail for ID:", proID);
    return client.get(`/v1/promotions/${proID}`);
};
const addPromotion = (promotion) => client.post('/v1/promotions/', promotion);
const updatePromotion = (id, promotion) => client.put(`/v1/promotions/${id}`, promotion);
const deletePromotion = (proID) => {
    console.log("Marking promotion as deleted with ID:", proID);
    return client.delete(`/v1/promotions/${proID}`);
};

const fetchPromotionById = (proID) => client.get(`/v1/promotions/${proID}`);

const fetchCategories = () => client.get('v1/categories/');
const fetchCategoryDetail = (catID) => {
    console.log("Fetching category detail for ID:", catID);
    return client.get(`/v1/categories/${catID}`);
};
const addCategory = (category) => {
    console.log("Data being sent to backend in addCategory:", category);
    return client.post('/v1/categories/', category);
};
const updateCategory = (catID, category) => client.put(`/v1/categories/${catID}`, category);
const deleteCategory = (catID) => {
    console.log("Soft deleting category with ID:", catID);
    return client.put(`/v1/categories/${catID}/soft-delete`); // Sử dụng PUT thay vì DELETE
};

const searchCategories = (searchTerm) => {
    return client.get(`/v1/categories/search?term=${searchTerm}`);
};



const fetchCategoryById = (catID) => client.get(`/v1/categories/${catID}`);

export {
    searchCategories,
    updateAccount,
    fetchPromotions,
    fetchPromotionDetail,
    addPromotion,
    updatePromotion,
    deletePromotion,
    fetchPromotionById,
    fetchAccountDetail,
    deleteAccount,
    addAccount,
    fetchCategories,
    fetchCategoryDetail,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategoryById,
    fetchNotifications
};

