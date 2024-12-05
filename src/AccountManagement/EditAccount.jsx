import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccountDetail, updateAccount } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, Radio, message, Select } from 'antd';

function EditAccount() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Ant Design form instance

    const goToAccountManagement = () => {
        navigate("/dashboard/accounts");
    };

    useEffect(() => {
        if (username) {
            fetchAccountDetail(username)
                .then(response => {
                    const formData = response.data;
                    form.setFieldsValue({
                        ...formData,
                        role: formData.role.toString(),
                        sex: formData.sex.toString()
                    });
                })
                .catch(error => {
                    console.error('Error fetching account details:', error);
                    message.error('Failed to fetch account details.');
                });
        }
    }, [username, form]);

    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();

            // Create the book data object, explicitly setting bookStatus to 1
            const updatedAccountData = {
                ...values,
            };

            formDataToSend.append('account', JSON.stringify(updatedAccountData));

            await updateAccount(username, formDataToSend);
            message.success('Account updated successfully');
            navigate("/dashboard/accounts");
        } catch (error) {
            console.error('Error updating account:', error);
            message.error('Failed to update account.');
        }
    };

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Account Management - Edit Account</h1>
            <DashboardContainer />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: '700px', margin: 'auto' }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter username' }]}
                >
                    <Input placeholder="Username of account" disabled />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        { required: true, message: 'Please enter first name' },
                    ]}
                >
                    <Input placeholder="First name of account" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        { required: true, message: 'Please enter last name' },
                    ]}
                >
                    <Input placeholder="Last name of account" />
                </Form.Item>

                <Form.Item
                    label="Date of birth"
                    name="dob"
                    rules={[{ required: true, message: 'Please enter the dimensions' }]}
                >
                    <Input type='date' placeholder="Date of birth of account" />
                </Form.Item>

                <Form.Item
                    label="email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                    ]}
                >
                    <Input type='email' placeholder='Email of account' />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please enter phone' },
                    ]}
                >
                    <Input placeholder="Phone of account" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        { required: true, message: 'Please select role' }]}
                >
                    <Select name="role" readOnly>
                        <Select.Option value="0" >Admin</Select.Option>
                        <Select.Option value="1" >Customer</Select.Option>
                        <Select.Option value="2" >Seller staff</Select.Option>
                        <Select.Option value="3" >Warehouse staff</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter the address' }]}
                >
                    <Input type='TextArea' placeholder="Address of account" />
                </Form.Item>

                <Form.Item
                    label="Sex"
                    name="sex"
                    rules={[
                        { required: true, message: 'Please enter the sex' },
                    ]}
                >
                    <Radio.Group name='sex' readOnly>
                        <Radio value="0"  > Female </Radio>
                        <Radio value="1" > Male </Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button
                        htmlType="button"
                        onClick={goToAccountManagement}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>

        </>
    );
}

export default EditAccount;
