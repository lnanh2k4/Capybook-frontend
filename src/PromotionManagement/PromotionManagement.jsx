import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionManagement.css";
import { fetchPromotions, deletePromotion } from "../config";

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState([]);

  // useEffect để lấy dữ liệu từ API hoặc nguồn dữ liệu khác
  useEffect(() => {
    fetchPromotions()
      .then((response) => {
        console.log("Fetched promotion data:", response.data);
        // Kiểm tra xem dữ liệu trả về có phải là một mảng không
        if (Array.isArray(response.data)) {
          // Lọc các khuyến mãi có proStatus === 1
          const activePromotions = response.data.filter(
            (promo) => promo.proStatus === 1
          );
          setPromotions(activePromotions); // Chỉ thêm những khuyến mãi có proStatus = 1 vào state
        } else {
          console.error("Expected an array but got", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching promotion:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const goToAddPromotion = () => {
    navigate("/dashboard/add-promotion");
  };

  const goToEditPromotion = (proID) => {
    navigate(`/dashboard/edit-promotion/${proID}`);
  };

  const goToPromotionDetail = (proID) => {
    navigate(`/dashboard/promotion-detail/${proID}`);
  };

  // Hàm xử lý khi bấm nút Delete
  const handleDelete = (proID) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      deletePromotion(proID)
        .then(() => {
          // Sau khi xóa thành công, cập nhật danh sách khuyến mãi
          setPromotions(promotions.filter((promo) => promo.proID !== proID));
          alert("Promotion deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting promotion:", error);
          alert("Failed to delete promotion");
        });
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
            {Array.isArray(promotions) && promotions.length > 0 ? (
              promotions.map((promo) => (
                <tr key={promo.proID}>
                  <td>{promo.proID}</td>
                  <td>{promo.proName}</td>
                  <td>{promo.proCode}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.startDate}</td>
                  <td>{promo.endDate}</td>
                  <td>
                    <button
                      className="detail-btn"
                      onClick={() => goToPromotionDetail(promo.proID)}
                    >
                      Detail
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => goToEditPromotion(promo.proID)} // Sử dụng hàm callback để điều hướng
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(promo.proID)}
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

export default PromotionManagement;
