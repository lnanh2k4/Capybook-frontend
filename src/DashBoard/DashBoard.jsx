import React from "react";
import "./Dashboard.css";
import DashboardContainer from "./DashBoardContainer.jsx";

function Dashboard() {
  return (
    <div className="main-container">
      {/* Left Sidebar (DashboardContainer) */}
      <div className="dashboard-container">
        <DashboardContainer />
      </div>

      {/* Right Side Content */}
      <div className="dashboard-content">
        <h1>Welcome to Capybook Management System</h1>
        <p>Here is where you can manage your books, orders, promotions, and more.</p>
      </div>

      {/* Footer */}
      <div className="copyright">
        <div>© Copyright {new Date().getFullYear()}</div>
        <div>Capybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
}

export default Dashboard;
