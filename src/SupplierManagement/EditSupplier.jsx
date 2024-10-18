import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateSupplier, fetchSupplierById } from "../config"; // Import API functions
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx"; // Import dashboard layout

const EditSupplier = () => {
    const { supID } = useParams(); // Get supID from URL
    const navigate = useNavigate(); // To navigate back to supplier management
    const [formData, setFormData] = useState({
        supName: "",
        supEmail: "",
        supPhone: "",
        supAddress: "",
    });

    useEffect(() => {
        // Fetch supplier details by supID
        fetchSupplierById(supID)
            .then((response) => {
                setFormData(response.data); // Fill form with fetched supplier data
            })
            .catch((error) => {
                console.error("Error fetching supplier details:", error);
            });
    }, [supID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to update supplier data
        updateSupplier(supID, formData)
            .then(() => {
                navigate("/dashboard/suppliers"); // Redirect to supplier management after update
            })
            .catch((error) => {
                console.error("Error updating supplier:", error);
            });
    };

    const handleCancel = () => {
        navigate("/dashboard/suppliers"); // Navigate back to supplier management on cancel
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="edit-supplier-container">
                <form className="edit-supplier-form" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label>Supplier Name</label>
                            <input
                                type="text"
                                name="supName"
                                value={formData.supName}
                                onChange={handleChange}
                                placeholder="Enter Supplier Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier Phone</label>
                            <input
                                type="text"
                                name="supPhone"
                                value={formData.supPhone}
                                onChange={handleChange}
                                placeholder="Enter Supplier Phone"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier Email</label>
                            <input
                                type="email"
                                name="supEmail"
                                value={formData.supEmail}
                                onChange={handleChange}
                                placeholder="Enter Supplier Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier Address</label>
                            <input
                                type="text"
                                name="supAddress"
                                value={formData.supAddress}
                                onChange={handleChange}
                                placeholder="Enter Supplier Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div> Supplier Management - Edit Supplier </div>
            </div>
            <div className="copyright">
                <div>© {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
};

export default EditSupplier;
