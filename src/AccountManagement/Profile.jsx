import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { fetchBookById, updateBook, fetchCategories, fetchAccountDetail, updateAccount, logout } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, InputNumber, Upload, message, Select, Menu, Radio } from 'antd';
import decodeJWT from '../jwtConfig.jsx';

function Profile() {
    const [form] = Form.useForm(); // Ant Design form instance
    const [isEditing, setIsEditing] = useState(false);
    const username = decodeJWT(localStorage.getItem("jwtToken")).sub
    const navigate = useNavigate();
    useEffect(() => {
        if (username) {
            fetchAccountDetail(username)
                .then(response => {
                    const formData = response.data;
                    form.setFieldsValue({
                        ...formData,
                        sex: formData.sex.toString()
                    });
                })
                .catch(error => {
                    message.error('Failed to fetch profile');
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
            message.success('Profile is updated successfully');
        } catch (error) {
            console.error('Error updating account:', error);
            message.error('Failed to update account.');
        }
    };

    const handleSave = () => {
        setIsEditing(false);
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
                    onFinish={handleSubmit}
                    style={{ maxWidth: '700px', margin: 'auto' }
                    }
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
                        <Input placeholder="First name of account" disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Please enter last name' },
                        ]}
                    >
                        <Input placeholder="Last name of account" disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item
                        label="Date of birth"
                        name="dob"
                        rules={[{ required: true, message: 'Please enter the dimensions' }]}
                    >
                        <Input type='date' placeholder="Date of birth of account" disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item
                        label="email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                        ]}
                    >
                        <Input type='email' placeholder='Email of account' disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter phone' },
                        ]}
                    >
                        <Input placeholder="Phone of account" disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter the address' }]}
                    >
                        <Input type='TextArea' placeholder="Address of account" disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item
                        label="Sex"
                        name="sex"
                        rules={[
                            { required: true, message: 'Please enter the sex' },
                        ]}
                    >
                        <Radio.Group name='sex' disabled={!isEditing}>
                            <Radio value="0"  > Female </Radio>
                            <Radio value="1" > Male </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        {isEditing ? (
                            <Button type="primary" onClick={handleSave}>
                                Save
                            </Button>
                        ) : (
                            <Button type="default" onClick={() => setIsEditing(true)} htmlType="submit">
                                Edit
                            </Button>
                        )}
                        <Button onClick={() => navigate('/dashboard/profile/changepassword')} >
                            Change password
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div >
    );
}

export default Profile;
