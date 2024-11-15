import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, updateBook, fetchCategories } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, InputNumber, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (bookId) {
            fetchBookById(bookId)
                .then(response => {
                    const bookData = response.data;
                    form.setFieldsValue({
                        ...bookData,
                        publicationYear: bookData.publicationYear.toString(),
                        catID: bookData.catID,
                    });
                    if (bookData.image && bookData.image.startsWith(`/uploads/book_`)) {
                        setImagePreview(`http://localhost:6789${bookData.image}`);
                    } else {
                        setImagePreview(bookData.image);
                    }
                })
                .catch(error => {
                    console.error('Error fetching book details:', error);
                    message.error('Failed to fetch book details.');
                });
        }
    }, [bookId, form]);

    useEffect(() => {
        fetchCategories()
            .then((response) => {
                if (Array.isArray(response.data)) {
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
        setFileList(newFileList);
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();

            // Prepare book data in a similar way as in AddBook
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

            formDataToSend.append('book', JSON.stringify(bookData));

            // Attach the image file if it exists
            if (fileList.length > 0) {
                formDataToSend.append('image', fileList[0].originFileObj);
            }

            await updateBook(bookId, formDataToSend);
            message.success('Book updated successfully');
            navigate("/dashboard/books");
        } catch (error) {
            console.error('Error updating book:', error);
            message.error('Failed to update book.');
        }
    };

    const handleRemove = () => {
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
                    <div>Book Management - Edit Book</div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ maxWidth: '700px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Category"
                        name="catID"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select a category">
                            {categories.map((category) => (
                                <Option key={category.catID} value={category.catID}>
                                    {category.catName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Title"
                        name="bookTitle"
                        rules={[{ required: true, message: 'Please enter the title' }]}
                    >
                        <Input placeholder="Title of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Publication Year"
                        name="publicationYear"
                        rules={[{ required: true, message: 'Please enter the publication year' }]}
                    >
                        <Input placeholder="Publication year" />
                    </Form.Item>

                    <Form.Item
                        label="Author"
                        name="author"
                        rules={[{ required: true, message: 'Please enter the author' }]}
                    >
                        <Input placeholder="Author of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Dimensions"
                        name="dimension"
                        rules={[{ required: true, message: 'Please enter the dimensions' }]}
                    >
                        <Input placeholder="Dimensions of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="bookPrice"
                        rules={[{ required: true, message: 'Please enter the price' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Price of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Translator"
                        name="translator"
                    >
                        <Input placeholder="Translator of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Hardcover"
                        name="hardcover"
                        rules={[{ required: true, message: 'Please enter the hardcover details' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Hardcover of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Publisher"
                        name="publisher"
                        rules={[{ required: true, message: 'Please enter the publisher' }]}
                    >
                        <Input placeholder="Publisher of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[{ required: true, message: 'Please enter the weight' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Weight of the book" />
                    </Form.Item>

                    <Form.Item
                        label="ISBN"
                        name="isbn"
                        rules={[{ required: true, message: 'Please enter the ISBN' }]}
                    >
                        <Input placeholder="International Standard Book Number" />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="bookQuantity"
                        rules={[{ required: true, message: 'Please enter the quantity' }]}
                    >
                        <InputNumber min={1} step={1} placeholder="Quantity" style={{ width: '20%' }} />
                    </Form.Item>

                    <Form.Item label="Image" name="image">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleImageChange}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Book Preview"
                                style={{ width: '100px', marginTop: '10px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="bookDescription"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Description of the book" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => navigate("/dashboard/books")}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default EditBook;
