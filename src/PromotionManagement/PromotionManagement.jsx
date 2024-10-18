import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPromotions, deletePromotion } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState([]);

  // useEffect để lấy dữ liệu từ API hoặc nguồn dữ liệu khác
  useEffect(() => {
    fetchPromotions()
      .then((response) => {
        console.log("Fetched promotion data:", response.data);
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

  const handleDelete = async (proID) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        // Fetch the current promotion details
        const response = await fetchPromotions(proID);
        const currentPromotionData = response.data;

        // Create a new FormData object to send the updated promotion status
        const formDataToSend = new FormData();
        formDataToSend.append(
          "promotion",
          JSON.stringify({ ...currentPromotionData, proStatus: 0 })
        );

        // Send the updated promotion data to the server
        await deletePromotion(proID, formDataToSend);

        // Update the promotions state to reflect the soft delete
        setPromotions(
          promotions.map((promo) =>
            promo.proID === proID ? { ...promo, proStatus: 0 } : promo
          )
        );

        alert("Promotion marked as deleted successfully!");
      } catch (error) {
        console.error("Error marking promotion as deleted:", error);
        alert("Failed to mark promotion as deleted.");
      }
    }
  };

  const activePromotions = promotions.filter(
    (promo) =>
      promo.proStatus === 1 &&
      (promo.proName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.proCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  return (
    <div className="main-container">
      <DashboardContainer />
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
            {Array.isArray(activePromotions) && activePromotions.length > 0 ? (
              activePromotions.map((promo) => (
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
                      onClick={() => goToEditPromotion(promo.proID)}
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
