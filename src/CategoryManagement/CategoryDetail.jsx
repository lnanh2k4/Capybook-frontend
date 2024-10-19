import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { fetchCategoryDetail, fetchCategories } from '../config'; // Fetch categories function added to get child categories
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

function CategoryDetail() {
    const [categoryData, setCategoryData] = useState(null);
    const [childCategories, setChildCategories] = useState([]); // To store child categories
    const [parentCategory, setParentCategory] = useState("");   // To store parent category
    const navigate = useNavigate();
    const { catID } = useParams();  // Get the category ID from the route

    useEffect(() => {
        // Fetch category details by ID
        const loadCategoryDetail = async () => {
            try {
                // Fetch the current category details
                const response = await fetchCategoryDetail(catID);
                const category = response.data;

                console.log("API response:", category);

                // Set category data
                setCategoryData(category);

                // If category is a parent (parentCatID is null), fetch child categories
                if (category.parentCatID === null) {
                    // Fetch all categories and filter to get only children of the current category
                    const allCategoriesResponse = await fetchCategories();
                    const allCategories = allCategoriesResponse.data;
                    const children = allCategories.filter(cat => cat.parentCatID === category.catID);
                    setChildCategories(children);
                } else {
                    // If it's a child category, fetch the parent category details
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
        navigate("/dashboard/category");  // Go back to category management page
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
                    <Form.Item label="Category ID">
                        <Input value={categoryData.catID} disabled />
                    </Form.Item>

                    <Form.Item label="Category Name">
                        <Input value={categoryData.catName} disabled />
                    </Form.Item>

                    <Form.Item label={categoryData.parentCatID === null ? "Children Categories" : "Parent Category"}>
                        {categoryData.parentCatID === null ? (
                            <Input.TextArea
                                rows={4}
                                value={childCategories.length > 0
                                    ? childCategories.map(child => child.catName).join(", ")
                                    : "No Child Categories"}
                                disabled
                            />
                        ) : (
                            <Input value={`Child of: ${parentCategory}`} disabled />
                        )}
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
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Capybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default CategoryDetail;
