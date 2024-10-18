import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Image } from 'antd'; // Import các component cần thiết từ Ant Design
import { fetchBookById } from '../config'; // Import API để lấy chi tiết sách
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";

function ViewBookDetail() {
    const { bookId } = useParams(); // Lấy bookId từ URL
    const navigate = useNavigate(); // Điều hướng giữa các trang

    const [bookData, setBookData] = useState({
        bookTitle: '',
        publicationYear: '',
        author: '',
        dimension: '',
        translator: '',
        hardcover: '',
        publisher: '',
        weight: '',
        bookDescription: '',
        image: null,
        bookPrice: '',
        isbn: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchBookById(bookId)
            .then(response => {
                setBookData(response.data);
                const imageFromDB = response.data.image;
                if (imageFromDB && imageFromDB.startsWith(`/uploads/book_`)) {
                    const fullImagePath = `http://localhost:6789${imageFromDB}`;
                    setImagePreview(fullImagePath);
                } else {
                    setImagePreview(imageFromDB);
                }
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
            });
    }, [bookId]);

    const goToBookManagement = () => {
        navigate("/dashboard/books");
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card
                    title="Book Management - View Book Detail"
                    style={{ marginBottom: '30px', padding: '20px' }}
                    headStyle={{ fontSize: '20px', textAlign: 'center' }}
                >
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                        {imagePreview && (
                            <div style={{ flex: '0 0 300px', textAlign: 'center' }}>
                                <Image
                                    width={400}
                                    src={imagePreview}
                                    alt="Book Image"
                                    style={{ borderRadius: '8px' }} // Bo tròn các góc ảnh
                                />
                            </div>
                        )}
                        <div style={{ flex: '1', maxWidth: '100%' }}>
                            <Descriptions
                                bordered
                                column={1}
                                layout="horizontal"
                                style={{ marginBottom: '20px' }} // Giãn phần mô tả với khoảng cách
                                labelStyle={{ fontWeight: 'bold', fontSize: '14px', paddingBottom: '10px' }} // Tăng kích thước font chữ cho label
                                contentStyle={{ fontSize: '14px', paddingBottom: '10px', textAlign: 'right' }} // Tăng kích thước font chữ cho nội dung và canh phải
                            >
                                <Descriptions.Item label="Title" contentStyle={{ textAlign: 'left' }}>{bookData.bookTitle}</Descriptions.Item>
                                <Descriptions.Item label="Publication Year" contentStyle={{ textAlign: 'left' }}>{bookData.publicationYear}</Descriptions.Item>
                                <Descriptions.Item label="Author" contentStyle={{ textAlign: 'left' }}>{bookData.author}</Descriptions.Item>
                                <Descriptions.Item label="Dimensions" contentStyle={{ textAlign: 'left' }}>{bookData.dimension}</Descriptions.Item>
                                <Descriptions.Item label="Price" contentStyle={{ textAlign: 'left' }}>{bookData.bookPrice}</Descriptions.Item>
                                <Descriptions.Item label="Translator" contentStyle={{ textAlign: 'left' }}>{bookData.translator}</Descriptions.Item>
                                <Descriptions.Item label="Hardcover" contentStyle={{ textAlign: 'left' }}>{bookData.hardcover}</Descriptions.Item>
                                <Descriptions.Item label="Publisher" contentStyle={{ textAlign: 'left' }}>{bookData.publisher}</Descriptions.Item>
                                <Descriptions.Item label="Weight" contentStyle={{ textAlign: 'left' }}>{bookData.weight}</Descriptions.Item>
                                <Descriptions.Item label="Isbn" contentStyle={{ textAlign: 'left' }}>{bookData.isbn}</Descriptions.Item>
                                <Descriptions.Item label="Description" contentStyle={{ textAlign: 'left' }}>{bookData.bookDescription}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Button type="primary" onClick={goToBookManagement}>Back to Book Management</Button>
                    </div>
                </Card>
            </div>

            <div className="copyright" style={{ textAlign: 'center', paddingTop: '10px' }}>
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default ViewBookDetail;
