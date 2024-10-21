import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import { fetchCategoryDetail, fetchCategories, updateCategory } from '../config'; // Fetch and update category functions
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const EditCategory = () => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [categories, setCategories] = useState([]); // To store all categories for parent selection
    const navigate = useNavigate();
    const { catID } = useParams(); // Get the category ID from the route

    useEffect(() => {
        const loadCategoryDetail = async () => {
            try {
                const response = await fetchCategoryDetail(catID);
                const category = response.data;

                form.setFieldsValue({
                    catName: category.catName,
                    parentCatID: category.parentCatID ? category.parentCatID : "None",
                });

                const allCategoriesResponse = await fetchCategories();
                // Lọc các danh mục chỉ có catStatus = 1 và không phải là chính nó
                const validCategories = allCategoriesResponse.data.filter(cat => cat.catID !== category.catID && cat.catStatus === 1);
                setCategories(validCategories);

            } catch (error) {
                console.error("Error fetching category detail:", error);
                message.error("Failed to fetch category details");
            }
        };

        loadCategoryDetail();
    }, [catID, form]);

    const handleSubmit = (values) => {
        const updatedCategory = {
            ...values,
            // Nếu chọn "None", đặt parentCatID thành null, nếu không thì giữ nguyên giá trị
            parentCatID: values.parentCatID === "None" ? null : values.parentCatID,
            catStatus: values.catStatus || 1, // Đặt giá trị mặc định nếu catStatus không được nhập
        };

        // Gửi request PUT với catID
        updateCategory(catID, updatedCategory)
            .then(() => {
                message.success("Category updated successfully");
                navigate("/dashboard/category");
            })
            .catch((error) => {
                console.error("Error updating category:", error);
                message.error("Failed to update category");
            });
    };

    const handleCancel = () => {
        navigate("/dashboard/category"); // Navigate back to category management
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Category Management - Edit Category</div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Category Name"
                        name="catName"
                        rules={[{ required: true, message: "Please enter the category name" }]}
                    >
                        <Input placeholder="Category Name" />
                    </Form.Item>

                    <Form.Item
                        label="Parent Category"
                        name="parentCatID"
                    >
                        <Select
                            placeholder="Select Parent Category"
                            allowClear
                        >
                            <Select.Option key="None" value="None">
                                No Parent
                            </Select.Option>

                            {categories.map(category => (
                                <Select.Option key={category.catID} value={category.catID}>
                                    {category.catName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            Save
                        </Button>
                        <Button
                            type="default"
                            onClick={handleCancel}
                            style={{ marginLeft: '20px' }}
                        >
                            Cancel
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

export default EditCategory;
