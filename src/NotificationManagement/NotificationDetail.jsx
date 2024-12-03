import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { fetchNotificationDetail } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import 'react-quill/dist/quill.snow.css';  // Import ReactQuill styles
import ReactQuill, { Quill } from 'react-quill';

function NotificationDetail() {
    const [notificationyData, setNotificationData] = useState(null);
    const navigate = useNavigate();
    const quillRef = useRef();  // Create a ref for ReactQuill
    const { notID } = useParams();  // Get the Notification ID from the route
    const [text, setText] = useState('');

    useEffect(() => {
        const loadNotificationDetail = async () => {
            try {
                console.log("notID: " + notID)
                // Fetch the current category details
                const response = await fetchNotificationDetail(notID);
                const notification = response.data;
                setNotificationData(notification);
                setText(notification.notDescription)
            } catch (error) {
                console.error("Error fetching notification detail:", error);
                message.error("Failed to fetch notification details");
            }
        };
        loadNotificationDetail()
    }, [notID])
    const handleBack = () => {
        navigate("/dashboard/notification");
    };
    if (!notificationyData) {
        return <p>Loading notification details...</p>;
    }
    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Notification Management - Notification Details</div>
                </div>
                <div>
                    <h1>{notificationyData.notTitle}</h1>
                    <ReactQuill theme="snow" value={text} readOnly></ReactQuill>
                </div>
            </div>

            <div className="copyright">
                <div>© {new Date().getFullYear()}</div>
                <div>Capybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}
export default NotificationDetail;