import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./DashBoardView.css";
function DashboardContainer() {
  const navigate = useNavigate(); // Initialize useNavigate inside the component

  // Define navigation functions inside DashboardContainer

  const goToAccountManagement = () => {
    navigate("/dashboard/accounts");
  };

  const goToBookManagement = () => {
    navigate("/dashboard/books");
  };

  const goToOrderManagement = () => {
    navigate("/dashboard/order-management");
  };


  const goToPromotionManagement = () => {
    navigate("/dashboard/promotion-management");
  };

  const goToSupplierManagement = () => {
    navigate("/dashboard/suppliers");
  };

  return (
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
        <div className="dashboard-item" onClick={goToAccountManagement}>
          <i className="fas fa-user dashboard-icon"></i>
          <p>Account Management</p>
        </div>
        <div className="dashboard-item" onClick={goToBookManagement}>
          <i className="fas fa-user dashboard-icon"></i>
          <p>Book Management</p>

        </div>
        <div className="dashboard-item" onClick={goToOrderManagement}>
          <i className="fas fa-tags dashboard-icon"></i>
          <p>Order Management</p>
        </div>
        <div className="dashboard-item" onClick={goToPromotionManagement}>
          <i className="fas fa-tags dashboard-icon"></i>
          <p>Promotion Management</p>
        </div>
        <div className="dashboard-item">
          <i className="fas fa-tags dashboard-icon"></i>
          <p>Category Management</p>
        </div>
        <div className="dashboard-item" onClick={goToSupplierManagement}>
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
        <img src="/back_icon.png" className="leave-logo-image" alt="Back" />
      </div>
    </div>
  );
}

export default DashboardContainer;
