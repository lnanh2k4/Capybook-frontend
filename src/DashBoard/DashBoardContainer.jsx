import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, BookOutlined, UserOutlined, TagsOutlined, BellOutlined, TruckOutlined, NotificationOutlined, BarsOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardContainer.css'; // Import CSS for the component

const DashboardContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Sử dụng useLocation để lấy URL hiện tại
  const [collapsed, setCollapsed] = useState(true); // Trạng thái cho việc thu gọn
  const [current, setCurrent] = useState('1');

  useEffect(() => {
    // Cập nhật mục được chọn dựa trên URL
    const path = location.pathname;
    switch (path) {
      case '/dashboard/accounts':
        setCurrent('1');
        break;
      case '/dashboard/books':
        setCurrent('2');
        break;
      case '/dashboard/order-management':
        setCurrent('3');
        break;
      case '/dashboard/promotion-management':
        setCurrent('4');
        break;
      case '/dashboard/suppliers':
        setCurrent('5');
        break;
      case '/dashboard/category-management':
        setCurrent('6');
        break;
      case '/dashboard/inventory-management':
        setCurrent('7');
        break;
      case '/dashboard/notification-management':
        setCurrent('8');
        break;
      default:
        setCurrent('1'); // Mặc định là accounts nếu không tìm thấy
    }
  }, [location]);  // Mỗi khi URL thay đổi, useEffect sẽ chạy

  const onClick = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case '1':
        navigate("/dashboard/accounts");
        break;
      case '2':
        navigate("/dashboard/books");
        break;
      case '3':
        navigate("/dashboard/order-management");
        break;
      case '4':
        navigate("/dashboard/promotion-management");
        break;
      case '5':
        navigate("/dashboard/suppliers");
        break;
      case '6':
        navigate("/dashboard/category-management");
        break;
      case '7':
        navigate("/dashboard/inventory-management");
        break;
      case '8':
        navigate("/dashboard/notification-management");
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: '1',
      label: 'Account Management',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Book Management',
      icon: <BookOutlined />,
    },
    {
      key: '3',
      label: 'Order Management',
      icon: <TagsOutlined />,
    },
    {
      key: '4',
      label: 'Promotion Management',
      icon: <BellOutlined />,
    },
    {
      key: '5',
      label: 'Supplier Management',
      icon: <TruckOutlined />,
    },
    {
      key: '6',
      label: 'Category Management',
      icon: <BarsOutlined />,
    },
    {
      key: '7',
      label: 'Inventory Management',
      icon: <AppstoreOutlined />,
    },
    {
      key: '8',
      label: 'Notification Management',
      icon: <NotificationOutlined />,
    },
  ];

  return (
    <div
      className="dashboard-container"
      onMouseEnter={() => setCollapsed(false)}  // Mở rộng menu khi di chuột vào
      onMouseLeave={() => setCollapsed(true)}   // Thu gọn menu khi di chuột ra
      style={{ width: collapsed ? '80px' : '250px', transition: 'width 0.3s ease' }}
    >
      <div className="logo-container">
        <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
      </div>
      <div className="username-container" style={{ textAlign: 'center', margin: '10px 0', color: '#333' }}>
        <strong>Guest</strong> {/* Hiển thị tên người dùng */}
      </div>
      <Menu
        theme="light"
        onClick={onClick}
        inlineCollapsed={collapsed}  // Kiểm soát việc mở rộng hay thu gọn menu
        style={{
          width: '100%',
        }}
        selectedKeys={[current]}  // Đặt mục được chọn theo giá trị của state "current"
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default DashboardContainer;
