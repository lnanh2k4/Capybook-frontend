import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, InputNumber, message, Modal, Table } from 'antd';
import { fetchSuppliers, fetchStaffs, createImportStock, fetchBooks } from '../config';
import DashboardContainer from '../DashBoard/DashBoardContainer';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function AddStock() {
    const [form] = Form.useForm();
    const [suppliers, setSuppliers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [books, setBooks] = useState([]);
    const [items, setItems] = useState([{ bookID: '', quantity: 1, price: 0 }]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track the index of the item to update
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supplierResponse = await fetchSuppliers();
                setSuppliers(supplierResponse.data || []);

                const staffResponse = await fetchStaffs();
                setStaff(staffResponse.data || []);

                const bookResponse = await fetchBooks(); // Fetch books
                console.log("Books fetched:", bookResponse.data);
                setBooks(bookResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("Failed to load data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const addItemRow = () => setItems([...items, { bookID: '', quantity: 1, price: 0 }]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItemRow = index => setItems(items.filter((_, i) => i !== index));

    const showBookModal = (index) => {
        setSelectedRowIndex(index); // Track the index of the item to update
        setIsModalVisible(true);
    };

    const handleSelectBook = (record) => {
        const newItems = [...items];
        newItems[selectedRowIndex] = {
            ...newItems[selectedRowIndex],
            bookID: record.bookID, // Lưu bookID để gửi lên server
            bookTitle: record.bookTitle, // Hiển thị bookTitle trong giao diện
        };
        setItems(newItems);
        setIsModalVisible(false); // Close the modal
    };


    const handleSubmit = async (values) => {
        try {
            const stockData = {
                supID: { supID: values.supID },
                importDate: values.importDate.format('YYYY-MM-DD'),
                staffID: { staffID: values.staffID },
                items: items.map(item => ({
                    bookID: item.bookID, // Gửi bookID
                    quantity: item.quantity,
                    price: item.price,
                })),
            };
            console.log("Stock data to send:", stockData);
            await createImportStock(stockData);
            message.success('Stock added successfully');
            navigate('/dashboard/inventory');
        } catch (error) {
            console.error('Error adding stock:', error);
            message.error('Failed to add stock');
        }
    };


    // Table columns for book selection modal
    // Table columns for book selection modal
    const bookColumns = [
        { title: 'Book ID', dataIndex: 'bookID', key: 'bookID' },
        { title: 'Title', dataIndex: 'bookTitle', key: 'bookTitle' },
        { title: 'Author', dataIndex: 'author', key: 'author' },
        { title: 'Price', dataIndex: 'bookPrice', key: 'price' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => handleSelectBook(record)}>
                    Select
                </Button>
            ),
        },
    ];


    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <h2>Add Stock</h2>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ maxWidth: '800px', margin: 'auto' }}
                >
                    <Form.Item
                        label="Supplier"
                        name="supID"
                        rules={[{ required: true, message: 'Please select a supplier' }]}
                    >
                        <Select placeholder="Select Supplier">
                            {suppliers.map(supplier => (
                                <Option key={supplier.supID} value={supplier.supID}>
                                    {supplier.supName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Import Date"
                        name="importDate"
                        rules={[{ required: true, message: 'Please select an import date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Staff"
                        name="staffID"
                        rules={[{ required: true, message: 'Please select a staff member' }]}
                    >
                        <Select placeholder="Select Staff">
                            {staff
                                .filter(member => member.username?.role === 0 || member.username?.role === 3)
                                .map(member => (
                                    <Option key={member.staffID} value={member.staffID}>
                                        {`${member.username?.firstName} ${member.username?.lastName}`}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <h3>Stock Items</h3>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <Input
                                placeholder="Book Title"
                                value={item.bookTitle} // Hiển thị bookTitle
                                readOnly
                                onClick={() => showBookModal(index)} // Show modal on click
                            />
                            <InputNumber
                                min={1}
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={value => handleItemChange(index, 'quantity', value)}
                            />
                            <InputNumber
                                min={0}
                                step={0.01}
                                placeholder="Price"
                                value={item.price}
                                onChange={value => handleItemChange(index, 'price', value)}
                            />
                            {items.length > 1 && (
                                <Button type="link" danger onClick={() => removeItemRow(index)}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button type="dashed" onClick={addItemRow} style={{ width: '100%' }}>
                        Add Item
                    </Button>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Modal to select book */}
            <Modal
                title="Select a Book"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Table
                    columns={bookColumns}
                    dataSource={books}
                    rowKey="bookID"
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </div>
    );
}

export default AddStock;
