import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';  // Import ReactQuill
import 'react-quill/dist/quill.snow.css';  // Import ReactQuill styles
import { useNavigate } from 'react-router-dom';
import { addNotification, fetchStaffByUsername } from '../config.js';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { decodeJWT } from '../jwtConfig';
import {
    Button,
    Form,
    Input,
    Select,
    message
} from 'antd';
useEffect
const AddNotification = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const quillRef = useRef();  // Create a ref for ReactQuill
    const [text, setText] = useState('');


    const handleSubmit = async (values) => {

        try {
            const response = await fetchStaffByUsername(decodeJWT().sub);
            console.log(response);
            const NotificationData = {
                staffID: response.data,
                notTitle: values.notTitle,
                receiver: values.receiver,
                notDescription: text,  // Set description from ReactQuill content
                notStatus: "1"
            };
            const formDataToSend = new FormData();
            formDataToSend.append('notification', JSON.stringify(NotificationData));  // Append form data

            await addNotification(formDataToSend);  // Send POST request
            message.success('Notification added successfully');
            navigate("/dashboard/notifications");
        } catch (error) {
            console.error('Error:', error.message);
            message.error('Failed to add notification');
        }
    };

    const handleReset = () => {
        form.resetFields();  // Reset form fields
        setText('');  // Reset Quill text
    };

    const { Option } = Select;

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Add Notification</h1>
            <DashboardContainer />
            <div className="add-notification-container">
                <Form
                    initialValues={{
                        role: 'Please select role',
                        sex: '0',
                    }}
                    form={form}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    onFinish={handleSubmit}
                    style={{ maxWidth: 1200, margin: '0 auto' }}
                >
                    <Form.Item
                        label="Title"
                        name="notTitle"
                        rules={[{ required: true, message: "Please enter title" }]}
                    >
                        <Input placeholder="Title of notification" />
                    </Form.Item>

                    <Form.Item
                        label="Receiver"
                        name="receiver"
                        rules={[{ required: true, message: "Please select receiver" }]}
                    >
                        <Select>
                            <Option value="0">Admin</Option>
                            <Option value="1">Customer</Option>
                            <Option value="2">Seller staff</Option>
                            <Option value="3">Warehouse staff</Option>
                            <Option value="4">Seller and Warehouse</Option>
                            <Option value="5">Seller, Warehouse, and Customer</Option>
                            <Option value="6">All</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="notDescription"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <ReactQuill ref={quillRef} value={text} onChange={setText} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button type="default" onClick={handleReset} style={{ marginLeft: 10 }}>Reset</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default AddNotification;
