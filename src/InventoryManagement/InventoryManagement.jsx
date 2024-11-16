import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Input, message, Tabs, Spin } from 'antd';
import { fetchImportStocks, fetchSupplierById, fetchStaffById, fetchImportStockDetailsByStockId } from '../config';
import DashboardContainer from '../DashBoard/DashBoardContainer';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

function InventoryManagement() {
    const navigate = useNavigate();
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

                const uniqueSupIDs = [...new Set(importStocksData.map(stock => stock.supID?.supID))].filter(id => id);
                const uniqueStaffIDs = [...new Set(importStocksData.map(stock => typeof stock.staffID === 'object' ? stock.staffID.staffID : stock.staffID))].filter(id => id);

                const supplierPromises = uniqueSupIDs.map(id => fetchSupplierById(id).then(res => ({ id, data: res.data })));
                const supplierData = await Promise.all(supplierPromises);
                const suppliersMap = supplierData.reduce((map, item) => {
                    map[item.id] = item.data;
                    return map;
                }, {});
                setSuppliers(suppliersMap);

                const staffPromises = uniqueStaffIDs.map(async (id) => {
                    try {
                        const res = await fetchStaffById(id);
                        return { id, data: res.data };
                    } catch (error) {
                        console.error(`Failed to fetch staff with ID ${id}:`, error);
                        return { id, data: null };
                    }
                });

                const staffData = await Promise.all(staffPromises);
                const staffsMap = staffData.reduce((map, item) => {
                    if (item.data) {
                        map[item.id] = item.data;
                    }
                    return map;
                }, {});
                setStaffs(staffsMap);

                const stockWithDetailsPromises = importStocksData.map(async (stock) => {
                    try {
                        const detailsResponse = await fetchImportStockDetailsByStockId(stock.isid);
                        const details = detailsResponse.data;
                        const totalPrice = details.reduce((sum, detail) => {
                            const quantity = detail.ISDQuantity || detail.isdquantity || 0;
                            const price = parseFloat(detail.importPrice) || 0;
                            return sum + (quantity * price);
                        }, 0);

                        return { ...stock, totalPrice };
                    } catch (error) {
                        console.error(`Error fetching details for stock ID ${stock.isid}:`, error);
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
        } catch (error) {
            console.error('Error fetching import stocks:', error);
            setError('Error fetching import stocks');
            message.error('Could not load data from API');
        }
        setLoading(false);
    };

    const goToStockDetail = (isid) => {
        navigate(`/dashboard/inventory/stock/${isid}`);
    };

    const goToAddStock = () => {
        navigate(`/dashboard/inventory/addstock`);
    };

    const importColumns = useMemo(() => [
        { title: 'Stock ID', dataIndex: 'isid', key: 'isid' },
        {
            title: 'Supplier',
            dataIndex: 'supID',
            key: 'supID',
            render: (supID) => suppliers[supID?.supID]?.supName || 'N/A',
        },
        {
            title: 'Staff',
            dataIndex: 'staffID',
            key: 'staffID',
            render: (staffID) => {
                console.log("Rendering Staff ID:", staffID);

                // Case 1: `staffID` is an object with `username`
                if (staffID && typeof staffID === 'object' && staffID.username) {
                    console.log("Staff Object with Username:", staffID);
                    const { firstName, lastName } = staffID.username;
                    return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
                }
                // Case 2: `staffID` is an ID
                else if (typeof staffID === 'number') {
                    const staffData = staffs[staffID];
                    console.log(`Staff Data from Map for ID ${staffID}:`, staffData);

                    if (staffData && staffData.username) {
                        const { firstName, lastName } = staffData.username;
                        return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
                    }
                }

                return 'N/A'; // Default if no valid data found
            },
        },

        { title: 'Import Date', dataIndex: 'importDate', key: 'importDate' },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => (!isNaN(price) ? `${new Intl.NumberFormat('en-US').format(price)} VND` : 'N/A'),
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        console.log(`Navigating to: /dashboard/inventory/stock/${record.isid}`);
                        goToStockDetail(record.isid);
                    }}
                >
                    Detail
                </Button>
            ),
        },
    ], [suppliers, staffs]);




    if (loading || !importLoaded) {
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
                                    <Button
                                        type="primary"
                                        style={{ marginBottom: 16 }}
                                        onClick={goToAddStock}
                                    >
                                        Import Stock
                                    </Button>
                                    <Search
                                        placeholder="Search by ISID"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ width: 300, marginLeft: 16 }}
                                    />
                                    <Table
                                        columns={importColumns}
                                        dataSource={importStocks.filter(stock => stock.isid.toString().includes(searchTerm))}
                                        rowKey="isid"
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default InventoryManagement;
