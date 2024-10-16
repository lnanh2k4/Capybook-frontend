import React from "react";
import "./Dashboard.css";
import DashboardContainer from "../DashBoardContainer.jsx";

function Dashboard() {
  return (
    <div className="main-container">
      <DashboardContainer />
      <div className="copyright">
        <div>© Copyright {new Date().getFullYear()}</div>
        <div>Cabybook Management System</div>
        <div>All Rights Reserved</div>
      </div>
    </div>
  );
}

export default Dashboard;
