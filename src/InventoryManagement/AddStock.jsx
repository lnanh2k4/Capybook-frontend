import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, DatePicker, InputNumber, message, Modal, Table, Upload } from "antd";
import { fetchSuppliers, fetchStaffs, createImportStock, fetchBooks, addImportStockDetail, addBook, fetchCategories, updateBook } from "../config";
import DashboardContainer from "../DashBoard/DashBoardContainer";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

function AddStock() {
    const [form] = Form.useForm();
    const [suppliers, setSuppliers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([{ bookID: "", quantity: 1, price: 0 }]);
    const [temporaryBooks, setTemporaryBooks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalKey, setModalKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supplierResponse = await fetchSuppliers();
                setSuppliers(supplierResponse.data || []);

                const staffResponse = await fetchStaffs();
                setStaff(staffResponse.data || []);

                const bookResponse = await fetchBooks();
                setBooks(bookResponse.data || []);

                const categoryResponse = await fetchCategories();
                setCategories(categoryResponse.data.filter(category => category.catStatus === 1) || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("Failed to load data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const addItemRow = () => setItems([...items, { bookID: "", quantity: 1, price: 0 }]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItemRow = (index) => setItems(items.filter((_, i) => i !== index));

    const showBookModal = (index) => {
        setSelectedRowIndex(index);
        setIsModalVisible(true);
    };

    const handleSelectBook = (record) => {
        if (record.bookTitle === "+ Add a new book") {
            setModalKey((prevKey) => prevKey + 1);
            setIsModalVisible(false);
            setIsAddBookModalVisible(true);
        } else {
            const newItems = [...items];
            newItems[selectedRowIndex] = {
                ...newItems[selectedRowIndex],
                bookID: record.bookID,
                bookTitle: record.bookTitle,
                price: record.bookPrice,
            };
            setItems(newItems);
            setIsModalVisible(false);
        }
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        const file = newFileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
        setFileList(newFileList);
    };

    const handleAddBookSubmit = async (values) => {
        try {
            const duplicateBook = books.find((book) => book.isbn === values.isbn);
            if (duplicateBook) {
                message.error(`Book with ISBN "${values.isbn}" already exists!`);
                return;
            }
            // Kiểm tra file ảnh (nếu có)
            let staticImagePath = null; // Biến lưu đường dẫn tĩnh của ảnh
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj;
                if (!file.type.startsWith("image/")) {
                    message.error("Only image files are allowed!");
                    return;
                }

                // Tạo đường dẫn tĩnh cho ảnh
                const timestamp = new Date().getTime();
                const uniqueFileName = `book_${timestamp}.jpg`; // Đặt tên file ảnh
                staticImagePath = `/uploads/${uniqueFileName}`; // Tạo đường dẫn tĩnh
            }

            // Chuẩn bị dữ liệu cho FormData
            const formData = new FormData();
            const bookData = {
                ...values,
                bookQuantity: items[selectedRowIndex]?.quantity || 1, // Lấy quantity
                bookStatus: 1,
                image: staticImagePath, // Đường dẫn ảnh
            };
            formData.append("book", JSON.stringify(bookData)); // Thêm book data vào FormData
            if (fileList.length > 0) formData.append("image", fileList[0].originFileObj); // Thêm file ảnh vào FormData

            // Gọi API để thêm hoặc cập nhật Book
            const response = await addBook(formData); // API này gọi đến backend
            if (response?.data) {
                const newBook = response.data;

                // Cập nhật state items
                const newItems = [...items];
                newItems[selectedRowIndex] = {
                    ...newItems[selectedRowIndex],
                    bookID: newBook.bookID,
                    bookTitle: newBook.bookTitle,
                    price: newBook.bookPrice,
                };
                setItems(newItems);

                message.success(`Book "${newBook.bookTitle}" added successfully.`);
            }
            setIsAddBookModalVisible(false); // Đóng modal
        } catch (error) {
            console.error("Error adding or updating book:", error);
            message.error("Error occurred while adding or updating the book. Please try again.");
        }
    };



    const handleSubmit = async (values) => {
        if (isSubmitting) return;
        if (!items.length) {
            message.error("No items to submit. Please add items.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Tạo thông tin nhập hàng (Import Stock)
            const stockData = {
                supID: { supID: values.supID },
                importDate: values.importDate.format("YYYY-MM-DD"),
                staffID: { staffID: values.staffID },
                ISStatus: 1,
            };

            // Gửi yêu cầu tạo Stock
            const stockResponse = await createImportStock(stockData);
            const savedStockId = stockResponse.data.isid;

            // Chuẩn bị chi tiết nhập hàng
            const detailsData = items.map((item) => ({
                bookID: { bookID: item.bookID },
                iSDQuantity: item.quantity,
                importPrice: item.price,
            }));

            // Gửi chi tiết nhập hàng (Add Import Stock Details)
            await addImportStockDetail(savedStockId, detailsData);

            // Kiểm tra và cập nhật Quantity cho từng sách
            for (const item of items) {
                const existingBook = books.find((book) => book.bookID === item.bookID);

                if (existingBook) {
                    // Nếu sách tồn tại, cộng thêm Quantity
                    const updatedBookData = {
                        ...existingBook,
                        bookQuantity: existingBook.bookQuantity + item.quantity,
                    };
                    const formData = new FormData();
                    formData.append("book", JSON.stringify(updatedBookData));
                    await updateBook(existingBook.bookID, formData);
                }
            }

            message.success("Stock added successfully");
            setTemporaryBooks([]); // Reset danh sách sách tạm thời
            navigate("/dashboard/inventory");
        } catch (error) {
            console.error("Error adding stock:", error);
            message.error("Failed to add stock.");
        } finally {
            setIsSubmitting(false);
        }
    };




    const bookColumns = [
        { title: "Book ID", dataIndex: "bookID", key: "bookID" },
        { title: "Title", dataIndex: "bookTitle", key: "bookTitle" },
        { title: "Author", dataIndex: "author", key: "author" },
        { title: "Price", dataIndex: "bookPrice", key: "bookPrice" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="link" onClick={() => handleSelectBook(record)}>
                    Select
                </Button>
            ),
        },
    ];

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="dashboard-content">
                <h2>Add Stock</h2>

                <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ maxWidth: "800px", margin: "auto" }}>
                    <Form.Item label="Supplier" name="supID" rules={[{ required: true, message: "Please select a supplier" }]}>
                        <Select placeholder="Select Supplier">
                            {suppliers.map(supplier => (
                                <Option key={supplier.supID} value={supplier.supID}>
                                    {supplier.supName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Import Date" name="importDate" rules={[{ required: true, message: "Please select an import date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Staff" name="staffID" rules={[{ required: true, message: "Please select a staff member" }]}>
                        <Select placeholder="Select Staff">
                            {staff.map(member => (
                                <Option key={member.staffID} value={member.staffID}>
                                    {`${member.username?.firstName} ${member.username?.lastName}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <h3>Stock Items</h3>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <Input placeholder="Book Title" value={item.bookTitle} readOnly onClick={() => showBookModal(index)} />
                            <InputNumber min={1} placeholder="Quantity" value={item.quantity} onChange={(value) => handleItemChange(index, "quantity", value)} />
                            <InputNumber min={0} step={0.01} placeholder="Price" value={item.price} onChange={(value) => handleItemChange(index, "price", value)} />
                            {items.length > 1 && (
                                <Button type="link" danger onClick={() => removeItemRow(index)}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button type="dashed" onClick={addItemRow} style={{ width: "100%" }}>
                        Add Item
                    </Button>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal title="Select a Book" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                <Table
                    columns={bookColumns}
                    dataSource={[...books, { bookID: "", bookTitle: "+ Add a new book" }]}
                    rowKey="bookID"
                    pagination={{ pageSize: 5 }}
                />
            </Modal>

            <Modal
                title="Add a New Book"
                visible={isAddBookModalVisible}
                key={modalKey}
                forceRender
                onCancel={() => {
                    setIsAddBookModalVisible(false);
                }}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleAddBookSubmit}>
                    <Form.Item label="Category" name="catID" rules={[{ required: true, message: "Please select a category" }]}>
                        <Select placeholder="Select a category">
                            {categories.map(category => (
                                <Option key={category.catID} value={category.catID}>
                                    {category.catName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Title" name="bookTitle" rules={[{ required: true, message: "Please enter the title" }]}>
                        <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                        label="Publication Year"
                        name="publicationYear"
                        rules={[
                            { required: true, message: "Please enter the publication year" },
                            { type: "number", min: 1900, max: new Date().getFullYear(), message: "Enter a valid year" },
                        ]}
                    >
                        <InputNumber placeholder="Publication Year" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Author" name="author" rules={[{ required: true, message: "Please enter the author" }]}>
                        <Input placeholder="Author" />
                    </Form.Item>

                    <Form.Item label="Price" name="bookPrice" rules={[{ required: true, message: "Please enter the price" }]}>
                        <InputNumber placeholder="Price" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Translator" name="translator">
                        <Input placeholder="Translator" />
                    </Form.Item>

                    <Form.Item label="Dimension" name="dimension" rules={[{ required: true, message: "Please enter the dimension" }]}>
                        <Input placeholder="Dimension (e.g., 8x10x2 cm)" />
                    </Form.Item>

                    <Form.Item
                        label="ISBN"
                        name="isbn"
                        rules={[
                            { required: true, message: "Please enter the ISBN" },
                            { pattern: /^[0-9]{10,13}$/, message: "ISBN must be 10-13 digits" },
                        ]}
                    >
                        <Input placeholder="ISBN" />
                    </Form.Item>

                    <Form.Item label="Publisher" name="publisher" rules={[{ required: true, message: "Please enter the publisher" }]}>
                        <Input placeholder="Publisher" />
                    </Form.Item>

                    <Form.Item label="Hardcover" name="hardcover">
                        <InputNumber placeholder="Hardcover" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Weight" name="weight" rules={[{ required: true, message: "Please enter the weight" }]}>
                        <InputNumber placeholder="Weight" style={{ width: "100%" }} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Description" name="bookDescription" rules={[{ required: true, message: "Please enter a description" }]}>
                        <TextArea rows={4} placeholder="Description" />
                    </Form.Item>

                    <Form.Item label="Image" name="image">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            onRemove={() => setFileList([])}
                        >
                            {fileList.length < 1 && (
                                <>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </>
                            )}
                        </Upload>
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            type="default"
                            onClick={() => {
                                setIsAddBookModalVisible(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Add Book
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default AddStock;
