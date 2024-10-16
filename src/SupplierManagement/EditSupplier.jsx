import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSupplierById, updateSupplier } from './SupplierApi'; // Assuming these functions are defined in your API file
import './EditSupplier.css';

function EditSupplier() {
    const { supID } = useParams(); // Get supplierId from the URL
    const navigate = useNavigate(); // Define navigate function

    const [formData, setFormData] = useState({
        supName: '',
        supEmail: '',
        supPhone: '',
        supAddress: '',
    });

    useEffect(() => {
        if (supID) {
            // Fetch supplier details by ID
            fetchSupplierById(supID)
                .then(response => {
                    setFormData(response.data); // Set form data with the fetched supplier details
                })
                .catch(error => {
                    console.error('Error fetching supplier details:', error);
                });
        } else {
            console.error('supplierId is not defined');
        }
    }, [supID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const supplierData = {
                supName: formData.supName,
                supEmail: formData.supEmail,
                supPhone: formData.supPhone,
                supAddress: formData.supAddress,
                supStatus: 1 // Default supplier status, can be adjusted as needed
            };

            // Assuming updateSupplier is an API function to update supplier data
            await updateSupplier(supID, supplierData); // Use supplierId correctly here
            navigate('/supplier-management'); // Navigate back to supplier management after update
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    const handleReset = () => {
        setFormData({
            supName: '',
            supEmail: '',
            supPhone: '',
            supAddress: '',
        });
    };

    const goToSupplierManagement = () => {
        navigate('/supplier-management');
    };

    return (
        <div className="main-container">
            <div className="dashboard-container-alt">
                <div className="logo-container">
                    <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
                </div>
                <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-item"><i className="fas fa-book dashboard-icon"></i><p>Account Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-user dashboard-icon"></i><p>Book Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-tags dashboard-icon"></i><p>Order Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-tags dashboard-icon"></i><p>Promotion Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-tags dashboard-icon"></i><p>Category Management</p></div>
                    <div className="dashboard-item" onClick={goToSupplierManagement}><i className="fas fa-tags dashboard-icon"></i><p>Supplier Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-tags dashboard-icon"></i><p>Inventory Management</p></div>
                    <div className="dashboard-item"><i className="fas fa-tags dashboard-icon"></i><p>Notification Management</p></div>
                </div>
                <div className="leave-logo-container">
                    <img src="/back_icon.png" className="leave-logo-image" />
                </div>
            </div>

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
                                placeholder="Supplier Name"
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
                                placeholder="Supplier Phone"
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
                                placeholder="Supplier Email"
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
                                placeholder="Supplier Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={goToSupplierManagement}>Cancel</button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div> Supplier Management - Edit Supplier </div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default EditSupplier;
