import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Đường dẫn tới file CSS
import { login } from '../config.js';

const Login = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const loginData = {
                username: values.username,
                password: values.password
            }

            const formDataToSend = new FormData()
            formDataToSend.append('login', JSON.stringify(loginData))
            console.log(values)
            const response = await login(formDataToSend)
            if (!response.data) {
                message.error('Username or password is incorrect! Please enter again')
            } else if (response.data.accountDTO) {
                message.success('Login successfully')
                if (response.data.accountDTO.role === 0 || response.data.accountDTO.role === 2 || response.data.accountDTO.role === 3) {
                    navigate("/dashboard/accounts");
                } else {
                    navigate("/");
                }
            }
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
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Button
                        type="default"
                        style={{ marginLeft: '10px' }}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
