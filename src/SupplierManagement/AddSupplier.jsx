import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd"; // Import Ant Design components
import { addSupplier } from '../config'; // API to add supplier
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { checkAdminRole, checkWarehouseStaffRole } from "../jwtConfig";
const AddSupplier = () => {
    const [form] = Form.useForm(); // Initialize Ant Design form
    const navigate = useNavigate(); // Initialize useNavigate for routing

    const handleSubmit = async (values) => {
        try {
            // Prepare supplier data
            const supplierData = {
                supName: values.supplierName,
                supEmail: values.supplierEmail,
                supPhone: values.supplierPhone,
                supAddress: values.supplierAddress,
                supStatus: 1, // Default status
            };

            console.log("Supplier data to be sent:", supplierData);

            await addSupplier(supplierData); // API call to add supplier
            message.success("Supplier added successfully");
            navigate("/dashboard/suppliers"); // Navigate to Supplier Management
        } catch (error) {
            console.error("Error adding supplier:", error);
            message.error("Failed to add supplier");
        }
    };

    const handleReset = () => {
        form.resetFields(); // Reset the form fields
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Supplier Management - Add Supplier</div>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ maxWidth: '600px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Supplier Name"
                        name="supplierName"
                        rules={[{ required: true, message: "Please enter the supplier name" }]}
                    >
                        <Input placeholder="Enter supplier name" />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Email"
                        name="supplierEmail"
                        rules={[
                            { required: true, message: "Please enter the supplier email" },
                            { type: "email", message: "Please enter a valid email address" },
                        ]}
                    >
                        <Input placeholder="Enter supplier email" />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Phone"
                        name="supplierPhone"
                        rules={[{ required: true, message: "Please enter the supplier phone" }]}
                    >
                        <Input placeholder="Enter supplier phone" />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Address"
                        name="supplierAddress"
                        rules={[{ required: true, message: "Please enter the supplier address" }]}
                    >
                        <Input placeholder="Enter supplier address" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={handleReset} style={{ marginLeft: '20px' }}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="copyright">
                <div>© {new Date().getFullYear()}</div>
                <div>Capybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
};

export default AddSupplier;
