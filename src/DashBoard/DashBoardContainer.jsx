import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, BookOutlined, UserOutlined, TagsOutlined, BellOutlined, TruckOutlined, NotificationOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardContainer.css'; // Import CSS for the component
import decodeJWT from '../jwtConfig';
import { logout } from '../config';

const DashboardContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Sử dụng useLocation để lấy URL hiện tại
  const [collapsed, setCollapsed] = useState(true); // Trạng thái cho việc thu gọn
  const [current, setCurrent] = useState('1');
  const handleLogout = () => {
    logout()
    navigate("/");
  }
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
      case '/dashboard/category':
        setCurrent('6');
        break;
      case '/dashboard/inventory-management':
        setCurrent('7');
        break;
      case '/dashboard/notifications/':
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
        navigate("/dashboard/category");
        break;
      case '7':
        navigate("/dashboard/inventory");
        break;
      case '8':
        navigate("/dashboard/notifications/");
        break;
      default:
        break;
    }
  };

  let isAccountVisible, isBookVisible, isOrderVisible, isPromotionVisible, isSupplierVisible, isCategoryVisible, isInventoryVisible, isNotificationVisible, isStaffVisible = false;
  let scope = decodeJWT().scope
  if (scope.includes("ADMIN")) {
    isAccountVisible = isBookVisible = isOrderVisible = isPromotionVisible = isSupplierVisible = isCategoryVisible = isInventoryVisible = isNotificationVisible = isStaffVisible = true
  }
  if (scope.includes("SELLER_STAFF")) {
    isPromotionVisible = isOrderVisible = isCategoryVisible = true
  }
  if (scope.includes("WAREHOUSE_STAFF")) {
    isSupplierVisible = true
    isInventoryVisible = true
    isBookVisible = true
  }


  const items = [
    isAccountVisible && {
      key: '1',
      label: 'Account Management',
      icon: <UserOutlined />,
    },
    isBookVisible && {
      key: '2',
      label: 'Book Management',
      icon: <BookOutlined />,
    },
    isOrderVisible && {
      key: '3',
      label: 'Order Management',
      icon: <TagsOutlined />,
    },
    isPromotionVisible && {
      key: '4',
      label: 'Promotion Management',
      icon: <BellOutlined />,
    },
    isSupplierVisible && {
      key: '5',
      label: 'Supplier Management',
      icon: <TruckOutlined />,
    },
    isCategoryVisible && {
      key: '6',
      label: 'Category Management',
      icon: <BarsOutlined />,
    },
    isInventoryVisible && {
      key: '7',
      label: 'Inventory Management',
      icon: <AppstoreOutlined />,
    },
    isNotificationVisible && {
      key: '8',
      label: 'Notification Management',
      icon: <NotificationOutlined />,
    },
  ].filter(Boolean);

  return (
    <div
      className="dashboard-container"
      onMouseEnter={() => setCollapsed(false)}  // Mở rộng menu khi di chuột vào
      onMouseLeave={() => setCollapsed(true)}   // Thu gọn menu khi di chuột ra
      style={{ width: collapsed ? '80px' : '250px', transition: 'width 0.3s ease' }}
    >
      <div
        className="logo-container"
        onClick={() => navigate('/')} // Điều hướng về trang chủ "/"
        style={{ cursor: 'pointer' }} // Con trỏ chỉ định có thể bấm vào
      >
        <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
      </div>
      <div className="username-container" style={{ textAlign: 'center', margin: '10px 0', color: '#333', cursor: 'pointer' }} onClick={() => navigate('/dashboard/profile')}>
        <strong>{decodeJWT().sub}</strong> {/* Hiển thị tên người dùng */}
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
      <div className="back-logo-container" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }} onClick={handleLogout}>
        <img src="/back_icon.png" alt="Back Logo" style={{ height: '50px', cursor: 'pointer' }} /> {/* Thay đổi kích thước tùy ý */}
      </div>
    </div>
  );
};

export default DashboardContainer;