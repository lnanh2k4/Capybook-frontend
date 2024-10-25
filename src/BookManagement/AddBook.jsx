import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Upload, message, Select } from 'antd';
import { addBook, fetchCategories } from '../config'; // Ensure fetchCategories is imported
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

const { TextArea } = Input;
const { Option } = Select;

function AddBook() {
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]); // Add state for categories
    const navigate = useNavigate();

    // Fetch categories when the component mounts
   useEffect(() => {
    fetchCategories()
        .then((response) => {
            if (Array.isArray(response.data)) {
                // Lọc các danh mục chỉ bao gồm những danh mục không có parentCatID
                const rootCategories = response.data.filter(category => category.catStatus === 1 && !response.data.some(cat => cat.parentCatID === category.catID));
                setCategories(rootCategories);
            }
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
            message.error("Failed to fetch categories");
        });
}, []);


    const handleImageChange = ({ fileList: newFileList }) => {
        const file = newFileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setFileList(newFileList);
    };

    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();

            // Make sure catID and all necessary fields are included
            const bookData = {
                catID: values.catID,
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
                bookStatus: 1
            };
            console.log('Book Data:', bookData);  // Debugging log to check the form data

            formDataToSend.append('book', JSON.stringify(bookData));

            // Attach the image if it exists
            if (fileList.length > 0) {
                formDataToSend.append('image', fileList[0].originFileObj);
            }

            await addBook(formDataToSend);  // Call the API to submit the form
            message.success('Book added successfully');
            navigate("/dashboard/books");
        } catch (error) {
            console.error('Error adding book:', error);
            message.error('Failed to add book');
        }
    };


    const handleRemove = () => {
        setImagePreview(null);
        setFileList([]);
    };

    const handleReset = () => {
        form.resetFields();
        setImagePreview(null);
        setFileList([]);
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
                    {/* Category Selection */}
                    <Form.Item
                        label="Category"
                        name="catID"
                        rules={[{ required: true, message: 'Please select a category' }]}
                        style={{ width: '20%' }}
                    >
                        <Select placeholder="Select a category">
                            {categories.map((category) => (
                                <Option key={category.catID} value={category.catID}>
                                    {category.catName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Title" name="bookTitle" rules={[{ required: true, message: 'Please enter the title' }]}>
                        <Input placeholder="Title of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Publication Year"
                        name="publicationYear"
                        rules={[
                            { required: true, message: 'Please enter the publication year' },
                            {
                                type: 'number',
                                min: 1000,
                                max: new Date().getFullYear(),
                                message: 'Please enter a valid year',
                            },
                        ]}
                    >
                        <InputNumber placeholder="Publication year" style={{ width: '100%' }} />
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

                    <Form.Item
                        label="Hardcover"
                        name="hardcover"
                        rules={[
                            { required: true, message: 'Please enter the hardcover' },
                            { type: 'number', message: 'Please enter a valid number for the hardcover' },
                        ]}
                    >
                        <InputNumber placeholder="Hardcover details" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Publisher" name="publisher" rules={[{ required: true, message: 'Please enter the publisher' }]}>
                        <Input placeholder="Publisher of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[{ required: true, message: 'Please enter the weight' }]}
                    >
                        <InputNumber placeholder="Weight of the book" style={{ width: '100%' }} step={0.01} />
                    </Form.Item>

                    <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: 'Please enter the ISBN' }]}>
                        <Input placeholder="International Standard Book Number" />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="bookQuantity"
                        rules={[{ required: true, message: 'Please enter the quantity' }]}
                    >
                        <InputNumber min={1} step={1} placeholder="Quantity" style={{ width: '20%' }} />
                    </Form.Item>

                    {/* Image Upload Section */}
                    <Form.Item label="Image" name="image">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            onRemove={handleRemove}
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
