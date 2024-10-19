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

    // Fetch existing categories to populate the parent category dropdown
    useEffect(() => {
        setLoading(true);
        fetchCategories()
            .then((response) => {
                if (Array.isArray(response.data)) {
                    // Lọc ra các category có parentCatID === null và catStatus === 1 (active)
                    const filteredCategories = response.data.filter(
                        (category) => category.parentCatID === null && category.catStatus === 1
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

    const handleSubmit = async (values) => {
        try {
            const categoryData = {
                catName: values.catName,
                parentCatID: values.parentCatID || null, // Can be null if no parent category is selected
                catStatus: 1, // Default status
            };

            await addCategory(categoryData); // API call to add category
            message.success('Category added successfully');
            navigate("/dashboard/category"); // Navigate back to category management page
        } catch (error) {
            console.error('Error adding category:', error);
            message.error('Failed to add category');
        }
    };

    const handleReset = () => {
        form.resetFields(); // Reset form fields
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
                        <Button htmlType="button" onClick={handleReset} style={{ marginLeft: '20px' }}>
                            Reset
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
