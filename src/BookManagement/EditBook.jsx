import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, updateBook } from '../config';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import { Form, Input, Button, InputNumber, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Ensure you're using a compatible date library

function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Ant Design form instance
    const [imagePreview, setImagePreview] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (bookId) {
            fetchBookById(bookId)
                .then(response => {
                    const bookData = response.data;
                    form.setFieldsValue({
                        ...bookData,
                        publicationYear: dayjs(bookData.publicationYear), // Ensure this is a valid Day.js object
                    });
                    if (bookData.image && bookData.image.startsWith(`/uploads/book_`)) {
                        setImagePreview(`http://localhost:6789${bookData.image}`);
                    }
                })
                .catch(error => {
                    console.error('Error fetching book details:', error);
                    message.error('Failed to fetch book details.');
                });
        }
    }, [bookId, form]);

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

            // Create the book data object, explicitly setting bookStatus to 1
            const updatedBookData = {
                ...values,
                publicationYear: values.publicationYear.format('YYYY'), // Format the year correctly
                bookStatus: 1, // Ensure bookStatus is always 1 when updating
            };

            formDataToSend.append('book', JSON.stringify(updatedBookData));

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
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >
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
                        <DatePicker picker="year" style={{ width: '100%' }} />
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
                        rules={[{ required: true, message: 'Please enter the translator' }]}
                    >
                        <Input placeholder="Translator of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Hardcover"
                        name="hardcover"
                        rules={[{ required: true, message: 'Please enter the hardcover details' }]}
                    >
                        <Input placeholder="Hardcover of the book" />
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
                        <Input placeholder="Weight of the book" />
                    </Form.Item>

                    <Form.Item
                        label="ISBN"
                        name="isbn"
                        rules={[{ required: true, message: 'Please enter the ISBN' }]}
                    >
                        <Input placeholder="International Standard Book Number" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="bookDescription"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Description of the book" />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="image"
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleImageChange}
                            maxCount={1}
                            beforeUpload={() => false} // Prevent auto-upload
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
