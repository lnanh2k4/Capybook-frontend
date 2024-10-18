import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Upload,
    message,
} from 'antd';
import { addBook } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { TextArea } = Input;

function AddBook() {
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [fileList, setFileList] = useState([]); // Define fileList state
    const navigate = useNavigate();

    const handleImageChange = ({ fileList: newFileList }) => {
        const file = newFileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setFileList(newFileList); // Update fileList state
    };

    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();
            const bookData = {
                bookTitle: values.bookTitle,
                publicationYear: values.publicationYear,
                author: values.author,
                dimension: values.dimension,
                translator: values.translator,
                hardcover: values.hardcover,
                publisher: values.publisher,
                weight: values.weight,
                bookDescription: values.bookDescription,
                bookPrice: values.bookPrice,
                isbn: values.isbn,
                bookQuantity: values.bookQuantity,
                bookStatus: 1,
            };

            formDataToSend.append('book', JSON.stringify(bookData));
            if (fileList.length > 0) {
                formDataToSend.append('image', fileList[0].originFileObj); // Add only one image file
            }

            await addBook(formDataToSend);
            message.success('Book added successfully');
            navigate("/dashboard/books");
        } catch (error) {
            console.error('Error adding book:', error);
            message.error('Failed to add book');
        }
    };

    const handleRemove = () => {
        setImagePreview(null);
        setFileList([]); // Reset the fileList when the image is removed
    };

    // Add handleReset function to reset form, image preview, and file list
    const handleReset = () => {
        form.resetFields(); // Reset the form fields
        setImagePreview(null); // Reset image preview
        setFileList([]); // Reset the fileList to empty
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Book Management - Add Book</div>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >
                    <Form.Item label="Title" name="bookTitle" rules={[{ required: true, message: 'Please enter the title' }]}>
                        <Input placeholder="Title of the book" />
                    </Form.Item>

                    <Form.Item label="Publication Year" name="publicationYear" rules={[{ required: true, message: 'Please enter the publication year' }]}>
                        <Input placeholder="Publication year" />
                    </Form.Item>

                    <Form.Item label="Author" name="author" rules={[{ required: true, message: 'Please enter the author' }]}>
                        <Input placeholder="Author of the book" />

                    </Form.Item>

                    <Form.Item label="Dimensions" name="dimension" rules={[{ required: true, message: 'Please enter the dimensions' }]}>
                        <Input placeholder="Dimensions of the book" />
                    </Form.Item>

                    <Form.Item label="Price" name="bookPrice" rules={[{ required: true, message: 'Please enter the price' }]}>
                        <Input placeholder="Price of the book" />
                    </Form.Item>

                    <Form.Item label="Translator" name="translator">
                        <Input placeholder="Translator of the book" />
                    </Form.Item>

                    <Form.Item label="Hardcover" name="hardcover" rules={[{ required: true, message: 'Please enter the hardcover' }]}>
                        <Input placeholder="Hardcover details" />
                    </Form.Item>

                    <Form.Item label="Publisher" name="publisher" rules={[{ required: true, message: 'Please enter the publisher' }]}>
                        <Input placeholder="Publisher of the book" />
                    </Form.Item>

                    <Form.Item label="Weight" name="weight" rules={[{ required: true, message: 'Please enter the weight' }]}>
                        <Input placeholder="Weight of the book" />
                    </Form.Item>

                    <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: 'Please enter the ISBN' }]}>
                        <Input placeholder="International Standard Book Number" />
                    </Form.Item>

                    <Form.Item label="Quantity" name="bookQuantity" rules={[{ required: true, message: 'Please enter the quantity' }]}>
                        <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>

                    {/* Image Upload Section */}
                    <Form.Item label="Image" name="image">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList} // Controlled by state
                            beforeUpload={() => false} // Prevent immediate upload
                            onChange={handleImageChange} // Handle file change
                            onRemove={handleRemove} // Handle file removal
                        >
                            {fileList.length < 1 && (
                                <>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </>
                            )}
                        </Upload>
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '200px', marginTop: '-100px' }} />}
                    </Form.Item>

                    <Form.Item label="Description" name="bookDescription" rules={[{ required: true, message: 'Please enter a description' }]}>
                        <TextArea rows={4} placeholder="Description of the book" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button htmlType="button" onClick={handleReset} style={{ marginLeft: '40px' }}>Reset</Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default AddBook;
