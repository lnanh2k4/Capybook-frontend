import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSuppliers, updateSupplier, fetchSupplierById } from '../config'; // Adjusted import path
import './SupplierManagement.css'; // Import the CSS file
import DashboardContainer from '../DashBoardContainer.jsx';

function SupplierManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    // Fetch suppliers from API
    useEffect(() => {
        fetchSuppliers().then(response => {
            console.log("Fetched supplier data:", response.data); // Log fetched book data
            setSuppliers(response.data);
        }).catch(error => {
            console.error('Error fetching supplier:', error);
        });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this supplier?")) {
            try {
                // Fetch the current book data by its ID
                const response = await fetchSupplierById(id);
                const currentSupplierData = response.data;

                // Update the book status to 0 (deactivated)
                const updatedSupplierData = {
                    ...currentSupplierData,
                    supStatus: 0
                };

                const formDataToSend = new FormData();
                formDataToSend.append('supplier', JSON.stringify(updatedSupplierData));



                // Update the book
                await updateSupplier(id, formDataToSend);

                // Update the state to reflect the change
                setSuppliers(suppliers.map(supplier =>
                    supplier.supID === id ? { ...supplier, supStatus: 0 } : supplier
                ));
            } catch (error) {
                console.error('Error deactivating supplier:', error);
            }
        }
    };
    const activeSuppliers = suppliers.filter(supplier =>
        supplier.supStatus === 1

    );
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const goToAddSupplier = () => {
        navigate("/dashboard/suppliers/add");
    };

    const goToEditSupplier = (supID) => {
        navigate(`/dashboard/suppliers/edit/${supID}`);
    };

    const gotoViewSupplierDetail = (supID) => {
        navigate(`/dashboard/supplier/${supID}`);
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="titlemanagement">
                <div>Supplier Management</div>
            </div>
            <div className="table-container">
                <div className="action-container">
                    <button className="add-supplier" onClick={goToAddSupplier}>
                        Add Supplier
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
                            <th>Supplier ID</th>
                            <th>Supplier Name</th>
                            <th>Supplier Email</th>
                            <th>Supplier Phone</th>
                            <th>Supplier Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSuppliers.map((supplier) => (
                            <tr key={supplier.supID}>
                                <td>{supplier.supID}</td>
                                <td>{supplier.supName}</td>
                                <td>{supplier.supEmail}</td>
                                <td>{supplier.supPhone}</td>
                                <td>{supplier.supAddress}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={() => gotoViewSupplierDetail(supplier.supID)}>Detail</button>
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
};

export default SupplierManagement;
