import React, { useEffect, useState } from "react";
import { Spin, DatePicker, message } from "antd";
import { Column } from "@ant-design/plots";
import {
    fetchImportStockDetailsByStockId,
    fetchImportStocks,
    fetchOrderDetail,
    fetchBookDetail,
    fetchOrders,
} from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer";

const { RangePicker } = DatePicker;

const RevenueReport = () => {
    const [loading, setLoading] = useState(true);
    const [importData, setImportData] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [dateRange, setDateRange] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                console.log("Bắt đầu tải dữ liệu...");

                // Xử lý dữ liệu nhập kho
                console.log("Đang tải dữ liệu nhập kho...");
                const importResponse = await fetchImportStocks();
                console.log("Kết quả từ API nhập kho:", importResponse.data);

                const imports = await Promise.all(
                    importResponse.data.map(async (item) => {
                        try {
                            const detailsResponse = await fetchImportStockDetailsByStockId(item.isid);
                            console.log(`Chi tiết nhập kho ID ${item.isid}:`, detailsResponse.data);

                            const totalPrice = detailsResponse.data.reduce(
                                (sum, detail) => sum + (detail.iSDQuantity || 0) * (parseFloat(detail.importPrice) || 0),
                                0
                            );
                            console.log(`Tổng giá trị nhập kho ID ${item.isid}:`, totalPrice);

                            return {
                                date: item.importDate,
                                type: "Import",
                                value: totalPrice || 0,
                            };
                        } catch (error) {
                            console.error(`Lỗi khi lấy chi tiết nhập kho ID ${item.isid}:`, error);
                            return {
                                date: item.importDate,
                                type: "Import",
                                value: 0,
                            };
                        }
                    })
                );

                console.log("Dữ liệu nhập kho đã xử lý:", imports);

                // Xử lý dữ liệu xuất kho
                const loadOrders = async () => {
                    const response = await fetchOrders();
                    console.log("Kết quả từ API đơn hàng:", response.data);

                    const ordersData = response.data;

                    const ordersWithDetails = await Promise.all(
                        ordersData.map(async (order) => {
                            try {
                                const detailsResponse = await fetchOrderDetail(order.orderID);
                                console.log(`Chi tiết đơn hàng ID ${order.orderID}:`, detailsResponse.data);

                                const orderDetails = detailsResponse.data.orderDetails || [];

                                // Lấy chi tiết sách cho từng đơn hàng
                                const booksWithDetails = await Promise.all(
                                    orderDetails.map(async (detail) => {
                                        try {
                                            const bookResponse = await fetchBookDetail(detail.bookID);

                                            return { ...detail, book: bookResponse.data || {} };
                                        } catch (error) {
                                            console.error(`Lỗi khi lấy chi tiết sách cho ID ${detail.ODID}:`, error);
                                            return { ...detail, book: {} };
                                        }
                                    })
                                );

                                const totalBooksPrice = booksWithDetails.reduce(
                                    (sum, detail) => sum + (detail.quantity || 0) * (detail.book?.bookPrice || 0),
                                    0
                                );
                                const totalPrice = totalBooksPrice - (order.discount || 0);

                                console.log(`Tổng giá trị đơn hàng ID ${order.orderID}:`, totalPrice);

                                return {
                                    date: order.orderDate,
                                    type: "Export",
                                    value: totalPrice || 0,
                                };
                            } catch (error) {
                                console.error(`Lỗi khi lấy chi tiết đơn hàng ID ${order.orderID}:`, error);
                                return {
                                    date: order.orderDate,
                                    type: "Export",
                                    value: 0,
                                };
                            }
                        })
                    );

                    return ordersWithDetails;
                };

                const exports = await loadOrders();

                console.log("Dữ liệu xuất kho đã xử lý:", exports);

                // Cập nhật state
                setImportData(imports);
                setExportData(exports);
                setChartData([...imports, ...exports]);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải dữ liệu báo cáo doanh thu");
            } finally {
                console.log("Tải dữ liệu hoàn tất.");
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            const [startDate, endDate] = dates;

            const filteredImports = importData.filter((item) =>
                new Date(item.date) >= startDate.toDate() &&
                new Date(item.date) <= endDate.toDate()
            );

            const filteredExports = exportData.filter((item) =>
                new Date(item.date) >= startDate.toDate() &&
                new Date(item.date) <= endDate.toDate()
            );

            setChartData([...filteredImports, ...filteredExports]);
        } else {
            setChartData([...importData, ...exportData]);
        }
    };

    console.log("Dữ liệu truyền vào biểu đồ:", chartData);

    const config = {
        data: chartData.map((item) => ({
            ...item,
            value: item.value || 0, // Đảm bảo giá trị không phải null
        })),
        isGroup: true,
        xField: "date",
        yField: "value",
        seriesField: "type",
        color: ["#1890ff", "#ff4d4f"],
        legend: {
            position: "top",
        },
        xAxis: {
            title: { text: "Date" },
        },
        yAxis: {
            title: { text: "Revenue (VND)" },
        },
        tooltip: {
            formatter: (datum) => ({
                name: datum.type,
                value: `${new Intl.NumberFormat("vi-VN").format(datum.value)} VND`,
            }),
        },
    };


    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="dashboard-content">
                <h1>Welcome to Capybook Management System</h1>
                <p>Here is where you can manage your books, orders, promotions, and more.</p>
                <h2>Revenue Report</h2>
                <RangePicker
                    onChange={handleDateRangeChange}
                    style={{ marginBottom: "16px" }}
                />
                <Column {...config} />
            </div>
        </div>
    );
};

export default RevenueReport;
