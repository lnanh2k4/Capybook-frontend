import React, { useState, useEffect, useCallback } from "react";
import ReactHtmlParser from 'html-react-parser';
import {
    Layout,
    Menu,
    Dropdown,
    Button,
    List,
} from "antd";
import {
    UserOutlined,
    AppstoreOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { fetchAccountDetail, logout, fetchNotifications } from "../config"; // Fetch books and categories from API
import { decodeJWT } from "../jwtConfig";

const { Header, Footer, Content } = Layout;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const
                    fetchedNotifications = await fetchNotifications();
                setNotifications(fetchedNotifications.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                setError(error.message || 'An error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array: fetch data only once on component mount

    const renderItem = (item) => (
        <List.Item>
            <List.Item.Meta
                title={item.notTitle} // Assuming 'title' exists in your notification data
                description={ReactHtmlParser(item.notDescription) || 'No description available'} // Handle potential lack of description
            />
        </List.Item>
    );
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const userMenu = () => {
        if (decodeJWT()) {
            return (
                <Menu>
                    {decodeJWT().scope != "CUSTOMER" ? (
                        <Menu.Item
                            key="dashboard"
                            icon={<AppstoreOutlined />}
                            onClick={handleDashboardClick}
                        >
                            Dashboard
                        </Menu.Item>
                    ) : (
                        <Menu.Item
                            key="profile"
                            icon={<AppstoreOutlined />}
                            onClick={() => {
                                navigate("/profile");
                            }}
                        >
                            Profile
                        </Menu.Item>
                    )}
                    <Menu.Item
                        key="order-history"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => navigate("/OrderHistory")}
                    >
                        Order History
                    </Menu.Item>
                    <Menu.Item
                        key="signout"
                        icon={<SettingOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Menu.Item>
                </Menu>
            );
        } else navigate("/auth/login");
    };
    return (
        <Layout>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#0fa4d6",
                    padding: "0 20px",
                    height: "64px",
                    color: "#fff",
                }}
            >
                <div
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => navigate("/")} // Navigate to homepage when clicked
                >
                    <img
                        src="/logo-capybook.png"
                        alt="Capybook Logo"
                        style={{ height: "40px", marginRight: "20px" }}
                    />
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>Capybook</div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>

                    <ShoppingCartOutlined
                        style={{ fontSize: "24px", marginRight: "20px", color: "#fff" }}
                    />
                    <Dropdown
                        overlay={userMenu}
                        trigger={["click"]}
                        placement="bottomRight"
                    >
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
            <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={renderItem}
                loading={isLoading} // Display loading indicator while fetching data
                locale={{ emptyText: error ? error : 'No notifications yet' }} // Display custom message for loading or error states
            />
        </Layout>
    );
};


export default Notifications;