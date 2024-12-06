import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { changePassword, fetchAccountDetail, updateAccount } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, Radio, message, Select } from 'antd';
import { checkCustomerRole, decodeJWT } from '../jwtConfig.jsx';
import Password from 'antd/es/input/Password.js';

function ChangePassword() {

    const navigate = useNavigate();
    const [form] = Form.useForm(); // Ant Design form instance

    const goToProfile = () => {
        navigate("/profile");
    };
    if (!checkCustomerRole()) {
        return navigate("/404");
    }
    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();
            let username = decodeJWT().sub
            let currentPassword = values.currentPassword
            let newPassword = values.newPassword
            if (values.newPassword === values.confirmPassword) {
                // Create the book data object, explicitly setting bookStatus to 1
                const changePasswordData = {
                    username, currentPassword, newPassword
                };

                formDataToSend.append('password-request', JSON.stringify(changePasswordData));

                await changePassword(formDataToSend);
                message.success('Change password successfully');
                navigate("/profile");
            } else {
                message.error('New password and confirm password are not match!');
            }

        } catch (error) {
            console.error('Error change password:', error);
            message.error('Failed to change password.');
        }
    };

    return (
        <>
            <h1 style={{ textAlign: 'center' }}> Change Password</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: '700px', margin: 'auto' }}
            >
                <Form.Item
                    label="Current password"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please enter current password' }]}
                >
                    <Input.Password placeholder="Current password" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Please enter new password' },
                    ]}
                >
                    <Input.Password placeholder="New password of account" />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: 'Please enter confirm password' },
                    ]}
                >
                    <Input.Password placeholder="Confirm password of account" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button
                        htmlType="button"
                        onClick={goToProfile}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>

        </>
    );
}

export default ChangePassword;
