import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message } from 'antd'; // Import Ant Design components
import { fetchCategories, addCategory } from '../config'; // Add necessary API calls
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { Option } = Select;

function AddCategory() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormEmpty, setIsFormEmpty] = useState(true);

    // Fetch existing categories to populate the parent category dropdown
    useEffect(() => {
        setLoading(true);
        fetchCategories()
            .then((response) => {
                if (Array.isArray(response.data)) {
                    // Thay đổi: không lọc parentCatID === null, hiển thị tất cả các category
                    const filteredCategories = response.data.filter(
                        (category) => category.catStatus === 1
                    );
                    setParentCategories(filteredCategories);
                } else {
                    console.error("Expected an array but got", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                message.error("Failed to fetch categories");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleFormChange = () => {
        const values = form.getFieldsValue();
        const isEmpty = !values.catName || values.catName.trim() === '';
        setIsFormEmpty(isEmpty);
    };

    const handleSubmit = async (values) => {
        try {
            const categoryData = {
                catName: values.catName,
                parentCatID: values.parentCatID || null, 
                catStatus: 1, 
            };

            await addCategory(categoryData); 
            message.success('Category added successfully');
            navigate("/dashboard/category"); 
        } catch (error) {
            console.error('Error adding category:', error);
            message.error('Failed to add category');
        }
    };

    const handleResetOrBack = () => {
        if (isFormEmpty) {
            navigate("/dashboard/category"); 
        } else {
            form.resetFields(); 
            setIsFormEmpty(true); 
        }
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Category Management - Add Category</div>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    onFieldsChange={handleFormChange} 
                    style={{ maxWidth: '600px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Category Name"
                        name="catName"
                        rules={[{ required: true, message: 'Please enter the category name' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        label="Parent Category"
                        name="parentCatID"
                        rules={[{ required: false }]}
                    >
                        <Select
                            placeholder="Select parent category (optional)"
                            loading={loading}
                            allowClear
                        >
                            {parentCategories.map((category) => (
                                <Option key={category.catID} value={category.catID}>
                                    {category.catName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={handleResetOrBack} style={{ marginLeft: '20px' }}>
                            {isFormEmpty ? 'Back' : 'Reset'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default AddCategory;
