import axios from 'axios';

// Tạo một instance axios với baseURL là đường dẫn API backend
const client = axios.create({
    baseURL: 'http://localhost:6789/api/'  // Cấu hình baseURL của API
});

// Hàm lấy danh sách các category
export const fetchCategories = () => client.get('v1/categories/');

// Hàm lấy chi tiết một category theo ID
export const fetchCategoryById = (id) => {
    console.log("Fetching category detail for ID:", id);  // Log the ID
    return client.get(`/v1/categories/${id}`);
};

// Hàm thêm mới một category
export const createCategory = (categoryData) => client.post('/v1/categories/', categoryData);

// Hàm cập nhật thông tin category theo ID
export const updateCategory = (id, categoryData) => {
    console.log("Updating category with ID:", id);  // Log the ID
    return client.put(`/v1/categories/${id}`, categoryData);
};

// Hàm xóa category theo ID
export const deleteCategory = (id) => {
    console.log("Deleting category with ID:", id);  // Log the ID
    return client.delete(`/v1/categories/${id}`);
};
