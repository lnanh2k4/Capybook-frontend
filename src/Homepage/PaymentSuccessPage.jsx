import React, { useEffect, useState } from "react";
import {
    Layout,
    Result,
    Button,
    Spin,
    Menu,
    Dropdown,
    Typography,
} from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    BellOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { handlePaymentReturn } from "../config"; // API gọi backend
import { decodeJWT } from "../jwtConfig";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const PaymentSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy tham số từ URL
    const queryParams = new URLSearchParams(location.search);

    // Gọi API để xác minh giao dịch
    const fetchPaymentResult = async () => {
        try {
            const response = await handlePaymentReturn(queryParams); // Gửi tham số đến backend
            setPaymentResult(response); // Lưu kết quả từ backend
        } catch (error) {
            console.error("Error fetching payment result:", error);
            setPaymentResult({
                status: "error",
                message:
                    error.response?.data?.message ||
                    "Unable to retrieve payment status. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentResult();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };
    const handleCartClick = () => {
        navigate("/cart/ViewDetail")
    }
    const userMenu = (
        <Menu>
            {decodeJWT() ? (
                <>
                    <Menu.Item
                        key="profile"
                        icon={<UserOutlined />}
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </Menu.Item>
                    <Menu.Item
                        key="order-history"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => navigate("/OrderHistory")}
                    >
                        Order History
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        icon={<UserOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="login" onClick={() => navigate("/auth/login")}>
                    Login
                </Menu.Item>
            )}
        </Menu>
    );

    if (loading) {
        return (
            <Layout>
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#0fa4d6",
                        padding: "0 20px",
                        color: "#fff",
                    }}
                >
                    <div
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <img
                            src="/logo-capybook.png"
                            alt="Capybook Logo"
                            style={{ height: "40px", marginRight: "20px" }}
                        />
                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>Capybook</div>
                    </div>
                    <div>
                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: "24px", color: "#fff" }} />}
                        ></Button>
                        <ShoppingCartOutlined
                            style={{ fontSize: "24px", color: "#fff", margin: "0 20px" }}
                            onClick={handleCartClick}
                        />
                        <Dropdown overlay={userMenu} trigger={["click"]}>
                            <Button
                                type="text"
                                icon={<UserOutlined />}
                                style={{ color: "#fff" }}
                            >
                                {localStorage.getItem("jwtToken")
                                    ? decodeJWT(localStorage.getItem("jwtToken")).sub
                                    : "Login"}
                            </Button>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ textAlign: "center", marginTop: "20%" }}>
                    <Spin size="large" tip="Processing payment..." />
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                        color: "#fff",
                        backgroundColor: "#343a40",
                        padding: "10px 0",
                    }}
                >
                    © {new Date().getFullYear()} Capybook Management System
                </Footer>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <Header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0fa4d6",
                    padding: "0 20px",
                    color: "#fff",
                }}
            >
                <div
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <img
                        src="/logo-capybook.png"
                        alt="Capybook Logo"
                        style={{ height: "40px", marginRight: "20px" }}
                    />
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>Capybook</div>
                </div>
                <div>
                    <Button
                        type="text"
                        icon={<BellOutlined style={{ fontSize: "24px", color: "#fff" }} />}
                    ></Button>
                    <ShoppingCartOutlined
                        style={{ fontSize: "24px", color: "#fff", margin: "0 20px" }}
                    />
                    <Dropdown overlay={userMenu} trigger={["click"]}>
                        <Button
                            type="text"
                            icon={<UserOutlined />}
                            style={{ color: "#fff" }}
                        >
                            {localStorage.getItem("jwtToken")
                                ? decodeJWT(localStorage.getItem("jwtToken")).sub
                                : "Login"}
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            {/* Content */}
            <Content style={{ padding: "20px", minHeight: "600px" }}>
                <Title level={2} style={{ textAlign: "center" }}>
                    Payment Status
                </Title>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    {paymentResult?.status === "success" ? (
                        <Result
                            status="success"
                            title="Payment Successful!"
                            subTitle={
                                <>
                                    <p>{paymentResult.message}</p>
                                    <p>
                                        <strong>Transaction ID:</strong> {paymentResult.transactionId}
                                    </p>
                                    <p>
                                        <strong>Amount Paid:</strong> {paymentResult.amount} VND
                                    </p>
                                </>
                            }
                            extra={[
                                <Button
                                    type="primary"
                                    key="home"
                                    onClick={() => navigate("/")}
                                >
                                    Go to Homepage
                                </Button>,
                                <Button
                                    key="orders"
                                    onClick={() => navigate("/OrderHistory")}
                                >
                                    View Orders
                                </Button>,
                            ]}
                        />
                    ) : (
                        <Result
                            status="error"
                            title="Payment Failed"
                            subTitle={paymentResult?.message}
                            extra={[
                                <Button
                                    type="primary"
                                    key="retry"
                                    onClick={() => navigate("/cart")}
                                >
                                    Retry Payment
                                </Button>,
                                <Button
                                    key="support"
                                    onClick={() => navigate("/support")}
                                >
                                    Contact Support
                                </Button>,
                            ]}
                        />
                    )}
                </div>
            </Content>

            {/* Footer */}
            <Footer
                style={{
                    textAlign: "center",
                    color: "#fff",
                    backgroundColor: "#343a40",
                    padding: "10px 0",
                }}
            >
                © {new Date().getFullYear()} Capybook Management System
            </Footer>
        </Layout>
    );
};

export default PaymentSuccessPage;
