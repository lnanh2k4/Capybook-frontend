import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { fetchCategoryDetail, fetchCategories } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

function CategoryDetail() {
    const [categoryData, setCategoryData] = useState(null);
    const navigate = useNavigate();
    const { catID } = useParams();  // Get the category ID from the route

    useEffect(() => {
        const loadCategoryDetail = async () => {
            try {
                // Fetch the current category details
                const response = await fetchCategoryDetail(catID);
                const category = response.data;
                setCategoryData(category);



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

                    <Form.Item>
                        <Input htmlType="textarea" value={categoryData.catDescription} readOnly style={{ width: '800px', height: '200px', textJustify: 'revert-layer', textWrap: '-moz-initial' }} />
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
