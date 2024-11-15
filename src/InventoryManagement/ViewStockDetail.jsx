import React, { useEffect, useState } from 'react';
import { Table, Button, message, Spin, Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { fetchImportStockDetailsByStockId } from '../config';
import DashboardContainer from '../DashBoard/DashBoardContainer';

function ViewStockDetail() {
    const { stockId } = useParams();
    const [stockDetails, setStockDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(0);

    useEffect(() => {
        loadStockDetails();
    }, [stockId]);

    const loadStockDetails = async () => {
        setLoading(true);
        try {
            const response = await fetchImportStockDetailsByStockId(stockId);
            console.log(`Details for stock ID ${stockId}:`, response.data);

            if (Array.isArray(response.data)) {
                setStockDetails(response.data);
            } else {
                setStockDetails([]);
                message.error('Invalid data from API');
            }
        } catch (error) {
            console.error(`Error fetching stock details for ID ${stockId}:`, error);
            setError('Could not load stock details from API');
            message.error('Could not load data from API');
        }
        setLoading(false);
    };

    const showBookDetail = (book, quantity) => {
        setSelectedBook(book);
        setSelectedQuantity(quantity);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedBook(null);
        setSelectedQuantity(0);
    };

    const columns = [
        {
            title: 'Product ID',
            dataIndex: ['bookID', 'bookID'],
            key: 'productID',
            render: (_, record) => record.bookID?.bookID || 'N/A',
        },
        {
            title: 'Product Name',
            dataIndex: ['bookID', 'bookTitle'],
            key: 'productName',
            render: (_, record) => record.bookID?.bookTitle || 'N/A',
        },
        {
            title: 'Quantity',
            dataIndex: 'iSDQuantity',
            key: 'quantity',
            render: (_, record) => {
                console.log("Quantity record:", record);
                return record.isdquantity || 'N/A';
            },
        },
        {
            title: 'Import Price',
            dataIndex: 'importPrice',
            key: 'importPrice',
            render: (price) => (!isNaN(price) ? `${new Intl.NumberFormat('en-US').format(price)} VND` : 'N/A'),
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => {
                const quantity = record.isdquantity || 0;
                const price = parseFloat(record.importPrice) || 0;
                return `${new Intl.NumberFormat('en-US').format(quantity * price)} VND`;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => showBookDetail(record.bookID, record.iSDQuantity)}>
                    Detail
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="dashboard-content">
                <h2>Stock Detail - ID: {stockId}</h2>
                <Table
                    columns={columns}
                    dataSource={stockDetails}
                    rowKey="isdid"
                />

                <Button
                    type="primary"
                    style={{ marginTop: '20px' }}
                    onClick={() => window.history.back()}
                >
                    Back
                </Button>

                <Modal
                    title="Book Detail"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Close
                        </Button>,
                    ]}
                >
                    {selectedBook && (
                        <div>
                            <p><strong>Book ID:</strong> {selectedBook.bookID}</p>
                            <p><strong>Title:</strong> {selectedBook.bookTitle}</p>
                            <p><strong>Author:</strong> {selectedBook.author || 'N/A'}</p>
                            <p><strong>Translator:</strong> {selectedBook.translator || 'N/A'}</p>
                            <p><strong>Publisher:</strong> {selectedBook.publisher || 'N/A'}</p>
                            <p><strong>Publication Year:</strong> {selectedBook.publicationYear || 'N/A'}</p>
                            <p><strong>ISBN:</strong> {selectedBook.isbn || 'N/A'}</p>
                            <p><strong>Description:</strong> {selectedBook.bookDescription || 'N/A'}</p>
                            <p><strong>Quantity:</strong> {selectedQuantity}</p>
                            <p><strong>Price:</strong> {`${new Intl.NumberFormat('en-US').format(selectedBook.bookPrice || 0)} VND`}</p>
                            {/* Hiển thị hình ảnh nếu có */}
                            {selectedBook.image && (
                                <div style={{ marginTop: '15px' }}>
                                    <img
                                        src={`http://localhost:6789${selectedBook.image}`}
                                        alt="Book Cover"
                                        style={{ width: '100%', maxWidth: '200px', borderRadius: '5px' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default ViewStockDetail;
