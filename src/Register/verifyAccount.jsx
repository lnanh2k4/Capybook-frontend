import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { verifyAccount } from '../config.js';
import { checkCustomerRole, decodeJWT } from '../jwtConfig.jsx';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const loginData = {
                username: decodeJWT().sub,
                code: values.code
            }

            const formDataToSend = new FormData()
            formDataToSend.append('code', JSON.stringify(loginData))
            const response = await verifyAccount(formDataToSend)
            if (checkCustomerRole()) {
                navigate('/')
                return
            }
            navigate('/dashboard')
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
                    label="OTP Code"
                    name="code"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your code!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Verify
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default VerifyEmail;
