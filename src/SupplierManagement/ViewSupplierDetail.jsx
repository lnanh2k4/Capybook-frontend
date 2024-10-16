import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { fetchSupplierDetail } from './SupplierApi'; // Import API to fetch supplier details
import './ViewSupplierDetail.css';

function ViewSupplierDetail() {
    const { supID } = useParams(); // Get supplierID from the URL
    const navigate = useNavigate(); // Use navigate for redirection
    const [formData, setFormData] = useState({});
    console.log("supID nhận từ URL:", supID);
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
    }, [supID]); // Re-run when supplierID changes

    const goToSupplierManagement = () => {
        navigate('/supplier-management'); // Navigate back to Supplier Management
    };

    return (
        <div className="main-container">
            <div className="dashboard-container-alt">
                <div className="logo-container">
                    <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
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
                        <div className="form-group">
                            <label>Supplier Address</label>
                            <input type="text" name="supAddress" value={formData.supAddress || ''} readOnly />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="button" onClick={goToSupplierManagement}>Back to Supplier Management</button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div> Supplier Management - View Supplier Detail </div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default ViewSupplierDetail;
