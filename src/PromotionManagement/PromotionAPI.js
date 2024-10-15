import axios from 'axios';

// Tạo một instance axios với baseURL là đường dẫn API backend
const client = axios.create({
    baseURL: 'http://localhost:6789/api/'  // Cấu hình baseURL của API
});

// Hàm lấy danh sách tất cả các khuyến mãi
export const fetchPromotions = () => client.get('v1/promotions/');

// Hàm lấy chi tiết một khuyến mãi theo ID
export const fetchPromotionDetail = (proID) => {
    console.log("Fetching promotion detail for ID:", proID);  // Log the proID
    return client.get(`/v1/promotions/${proID}`);
};

// Hàm thêm mới một khuyến mãi
export const addPromotion = (promotion) => client.post('/v1/promotions/', promotion);

// Hàm cập nhật thông tin khuyến mãi theo ID
export const updatePromotion = (id, promotion) => client.put(`/v1/promotions/${id}`, promotion);

// Hàm xóa khuyến mãi theo ID
export const deletePromotion = (proID) => {
    console.log("Deleting promotion with ID:", proID);  // Kiểm tra proID trước khi gọi API
    return client.delete(`/v1/promotions/${proID}`);
  };
  
