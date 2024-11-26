import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { fetchCategoryDetail, fetchCategories } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

function CategoryDetail() {
    const [categoryData, setCategoryData] = useState(null);
    const [childCategories, setChildCategories] = useState([]); // To store child categories
    const [parentCategory, setParentCategory] = useState("");   // To store parent category
    const navigate = useNavigate();
    const { catID } = useParams();  // Get the category ID from the route

    useEffect(() => {
        const loadCategoryDetail = async () => {
            try {
                // Fetch the current category details
                const response = await fetchCategoryDetail(catID);
                const category = response.data;
                setCategoryData(category);

                const allCategoriesResponse = await fetchCategories();
                const allCategories = allCategoriesResponse.data;

                // Fetch child categories if they exist
                const children = allCategories.filter(cat => cat.parentCatID === category.catID);
                setChildCategories(children);

                // Fetch parent category if it exists
                if (category.parentCatID !== null) {
                    const parentResponse = await fetchCategoryDetail(category.parentCatID);
                    setParentCategory(parentResponse.data.catName || "");
                }

            } catch (error) {
                console.error("Error fetching category detail:", error);
                message.error("Failed to fetch category details");
            }
        };

        loadCategoryDetail();
    }, [catID]);

    const handleBack = () => {
        navigate("/dashboard/category");
    };

    if (!categoryData) {
        return <p>Loading category details...</p>;
    }

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Category Management - Category Details</div>
                </div>

                <Form
                    layout="vertical"
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >

                    <Form.Item label="Category Name">
                        <Input value={categoryData.catName} readOnly />
                    </Form.Item>

                    {parentCategory && (
                        <Form.Item label="Parent Category">
                            <Input value={parentCategory} readOnly />
                        </Form.Item>
                    )}

                    <Form.Item label="Child Categories">
                        <Input.TextArea
                            rows={4}
                            value={childCategories.length > 0
                                ? childCategories.map(child => child.catName).join(", ")
                                : "No Child Categories"}
                            readOnly
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="default"
                            onClick={handleBack}
                            style={{ backgroundColor: "black", color: "white", display: 'block', margin: '0 auto' }}
                        >
                            Back
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
}

export default CategoryDetail;
