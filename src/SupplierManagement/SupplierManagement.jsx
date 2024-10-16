import React, { useEffect, useState } from 'react';
import { fetchSuppliers, deleteSupplier } from './SupplierApi'; // Import the functions from api.js
import { useNavigate } from 'react-router-dom';
import './SupplierManagement.css'; // Import CSS file

function SupplierManagement() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchSuppliers()
            .then(response => {
                console.log("Fetched suppliers data:", response.data);
                setSuppliers(response.data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            deleteSupplier(id)
                .then(() => {
                    setSuppliers(suppliers.filter(supplier => supplier.supID !== id)); // Filter out the deleted supplier
                    alert("Supplier deleted successfully");
                })
                .catch(error => {
                    console.error('Error deleting supplier:', error);
                    alert("Failed to delete supplier");
                });
        }
    };

    const goToViewSupplierDetail = (supID) => {
        navigate(`/supplier-detail/${supID}`);
    };

    const goToBookManagement = () => {
        navigate('/book-management');
    };

    const goToAddSupplier = () => {
        navigate('/add-supplier');
    };

    const goToEditSupplier = (supID) => {
        navigate(`/supplier-edit/${supID}`); // Pass supID to the edit page
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
                    <div className="dashboard-item" onClick={goToBookManagement}>
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
                <div>Supplier Management</div>
            </div>
            <div className="table-container">
                <div className="action-container">
                    <button className='add-supplier' onClick={goToAddSupplier}>Add Supplier</button>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                        />
                        <button className="search-button">Search</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Supplier ID</th>
                            <th>Supplier Name</th>
                            <th>Supplier Email</th>
                            <th>Supplier Phone</th>
                            <th>Supplier Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.supID}>
                                <td>{supplier.supID}</td>
                                <td>{supplier.supName}</td>
                                <td>{supplier.supEmail}</td>
                                <td>{supplier.supPhone}</td>
                                <td>{supplier.supAddress}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={() => goToViewSupplierDetail(supplier.supID)}>Detail</button>
                                        <button className="edit" onClick={() => goToEditSupplier(supplier.supID)}>Edit</button>
                                        <button className="delete" onClick={() => handleDelete(supplier.supID)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Capybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default SupplierManagement;
