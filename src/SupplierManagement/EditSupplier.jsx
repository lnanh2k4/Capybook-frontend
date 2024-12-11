import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { fetchSupplierById, updateSupplier } from '../config'; // Import API functions
import { checkAdminRole, checkWarehouseStaffRole } from "../jwtConfig";
const EditSupplier = () => {
    const { supID } = useParams(); // Get supID from URL
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Ant Design form instance
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        if (!checkWarehouseStaffRole() && !checkAdminRole()) {
            return navigate("/404");
        }
        // Fetch supplier details when component loads
        if (supID) {
            fetchSupplierById(supID)
                .then((response) => {
                    const supplierData = response.data;
                    form.setFieldsValue(supplierData); // Set form fields with fetched data
                })
                .catch((error) => {
                    console.error('Error fetching supplier details:', error);
                    message.error('Failed to fetch supplier details.');
                });
        }
    }, [supID, form]);

    const handleSubmit = async (values) => {
        setLoading(true); // Set loading state while updating
        try {
            // Kiểm tra trùng lặp `supplierName`
            const isDuplicate = suppliers.some(
                (supplier) =>
                    supplier.supName === values.supplierName
            );

            if (isDuplicate) {
                message.error("A supplier with the same name already exists.");
                return; // Ngừng thực hiện nếu tên nhà cung cấp bị trùng
            }
            await updateSupplier(supID, values);
            message.success('Supplier updated successfully');
            navigate("/dashboard/suppliers"); // Navigate back to supplier management after update
        } catch (error) {
            console.error('Error updating supplier:', error);
            message.error('Failed to update supplier.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="dashboard-content">
                <div className="titlemanagement">
                    <h1>Supplier Management - Edit Supplier</h1>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Supplier Email"
                        name="supplierEmail"
                        rules={[
                            { required: true, message: 'Supplier email cannot be empty or only spaces' },
                            { type: "email", message: "Please enter a valid email address" },

                        ]}
                    >
                        <Input placeholder="Enter supplier email" />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Phone"
                        name="supplierPhone"
                        rules={[

                            {
                                validator: (_, value) => {
                                    if (!value || value.trim() === "") {
                                        return Promise.reject(
                                            new Error("Phone number cannot be empty or only spaces")
                                        );
                                    }
                                    if (!/^[0-9]{10}$/.test(value)) {
                                        return Promise.reject(
                                            new Error("Phone number must be exactly 10 digits")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Enter supplier phone" />
                    </Form.Item>

                    <Form.Item
                        label="Supplier Address"
                        name="supplierAddress"
                        rules={[

                            {
                                validator: (_, value) => {
                                    if (!value || value.trim() === "") {
                                        return Promise.reject(
                                            new Error("Supplier address cannot be empty or only spaces")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Enter supplier address" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save
                        </Button>
                        <Button
                            type="default"
                            onClick={() => navigate("/dashboard/suppliers")} // Handle cancel
                            style={{ marginLeft: '20px' }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
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
