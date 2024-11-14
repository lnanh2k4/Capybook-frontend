import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { fetchSuppliers, fetchStaff, addStock } from '../config'; // API functions for suppliers, staff, and adding stock
import DashboardContainer from '../DashBoard/DashBoardContainer';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function AddStock() {
    const [form] = Form.useForm();
    const [suppliers, setSuppliers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [items, setItems] = useState([{ bookID: '', quantity: 1, price: 0 }]); // Initial row for items
    const navigate = useNavigate();

    // Fetch suppliers and staff data
    useEffect(() => {
        fetchSuppliers().then(response => setSuppliers(response.data || []));
        fetchStaff().then(response => setStaff(response.data || []));
    }, []);

    // Add new item row
    const addItemRow = () => {
        setItems([...items, { bookID: '', quantity: 1, price: 0 }]);
    };

    // Handle item field changes
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    // Remove item row
    const removeItemRow = index => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async values => {
        try {
            const stockData = {
                supID: values.supID,
                importDate: values.importDate.format('YYYY-MM-DD'),
                staffID: values.staffID,
                items: items.map(item => ({
                    bookID: item.bookID,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };
            await createImportStock(stockData);
            message.success('Stock added successfully');
            navigate('/dashboard/inventory');
        } catch (error) {
            console.error('Error adding stock:', error);
            message.error('Failed to add stock');
        }
    };

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <h2>Add Stock</h2>

                <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ maxWidth: '800px', margin: 'auto' }}>
                    <Form.Item label="Supplier" name="supID" rules={[{ required: true, message: 'Please select a supplier' }]}>
                        <Select placeholder="Select Supplier">
                            {suppliers.map(supplier => (
                                <Option key={supplier.supID} value={supplier.supID}>{supplier.supName}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Import Date" name="importDate" rules={[{ required: true, message: 'Please select an import date' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Staff" name="staffID" rules={[{ required: true, message: 'Please select a staff member' }]}>
                        <Select placeholder="Select Staff">
                            {staff.map(member => (
                                <Option key={member.staffID} value={member.staffID}>{member.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <h3>Stock Items</h3>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <Input placeholder="Book ID" value={item.bookID} onChange={e => handleItemChange(index, 'bookID', e.target.value)} />
                            <InputNumber min={1} placeholder="Quantity" value={item.quantity} onChange={value => handleItemChange(index, 'quantity', value)} />
                            <InputNumber min={0} step={0.01} placeholder="Price" value={item.price} onChange={value => handleItemChange(index, 'price', value)} />
                            {items.length > 1 && (
                                <Button type="link" danger onClick={() => removeItemRow(index)}>Remove</Button>
                            )}
                        </div>
                    ))}
                    <Button type="dashed" onClick={addItemRow} style={{ width: '100%' }}>Add Item</Button>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default AddStock;
