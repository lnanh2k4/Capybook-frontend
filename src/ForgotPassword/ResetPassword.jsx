import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../config.js';
import { decodeJWT } from '../jwtConfig.jsx';

const ResetPassword = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const resetPasswordData = {
                username: localStorage.getItem("username"),
                password: values.newPassword
            }
            const formDataToSend = new FormData()
            formDataToSend.append('password', JSON.stringify(resetPasswordData))
            console.log(values)
            const response = await resetPassword(formDataToSend)
            navigate("/auth/login");
            console.log(response)
            localStorage.setItem("jwtToken", response.data.token)
        } catch (error) {
            console.log(error)
            message.error('Login failed')
        }

    };
    return (
        <div className="login-container">
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                {/* Logo được thêm ở đây */}
                <img
                    src="/logo-capybook.png"
                    alt="Capybook Logo"
                    className="login-logo"
                />
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your confirm password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
