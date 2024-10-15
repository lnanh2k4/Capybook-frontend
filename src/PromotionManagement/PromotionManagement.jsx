import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionManagement.css";

const PromotionTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState([]);

  // useEffect để lấy dữ liệu từ API hoặc nguồn dữ liệu khác
  useEffect(() => {
    fetchPromotions()
      .then((response) => {
        console.log("Fetched promotions data:", response.data);
        setPromotions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
      });
  }, []);

  // Hàm giả định để gọi API lấy danh sách khuyến mãi - Thay thế bằng API thật
  const fetchPromotions = async () => {
    // Thay hàm này bằng API thật để lấy dữ liệu khuyến mãi từ server/backend
    return new Promise((resolve, reject) => {
      // Đoạn này hiện tại không có dữ liệu mẫu
      resolve({ data: [] }); // Trả về mảng rỗng, khi có dữ liệu thực, API sẽ trả về danh sách khuyến mãi
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToAddPromotion = () => {
    navigate("/add-promotion");
  };

  const goToEditPromotion = () => {
    navigate("/promotion-edit");
  };

  const goToPromotionDetail = () => {
    navigate("/promotion-detail");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      // Thêm code xóa khuyến mãi
      setPromotions(promotions.filter((promo) => promo.id !== id));
    }
  };

  return (
    <div className="main-container">
      <div className="dashboard-container-alt">
        <div className="logo-container">
          <img
            src="/logo-capybook.png"
            alt="Cabybook Logo"
            className="logo-image"
          />
        </div>
        <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <i className="fas fa-book dashboard-icon"></i>
            <p>Account Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-user dashboard-icon"></i>
            <p>Book Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Order Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Promotion Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Category Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Supplier Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Inventory Management</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-tags dashboard-icon"></i>
            <p>Notification Management</p>
          </div>
        </div>
        <div className="leave-logo-container">
          <img src="/back_icon.png" className="leave-logo-image" />
        </div>
      </div>
      <div className="titlemanagement">
        <div>Promotion Management</div>
      </div>
      <div className="table-container">
        <div className="action-container">
          <button className="add-promotion" onClick={goToAddPromotion}>
            Add promotion
          </button>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Promotion ID</th>
              <th>Promotion Name</th>
              <th>Promotion Code</th>
              <th>Discount</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <tr key={promo.id}>
                  <td>{promo.id}</td>
                  <td>{promo.name}</td>
                  <td>{promo.code}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.startDate}</td>
                  <td>{promo.endDate}</td>
                  <td>
                    <button
                      className="detail-btn"
                      onClick={goToPromotionDetail}
                    >
                      Detail
                    </button>
                    <button className="edit-btn" onClick={goToEditPromotion}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(promo.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No promotions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="copyright">
        <div>© {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
};

export default PromotionTable;
