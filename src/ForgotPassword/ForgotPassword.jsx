import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../config.js';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const forgotPasswordData = {
                username: values.username,
                email: values.email
            }
            localStorage.setItem("username", values.username)
            const formDataToSend = new FormData()
            formDataToSend.append('forgot-password', JSON.stringify(forgotPasswordData))
            navigate("/email/verify")
            const response = await forgotPassword(formDataToSend)
            console.log(response)
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
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Send
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPassword;
