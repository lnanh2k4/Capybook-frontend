import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import { addSupplier } from '../config'; // Import API addSupplier
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const AddSupplier = () => {
    const [formData, setFormData] = useState({
        supName: "",
        supEmail: "",
        supPhone: "",
        supAddress: "",
    });

    // Khởi tạo useNavigate để điều hướng
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn hành vi mặc định của form

        try {
            // Tạo đối tượng dữ liệu nhà cung cấp
            const supplierData = {
                supName: formData.supName,
                supEmail: formData.supEmail,
                supPhone: formData.supPhone,
                supAddress: formData.supAddress,
                supStatus: 1, // Có thể thêm trạng thái nếu cần thiết
            };

            // In log để kiểm tra dữ liệu supplierData
            console.log("Supplier data to be sent:", supplierData);

            // Gửi dữ liệu JSON trực tiếp
            await addSupplier(supplierData);
            console.log("Supplier added successfully!");

            // Điều hướng về trang Supplier Management sau khi thêm thành công
            navigate("/dashboard/suppliers");
        } catch (error) {
            console.error("Error adding supplier:", error);
        }
    };

    const handleReset = () => {
        setFormData({
            supName: "",
            supEmail: "",
            supPhone: "",
            supAddress: "",
        });
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="add-supplier-container">
                <form className="add-supplier-form">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Supplier Name</label>
                            <input
                                type="text"
                                name="supName"
                                value={formData.supName}
                                onChange={handleChange}
                                placeholder="Enter Supplier Name"
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
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier Email</label>
                            <input
                                type="text"
                                name="supEmail"
                                value={formData.supEmail}
                                onChange={handleChange}
                                placeholder="Enter Supplier Email"
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
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            <div className="titlemanagement">
                <div>Supplier Management - Add Supplier</div>
            </div>
            <div className="copyright">
                <div>© {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
};

export default AddSupplier;
