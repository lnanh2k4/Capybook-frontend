import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAccount } from '../config.js';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
    Button,
    Form,
    Input,
    Radio,
    Select,
    message
} from 'antd';

const AddAccount = () => {
    const [form] = Form.useForm();  // Sử dụng Ant Design Form API
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            console.log(values)
            const accountData = {
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                dob: values.dob,
                email: values.email,
                phone: values.phone,
                role: values.role,
                address: values.address,
                sex: values.sex,
                // password: values.password
            };

            const formDataToSend = new FormData();
            formDataToSend.append('account', JSON.stringify(accountData)); // Thêm trường 'account'

            // Gửi yêu cầu POST với multipart/form-data
            await addAccount(formDataToSend)
            message.success('Account added successfully');
            navigate("/dashboard/accounts");
        } catch (error) {
            if (error.response) {
                console.error('Server responded with status code:', error.response.status);
                console.error('Error data:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
            message.error('Failed to add account');
        }
    }


    const handleReset = () => {
        form.resetFields();
    };

    const { TextArea } = Input;
    const { Option } = Select;

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Add Account</h1>
            <DashboardContainer />
            <div className="add-account-container">
                <Form
                    initialValues={{
                        role: 'Please select role',  // Giá trị mặc định cho trường role
                        sex: '0',   // Giá trị mặc định cho trường sex
                    }}
                    form={form} // Kết nối với Form API của Ant Design
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    onFinish={handleSubmit} // Thay đổi onSubmit thành onFinish để Ant Design quản lý submit
                    style={{
                        maxWidth: 600,
                        marginLeft: '20%',
                        background: '255, 255, 0, 0.9',
                        padding: '3%',
                        borderRadius: '5%',
                    }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please enter username",
                            },
                        ]}
                    >
                        <Input placeholder="Username of account" />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter First Name",
                            },
                        ]}
                    >
                        <Input placeholder="First name of account" />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Last Name",
                            },
                        ]}
                    >
                        <Input placeholder="Last name of account" />
                    </Form.Item>

                    <Form.Item
                        label="Date Of Birth"
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Date of birth",
                            },
                        ]}
                    >
                        <Input type="date" placeholder="Date of birth" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter Email",
                                type: 'email',
                            },
                        ]}
                    >
                        <Input placeholder="Email of account" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please enter phone",
                            },
                        ]}
                    >
                        <Input type="tel" placeholder="Phone number of account" />
                    </Form.Item>

                    <Form.Item
                        label="Sex"
                        name="sex"
                        rules={[
                            {
                                required: true,
                                message: "Please select sex",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="0"> Female </Radio>
                            <Radio value="1"> Male </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Please select role",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="0">Admin</Option>
                            <Option value="1">Customer</Option>
                            <Option value="2">Seller staff</Option>
                            <Option value="3">Warehouse staff</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Please enter address",
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder="Address of account" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button type="default" onClick={handleReset} style={{ marginLeft: 10 }}>Reset</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default AddAccount;
