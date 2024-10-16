import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { fetchSupplierDetail } from '../config'; // Import API to fetch supplier details
import './ViewSupplierDetail.css';
import DashboardContainer from "../DashBoardContainer.jsx"; // Importing dashboard container for consistency

function ViewSupplierDetail() {
    const { supID } = useParams(); // Get supID from the URL
    const navigate = useNavigate(); // Use navigate for redirection
    const [formData, setFormData] = useState({});

    console.log("supID received from URL:", supID);

    useEffect(() => {
        // Fetch supplier data when the component mounts
        fetchSupplierDetail(supID)
            .then((response) => {
                console.log("Fetched supplier data:", response.data); // Log the fetched data
                setFormData(response.data); // Update form data with fetched supplier info
            })
            .catch((error) => {
                console.error("Error fetching supplier details:", error);
            });
    }, [supID]); // Re-run when supID changes

    const goToSupplierManagement = () => {
        navigate('/dashboard/suppliers'); // Navigate back to Supplier Management
    };

    return (
        <div className="main-container">
            {/* Dashboard section */}
            <DashboardContainer />

            {/* Supplier details section */}
            <div className="view-supplier-container">
                <form className="view-supplier-form">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Supplier Name</label>
                            <input type="text" name="supName" value={formData.supName || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Supplier Email</label>
                            <input type="text" name="supEmail" value={formData.supEmail || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Supplier Phone</label>
                            <input type="text" name="supPhone" value={formData.supPhone || ''} readOnly />
                        </div>
                    </div>

                    <div className="form-center">
                        <div className="form-group">
                            <label>Supplier Address</label>
                            <input type="text" name="supAddress" value={formData.supAddress || ''} readOnly />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="button" onClick={goToSupplierManagement}>Back</button>
                    </div>
                </form>
            </div>

            {/* Footer section */}
            <div className="titlemanagement">
                <div> Supplier Management - View Supplier Detail </div>
            </div>
            <div className="copyright">
                <div>© {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default ViewSupplierDetail;
