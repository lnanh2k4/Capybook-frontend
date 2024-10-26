import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Tabs } from 'antd';
import { fetchImportStocks } from '../config'; // Import the API function for Import Stocks
import DashboardContainer from '../DashBoard/DashBoardContainer'; // Correct path for DashboardContainer
import './InventoryManagement.css'; // Assuming there's a CSS file for styling

const { Search } = Input;
const { TabPane } = Tabs;

function InventoryManagement() {
    const [activeTab, setActiveTab] = useState('import'); // Manage active tab (import or export)
    const [importStocks, setImportStocks] = useState([]);
    const [importLoaded, setImportLoaded] = useState(false); // Track if Import data has been loaded
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Add state for search term

    useEffect(() => {
        if (activeTab === 'import' && !importLoaded) {
            loadImportStocks(); // Only load Import stocks if not already loaded
        }
    }, [activeTab, importLoaded]); // Dependency on activeTab and importLoaded

    const loadImportStocks = async () => {
        setLoading(true);
        try {
            const response = await fetchImportStocks();
            console.log(response.data); // Xem dữ liệu thực tế

            // Kiểm tra xem dữ liệu có đúng là mảng không
            if (Array.isArray(response.data.importStocks)) {
                setImportStocks(response.data.importStocks);  // Gán dữ liệu đúng
                setImportLoaded(true); // Mark data as loaded
            } else {
                setImportStocks([]);  // Nếu không phải mảng, đặt thành mảng rỗng
                message.error('Dữ liệu nhận được từ API không hợp lệ.');
            }
            setError('');
        } catch (error) {
            console.error('Error fetching import stocks:', error);
            setError('Error fetching import stocks');
            message.error('Không thể tải dữ liệu từ API');
        }
        setLoading(false);
    };

    const goToAddStock = () => {
        if (activeTab === 'import') {
            console.log('Navigate to Add Import Stock');
        } else if (activeTab === 'export') {
            console.log('Navigate to Add Export Stock');
        }
    };

    const exportColumns = [
        {
            title: 'Export ID',
            dataIndex: 'esid',
            key: 'esid',
        },
        {
            title: 'Staff Name',
            dataIndex: ['staffID', 'name'], // Assuming "name" is a field in StaffDTO
            key: 'staffID',
            render: (text, record) => record.staffID?.name || 'N/A',
        },
        {
            title: 'Export Date',
            dataIndex: 'exportDate',
            key: 'exportDate',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price} VND`, // You can format this accordingly
        },
        {
            title: 'Status',
            dataIndex: 'esStatus',
            key: 'esStatus',
            render: (status) => (status === 1 ? 'Completed' : 'Pending'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => console.log('Edit', record.esid)}>Edit</Button>
                    <Button type="link" danger onClick={() => console.log('Delete', record.esid)}>Delete</Button>
                </div>
            ),
        },
    ];

    const importColumns = [
        {
            title: 'Import ID',
            dataIndex: 'isid',
            key: 'isid',
        },
        {
            title: 'Import Date',
            dataIndex: 'importDate',
            key: 'importDate',
        },
        {
            title: 'Staff',
            dataIndex: ['staffID', 'name'], // Assuming "name" is a field in StaffDTO
            key: 'staffID',
            render: (text, record) => record.staffID?.name || 'N/A', // Safely access the nested data
        },
        {
            title: 'Supplier',
            dataIndex: ['supID', 'name'], // Assuming "name" is a field in SupplierDTO
            key: 'supID',
            render: (text, record) => record.supID?.name || 'N/A', // Safely access the nested data
        },
        {
            title: 'Status',
            dataIndex: 'iSStatus',
            key: 'iSStatus',
            render: (status) => (status === 1 ? 'Active' : 'Inactive'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => console.log('Edit', record.isid)}>Edit</Button>
                    <Button type="link" danger onClick={() => console.log('Delete', record.isid)}>Delete</Button>
                </div>
            ),
        },
    ];

    const filteredImportStocks = importStocks.filter(stock =>
        stock.isid.toString().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>

            <div className="dashboard-content">
                <div className="titlemanagement">
                    <div>Inventory Management</div>
                </div>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Import" key="import">
                        <div className="action-container">
                            <Button type="primary" onClick={goToAddStock}>Import+</Button>
                            <Search
                                placeholder="Search by ISID"
                                className="search-input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: 300, marginLeft: '20px' }}
                            />
                        </div>
                        <Table
                            columns={importColumns}
                            dataSource={filteredImportStocks} // Use filtered data
                            rowKey={record => record.isid}
                        />
                    </TabPane>

                    <TabPane tab="Export" key="export">
                        <div className="action-container">
                            <Button type="primary" onClick={goToAddStock}>Export+</Button>
                            <Search
                                placeholder="Search by ESID"
                                className="search-input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: 300, marginLeft: '20px' }}
                            />
                        </div>
                        <Table
                            columns={exportColumns} // Placeholder empty table for now
                            dataSource={[]} // No data for Export yet
                            rowKey="esid"
                        />
                    </TabPane>
                </Tabs>
            </div>
            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default InventoryManagement;
