import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSupplier.css';
import { addSupplier } from './SupplierApi';
function AddSupplier() {
    const [formData, setFormData] = useState({
        supName: '',
        supEmail: '',
        supPhone: '',
        supAddress: ''
    });

    const navigate = useNavigate();

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
                supStatus: 1
            };
            console.log("Supplier data:", supplierData);

            // Send the supplier data as JSON to the backend
            await addSupplier(supplierData);

            // Navigate to supplier management after success
            navigate('/supplier-management');
        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    };


    const handleReset = () => {
        setFormData({
            supName: '',
            supEmail: '',
            supPhone: '',
            supAddress: ''
        });
    };

    const goToSupplierManagement = () => {
        navigate('/supplier-management');
    };

    return (
        <div className="main-container">
            <div className="dashboard-container-alt">
                <div className="logo-container">
                    <img src="/logo-capybook.png" alt="Capybook Logo" className="logo-image" />
                </div>
                <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-item">
                        <i className="fas fa-supplier dashboard-icon"></i>
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
                    <img src="/back_icon.png" className="leave-logo-image" />
                </div>
            </div>

            <div className="add-supplier-container">
                <form className="add-supplier-form" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label>Supplier Name</label>
                            <input
                                type="text"
                                name="supName"
                                value={formData.supName}
                                onChange={handleChange}
                                placeholder="Supplier Name"
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
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier Email</label>
                            <input
                                type="text"
                                name="supEmail"
                                value={formData.supEmail}
                                onChange={handleChange}
                                placeholder="Supplier Email"
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
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div>Supplier Management - Add Supplier</div>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Capybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default AddSupplier;
