import axios from 'axios';
const URLString = 'http://localhost:6789/api/'
const client = axios.create({
    baseURL: URLString, // Địa chỉ API của bạn
});

export const fetchStaffById = (id) => {
    return client.get(`/v1/staff/${id}`).then((response) => {
        console.log("Fetched Staff Data:", response.data);
        return response;
    });
};

export const fetchStaffs = () => client.get('v1/staff/');

const addAccount = (account) => {
    return client.post('v1/accounts/', account, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
const registerAccount = (account) => {
    return client.post('v1/accounts/register', account, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
const fetchAccounts = () => client.get('v1/accounts/');
const fetchAccountDetail = (username) => client.get(`v1/accounts/${username}`);
const deleteAccount = (username) => client.delete(`v1/accounts/${username}`);
const updateAccount = (username, formDataToSend) => {
    return axios.put(`${URLString}v1/accounts/${username}`, formDataToSend);
};
const searchAccount = (keyword) => client.get(`v1/accounts/search?keyword=${keyword}`);

const fetchNotifications = () => client.get('v1/notifications/');
const addNotification = (notification) => {
    return client.post('v1/notifications/', notification, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

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


// Soft-delete a supplier (hide it) by ID
const deleteSupplier = (id) => client.delete(`/suppliers/${id}`);
const updateSupplier = (supID, supplierData) => {
    return client.put(`/v1/suppliers/${supID}`, supplierData, {
        headers: {
            'Content-Type': 'application/json', // Đảm bảo kiểu nội dung là JSON
        }
    });
}
// Fetch supplier by ID (Duplicate method - either remove or keep as an alias to fetchSupplierDetail)
const fetchSupplierById = (supID) => client.get(`/v1/suppliers/${supID}`);

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

const searchPromotions = (searchTerm) => {
    return client.get(`/v1/promotions/search?term=${searchTerm}`);
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
    return client.put(`/v1/categories/${catID}/soft-delete`);
};



const searchCategories = (searchTerm) => {
    return client.get(`/v1/categories/search?term=${searchTerm}`);
};

const fetchCategoryById = (catID) => client.get(`/v1/categories/${catID}`);

const fetchOrders = () => client.get('v1/orders/');

const searchOrders = (searchTerm) => {
    return client.get(`/v1/orders/search?term=${searchTerm}`);
};

const deleteOrder = (orderID) => {
    console.log("Soft deleting order with ID:", orderID);
    return client.put(`/v1/orders/${orderID}/soft-delete`); // Sử dụng PUT thay vì DELETE
};

const updateOrder = (orderID, orderData) => {
    console.log("Order ID:", orderID);
    console.log("Order Data:", orderData);
    return client.put(`/v1/orders/${orderID}`, orderData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const addOrder = (orderData) => {
    return client.post('/v1/orders/', orderData, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

const fetchOrderDetailsByOrderID = (id) => {
    return axios.get(`/api/v1/orders/details/${id}`);
};

export const fetchOrderDetail = (orderID) => client.get(`/v1/orders/${orderID}`);

const fetchImportStocks = async () => {
    try {
        const response = await client.get('/v1/importStock/'); // Đảm bảo đây là GET yêu cầu
        console.log('fetchImportStocks response:', response);
        return response;
    } catch (error) {
        console.error('Error in fetchImportStocks:', error);
        throw error;
    }
};


const fetchImportStockById = async (id) => {
    return await client.get(`/Inventory/${id}`);
};

const updateImportStock = async (id, data) => {
    return await client.put(`/Inventory/${id}`, data);
};

const createImportStock = async (importStockData) => {
    return client.post(`/v1/importStock/`, importStockData); // Sửa lại endpoint cho đúng
};





const deleteImportStock = async (id) => {
    return await client.delete(`/Inventory/${id}`);
};

export const fetchImportStockDetailsByStockId = (id) => {
    return client.get(`/v1/importStock/${id}/details`);
};





export {
    fetchOrderDetailsByOrderID,
    addOrder,
    updateOrder,
    fetchImportStocks,
    fetchImportStockById,
    updateImportStock,
    createImportStock,
    deleteImportStock,
    fetchSupplierById,
    updateSupplier,
    fetchSupplierDetail,
    deleteSupplier,
    addSupplier,
    fetchSuppliers,
    fetchBookById,
    deleteBook,
    updateBook,
    addBook,
    fetchBookDetail,
    fetchBooks,
    addNotification,
    fetchAccounts,
    deleteOrder,
    searchOrders,
    fetchOrders,
    searchPromotions,
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
    fetchNotifications,
    searchAccount,
    registerAccount
};

