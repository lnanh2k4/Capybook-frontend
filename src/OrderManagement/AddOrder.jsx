import React, { useState, useEffect } from 'react';
import { Form, Button, Select, InputNumber, message } from 'antd';
import { fetchBooks, fetchPromotions, addOrder } from '../config'; // Đảm bảo các hàm API đã được import

const { Option } = Select;

const AddOrder = () => {
  const [form] = Form.useForm(); // Khởi tạo form từ Ant Design
  const [books, setBooks] = useState([]); // Dữ liệu các sách
  const [promotions, setPromotions] = useState([]); // Dữ liệu khuyến mãi
  const [selectedBooks, setSelectedBooks] = useState([]); // Các sách đã chọn
  const [selectedPromotion, setSelectedPromotion] = useState(null); // Khuyến mãi được chọn
  const [totalPrice, setTotalPrice] = useState(0); // Tổng tiền sau khi áp dụng khuyến mãi
  const [isFormEmpty, setIsFormEmpty] = useState(true); // Kiểm tra form có trống hay không

  useEffect(() => {
    // Fetch dữ liệu sách và khuyến mãi khi component được render
    fetchBooks().then(response => {
      setBooks(response.data);
    }).catch(error => {
      console.error("Error fetching books:", error);
    });

    fetchPromotions().then(response => {
      setPromotions(response.data);
    }).catch(error => {
      console.error("Error fetching promotions:", error);
    });
  }, []);

  const handleBookChange = (bookIds) => {
    // Khi sách được chọn, tính tổng tiền cho những cuốn sách đã chọn
    const selectedBooksData = books.filter(book => bookIds.includes(book.bookID));
    const sumPrice = selectedBooksData.reduce((total, book) => total + book.bookPrice, 0);
    setSelectedBooks(selectedBooksData);
    setTotalPrice(sumPrice);
  };

  const handlePromotionChange = (promotionId) => {
    // Áp dụng khuyến mãi
    const promotion = promotions.find(promo => promo.proID === promotionId);
    setSelectedPromotion(promotion);

    if (promotion && promotion.discount) {
      const discountAmount = (totalPrice * promotion.discount) / 100;
      const newTotalPrice = totalPrice - discountAmount;
      setTotalPrice(newTotalPrice);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const orderData = {
        orderDTO: {
          username: 'user123',  // Người dùng
          proID: selectedPromotion?.proID || null,  // Khuyến mãi, có thể không có
          orderDate: new Date().toISOString().slice(0, 10),  // Lấy ngày hiện tại (yyyy-MM-dd)
          orderStatus: 1  // Trạng thái mặc định là 1
        },
        orderDetails: selectedBooks.map(book => ({
          bookID: book.bookID,  // ID của sách
          quantity: values[`quantity_${book.bookID}`]  // Số lượng từng sách
        })),
      };

      console.log("Order data to be sent:", orderData);

      const response = await addOrder(orderData);  // Gửi yêu cầu tới API backend
      console.log('Order response:', response);
      message.success('Order added successfully');
    } catch (error) {
      console.error('Error adding order:', error);
      message.error('Failed to add order');
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isEmpty = !values.books || values.books.length === 0;
    setIsFormEmpty(isEmpty);
  };

  const handleResetOrBack = () => {
    if (isFormEmpty) {
      // Quay lại nếu form trống
      navigate("/dashboard/order-management");
    } else {
      form.resetFields(); // Reset lại form
      setIsFormEmpty(true); // Cập nhật trạng thái form về trống
    }
  };

  return (
    <div>
      <h2>Add Order</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={handleFormChange}  // Xử lý khi form thay đổi
      >
        <Form.Item label="Select Books" name="books" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Select books"
            onChange={handleBookChange}
            style={{ width: '100%' }}
          >
            {books.map(book => (
              <Option key={book.bookID} value={book.bookID}>
                {book.bookTitle} - {book.bookPrice} đ
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Hiển thị danh sách các sách đã chọn và số lượng */}
        {selectedBooks.map(book => (
          <Form.Item
            key={book.bookID}
            label={`Quantity for ${book.bookTitle}`}
            name={`quantity_${book.bookID}`}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber placeholder="Quantity" min={1} style={{ width: '100%' }} />
          </Form.Item>
        ))}

        <Form.Item label="Select Promotion" name="promotion">
          <Select
            placeholder="Select promotion (optional)"
            onChange={handlePromotionChange}
            style={{ width: '100%' }}
            allowClear
          >
            {promotions.map(promotion => (
              <Option key={promotion.proID} value={promotion.proID}>
                {promotion.proName} - {promotion.discount}% off
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Total Price">
          <InputNumber value={totalPrice} disabled style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button htmlType="button" onClick={handleResetOrBack} style={{ marginLeft: '20px' }}>
            {isFormEmpty ? 'Back' : 'Reset'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOrder;
