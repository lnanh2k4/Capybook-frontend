import React, { useEffect, useState } from "react";
import { Spin, Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Hoặc client đã cấu hình

const PaymentResultPage = () => {
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const navigate = useNavigate();

    // Gọi API để lấy kết quả thanh toán
    const fetchPaymentResult = async () => {
        try {
            const response = await axios.get("/api/v1/payment/return"); // Đường dẫn API
            setPaymentResult(response.data); // Lưu dữ liệu trả về
        } catch (error) {
            console.error("Error fetching payment result:", error);
            setPaymentResult({
                status: "error",
                message: "Unable to retrieve payment status. Please try again later.",
            });
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    useEffect(() => {
        fetchPaymentResult();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <Spin size="large" tip="Processing payment..." />
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
            {paymentResult?.status === "success" ? (
                <Result
                    status="success"
                    title="Payment Successful!"
                    subTitle={paymentResult.message}
                    extra={[
                        <Button type="primary" key="home" onClick={() => navigate("/")}>
                            Go to Homepage
                        </Button>,
                        <Button key="orders" onClick={() => navigate("/orders")}>
                            View Orders
                        </Button>,
                    ]}
                />
            ) : paymentResult?.status === "failed" ? (
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle={paymentResult.message}
                    extra={[
                        <Button type="primary" key="retry" onClick={() => navigate("/cart")}>
                            Retry Payment
                        </Button>,
                    ]}
                />
            ) : (
                <Result
                    status="error"
                    title="An Error Occurred"
                    subTitle={paymentResult?.message || "Something went wrong during the payment process."}
                    extra={[
                        <Button type="primary" key="support" onClick={() => navigate("/support")}>
                            Contact Support
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
};

export default PaymentResultPage;
