import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Tabs } from 'antd';
import { fetchImportStocks, fetchSupplierById, fetchStaffById, fetchImportStockDetailsByStockId } from '../config';
import DashboardContainer from '../DashBoard/DashBoardContainer';

const { Search } = Input;

function InventoryManagement() {
    const [activeTab, setActiveTab] = useState('import');
    const [importStocks, setImportStocks] = useState([]);
    const [importLoaded, setImportLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suppliers, setSuppliers] = useState({});
    const [staffs, setStaffs] = useState({});

    useEffect(() => {
        if (activeTab === 'import' && !importLoaded) {
            loadImportStocks();
        }
    }, [activeTab, importLoaded]);

    const loadImportStocks = async () => {
        setLoading(true);
        try {
            const response = await fetchImportStocks();
            console.log('Import Stocks API Response:', response.data);

            if (Array.isArray(response.data)) {
                const importStocksData = response.data;

                // Fetch unique supplier and staff data
                const uniqueSupIDs = [...new Set(importStocksData.map(stock => stock.supID?.supID))].filter(id => id);
                const uniqueStaffIDs = [...new Set(importStocksData.map(stock => stock.staffID?.staffID))].filter(id => id);

                // Fetch suppliers
                const supplierPromises = uniqueSupIDs.map(id => fetchSupplierById(id).then(res => ({ id, data: res.data })));
                const supplierData = await Promise.all(supplierPromises);
                const suppliersMap = supplierData.reduce((map, item) => {
                    map[item.id] = item.data;
                    return map;
                }, {});
                setSuppliers(suppliersMap);
                console.log("Suppliers Map:", suppliersMap);

                // Fetch staffs
                const staffPromises = uniqueStaffIDs.map(id => fetchStaffById(id).then(res => ({ id, data: res.data })));
                const staffData = await Promise.all(staffPromises);
                const staffsMap = staffData.reduce((map, item) => {
                    map[item.id] = item.data;
                    return map;
                }, {});
                setStaffs(staffsMap);
                console.log("Staffs Map:", staffsMap);

                // Calculate Total Price for each ImportStock
                const stockWithDetailsPromises = importStocksData.map(async (stock) => {
                    try {
                        const detailsResponse = await fetchImportStockDetailsByStockId(stock.isid);
                        const details = detailsResponse.data;

                        // Log each detail object to verify structure
                        console.log(`Details for stock ID ${stock.isid}:`, details);

                        const totalPrice = details.reduce((sum, detail) => {
                            const quantity = detail.ISDQuantity || detail.isdquantity || 0;
                            const price = parseFloat(detail.importPrice) || 0;

                            console.log("Full detail object:", detail);
                            console.log(`Calculating Total Price - Quantity: ${quantity}, Import Price: ${price}`);

                            return sum + (quantity * price);
                        }, 0);

                        console.log(`Total Price for stock ID ${stock.isid}:`, totalPrice);
                        return { ...stock, totalPrice };
                    } catch (detailError) {
                        console.error(`Error fetching details for stock ID ${stock.isid}:`, detailError);
                        return { ...stock, totalPrice: 0 };
                    }
                });

                const stocksWithTotalPrice = await Promise.all(stockWithDetailsPromises);
                setImportStocks(stocksWithTotalPrice);
                setImportLoaded(true);
            } else {
                setImportStocks([]);
                message.error('Invalid data from API');
            }
            setError('');
        } catch (error) {
            console.error('Error fetching import stocks:', error);
            setError('Error fetching import stocks');
            message.error('Could not load data from API');
        }
        setLoading(false);
    };

    const importColumns = [
        { title: 'Stock ID', dataIndex: 'isid', key: 'isid' },
        {
            title: 'Supplier',
            dataIndex: 'supID',
            key: 'supID',
            render: (supID) => {
                const supplierName = supID ? suppliers[supID.supID]?.supName : 'Loading...';
                console.log("Rendering Supplier:", supID, supplierName);
                return supplierName || 'N/A';
            }
        },
        {
            title: 'Staff',
            dataIndex: 'staffID',
            key: 'staffID',
            render: (staffID) => {
                if (staffID && staffID.staffID) {
                    const staffUsername = staffs[staffID.staffID]?.username || 'N/A';
                    console.log("Rendering Staff with ID:", staffID.staffID, "Username:", staffUsername);
                    return staffUsername;
                } else {
                    return 'Loading...';
                }
            }
        },

        { title: 'Import Date', dataIndex: 'importDate', key: 'importDate' },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => {
                console.log("Rendering Total Price:", price);
                const formattedPrice = !isNaN(price) ? `${price.toFixed(2)} VND` : 'N/A';
                return formattedPrice;
            },
        },
        {
            title: 'Status',
            dataIndex: 'iSStatus',
            key: 'iSStatus',
            render: (status) => (status === 1 ? 'Inactive' : 'Active'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => console.log('Detail', record.isid)}>Detail</Button>
                </div>
            ),
        },
    ];



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-container">
            <div className="dashboard-container">
                <DashboardContainer />
            </div>
            <div className="dashboard-content">
                <h2>Inventory Management</h2>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'import',
                            label: 'Import',
                            children: (
                                <div>
                                    <div className="action-container">
                                        <Search
                                            placeholder="Search by ISID"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ width: 300, marginLeft: '20px' }}
                                        />
                                    </div>
                                    <Table
                                        columns={importColumns}
                                        dataSource={importStocks.filter(stock =>
                                            stock.isid.toString().includes(searchTerm)
                                        )}
                                        rowKey="isid"
                                    />
                                </div>
                            ),
                        },
                        {
                            key: 'export',
                            label: 'Export',
                            children: <div>Export Table Placeholder</div>,
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default InventoryManagement;
