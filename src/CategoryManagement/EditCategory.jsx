import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, TreeSelect, message } from 'antd';
import { fetchCategoryDetail, fetchCategories, updateCategory } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const EditCategory = () => {
    const [form] = Form.useForm(); 
    const [treeData, setTreeData] = useState([]);
    const navigate = useNavigate();
    const { catID } = useParams(); 

    useEffect(() => {
        const loadCategoryDetail = async () => {
            try {
                const response = await fetchCategoryDetail(catID);
                const category = response.data;

                form.setFieldsValue({
                    catName: category.catName,
                    parentCatID: category.parentCatID || null,
                });

                const allCategoriesResponse = await fetchCategories();
                const validCategories = allCategoriesResponse.data.filter(
                    (cat) => cat.catStatus === 1
                );
                setTreeData(buildTreeData(validCategories, category.catID));

            } catch (error) {
                console.error("Error fetching category detail:", error);
                message.error("Failed to fetch category details");
            }
        };

        loadCategoryDetail();
    }, [catID, form]);

    const buildTreeData = (categories, currentCategoryId) => {
        const map = {};
        const roots = [];

        categories.forEach((category) => {
            map[category.catID] = {
                title: category.catName,
                value: category.catID,
                key: category.catID,
                disabled: category.catID === currentCategoryId,
                children: [],
            };
        });

        categories.forEach((category) => {
            if (category.parentCatID && map[category.parentCatID]) {
                map[category.parentCatID].children.push(map[category.catID]);
            } else if (!category.parentCatID) {
                roots.push(map[category.catID]);
            }
        });

        return roots;
    };

    const handleSubmit = (values) => {
        const updatedCategory = {
            ...values,
            parentCatID: values.parentCatID === null ? null : values.parentCatID,
            catStatus: values.catStatus || 1,
        };

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
        navigate("/dashboard/category"); 
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
                        <TreeSelect
                            placeholder="Select Parent Category"
                            allowClear
                            treeData={[
                                { title: "No Parent", value: null, key: "no-parent" },
                                ...treeData,
                            ]}
                            treeDefaultExpandAll={false}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
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
