import React from 'react';
import { Button, Form, Input, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerAccount } from '../config';
import './Register.css'; // Import file CSS

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const registerData = {
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                dob: values.dob,
                email: values.email,
                phone: values.phone,
                address: values.address,
                sex: values.sex,
                password: values.password,
            };

            const formDataToSend = new FormData();
            formDataToSend.append('register', JSON.stringify(registerData));

            await registerAccount(formDataToSend);
            message.success('Account has been registered successfully');
            navigate("/auth/login");
        } catch (error) {
            if (error.response) {
                console.error('Server responded with status code:', error.response.status);
                console.error('Error data:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
            message.error('Failed to add account');
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <div className="register-container">
            <div className="register-form">
                {/* Logo ở trên cùng */}
                <img
                    src="/logo-capybook.png"
                    alt="Capybook Logo"
                    className="register-logo"
                />
                <h1 className="register-title">Register Account</h1>
                <Form
                    form={form}
                    initialValues={{
                        sex: '0',
                    }}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please enter username" }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: "Please enter first name" }]}
                    >
                        <Input placeholder="First Name" />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: "Please enter last name" }]}
                    >
                        <Input placeholder="Last Name" />
                    </Form.Item>

                    <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[{ required: true, message: "Please enter date of birth" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: "Please enter a valid email" }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please enter phone number" }]}
                    >
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item
                        label="Sex"
                        name="sex"
                        rules={[{ required: true, message: "Please select your gender" }]}
                    >
                        <Radio.Group>
                            <Radio value="0">Female</Radio>
                            <Radio value="1">Male</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please enter address" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Address" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                        <Button type="default" onClick={handleReset} style={{ marginLeft: 10 }}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
