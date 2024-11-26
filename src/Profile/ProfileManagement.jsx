import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, Input, Row, Col, Tag, Typography, Dropdown, Button, Select, Modal, Radio, Form, message } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../Homepage/Homepage.css';
import { fetchAccountDetail, fetchBooks, fetchCategories, logout, updateAccount } from '../config'; // Fetch books and categories from API
import { decodeJWT } from '../jwtConfig'



const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const ProfileManagement = () => {
    const [form] = Form.useForm(); // Ant Design form instance
    const [isEditing, setIsEditing] = useState(false);
    const username = decodeJWT().sub

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
    const navigate = useNavigate(); // Initialize navigate for routing

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLogout = () => {
        logout()
        navigate("/");
    }

    const handleSave = () => {
        setIsEditing(false);
    };

    const userMenu = () => {
        if (localStorage.getItem("jwtToken")) {
            return (

                <Menu>
                    {
                        decodeJWT(localStorage.getItem("jwtToken")).scope != "CUSTOMER" ? (<Menu.Item key="dashboard" icon={<AppstoreOutlined />} onClick={handleDashboardClick}>
                            Dashboard
                        </Menu.Item>) : (<Menu.Item key="profile" icon={<AppstoreOutlined />} onClick={() => { navigate("/profile") }}>
                            Profile
                        </Menu.Item>)
                    }

                    <Menu.Item key="signout" icon={<SettingOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </Menu>
            )
        } else navigate("/auth/login");
    }

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0fa4d6', padding: '0 20px', height: '64px', color: '#fff' }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate('/')} // Navigate to homepage when clicked
                >
                    <img src="/logo-capybook.png" alt="Capybook Logo" style={{ height: '40px', marginRight: '20px' }} />
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Capybook</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BellOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '20px', color: '#fff' }} />
                    <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                        <Button
                            type="text"
                            icon={<UserOutlined />}
                            style={{ color: '#fff' }}
                        >

                            {localStorage.getItem("jwtToken") ? decodeJWT(localStorage.getItem("jwtToken")).sub : "Login"}

                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '20px', backgroundColor: '#f0f2f5', flex: '1 0 auto' }}>

                <h1 style={{ textAlign: 'center' }}>Profile</h1>
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
                    </Form.Item>

                </Form>
            </Content>


            <Footer style={{ textAlign: 'center', color: '#fff', backgroundColor: '#343a40', padding: '10px 0' }}>
                <div>© {new Date().getFullYear()} Capybook Management System</div>
                <div>All Rights Reserved</div>
            </Footer>
        </Layout>
    );

};

export default ProfileManagement;
