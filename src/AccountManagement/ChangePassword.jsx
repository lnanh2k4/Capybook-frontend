import React, { useEffect, useState } from 'react';
import { changePassword } from '../config.js';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, message } from 'antd';
import { decodeJWT } from '../jwtConfig.jsx';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [form] = Form.useForm(); // Ant Design form instance
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const username = decodeJWT(localStorage.getItem("jwtToken")).sub

    const handlePasswordChange = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordFormData;

        if (newPassword !== confirmPassword) {
            message.error('New password and confirm password do not match!');
            return;
        }
        const password = newPassword
        try {
            // Giả lập gọi API
            const formDataToSend = new FormData();
            const updatedAccountData = {
                password,
                username
            };
            formDataToSend.append('account', JSON.stringify(updatedAccountData));
            await changePassword(formDataToSend)
            message.success('Password changed successfully!');
            navigate("/dashboard/accounts");

        } catch (error) {
            console.error('Error changing password:', error);
            message.error('An error occurred while changing the password.');
        }
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>
            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Profile</div>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    style={{ maxWidth: '700px', margin: 'auto' }
                    }
                >

                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    );
}

export default ChangePassword;
