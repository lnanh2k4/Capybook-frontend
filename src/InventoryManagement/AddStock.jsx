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

    const [editModalVisible, setEditModalVisible] = useState(false);
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

        // Đồng bộ với `temporaryBooks` nếu `bookID` là null (tức là sách vừa thêm)
        if (field === "quantity" && !newItems[index].bookID) {
            const tempBookIndex = temporaryBooks.findIndex((book) => book.bookTitle === newItems[index].bookTitle);
            if (tempBookIndex !== -1) {
                const updatedTemporaryBooks = [...temporaryBooks];
                updatedTemporaryBooks[tempBookIndex].bookQuantity = value; // Cập nhật bookQuantity
                setTemporaryBooks(updatedTemporaryBooks);
            }
        }

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
                // Chỉ lấy thông tin bookTitle và bookID, không gán giá import price
            };
            setItems(newItems);
            setIsModalVisible(false);
        }
    };


    const handleImageChange = ({ fileList: newFileList }) => {
        console.log("New File List:", newFileList);
        const file = newFileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
        setFileList(newFileList);
    };


    const handleAddBookSubmit = (values) => {
        console.log("Form values:", values);

        const newBook = {
            ...values,
            bookID: null, // Sẽ được backend cập nhật sau
            bookStatus: 1,
            image: fileList[0]?.originFileObj || null,
        };

        const newItem = {
            bookID: null,
            bookTitle: values.bookTitle,
            quantity: values.bookQuantity || 1, // Lấy quantity từ modal
            price: 0, // Giá nhập kho mặc định ban đầu
        };

        setTemporaryBooks([...temporaryBooks, newBook]);
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            if (selectedRowIndex !== null) {
                updatedItems[selectedRowIndex] = newItem;
            } else {
                updatedItems.push(newItem);
            }
            return updatedItems;
        });

        setFileList([]);
        setIsAddBookModalVisible(false);

        message.success(`Book "${values.bookTitle}" added temporarily.`);
    };



    const handleSubmit = async (values) => {
        console.log("Submitting stock with items:", items);
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Gửi các sách mới từ `temporaryBooks` lên backend
            const createdBooks = await Promise.all(
                temporaryBooks.map(async (book) => {
                    const formData = new FormData();

                    // Chuẩn bị dữ liệu sách
                    const bookData = {
                        catID: book.catID,
                        bookTitle: book.bookTitle,
                        publicationYear: book.publicationYear,
                        author: book.author,
                        dimension: book.dimension,
                        translator: book.translator,
                        hardcover: book.hardcover,
                        publisher: book.publisher,
                        weight: book.weight,
                        bookDescription: book.bookDescription,
                        bookPrice: book.bookPrice,
                        isbn: book.isbn,
                        bookQuantity: book.bookQuantity,
                        bookStatus: 1,
                    };
                    formData.append("book", JSON.stringify(bookData));

                    // Gửi hình ảnh (nếu có)
                    if (book.image) {
                        formData.append("image", book.image);
                        console.log("Sending image:", book.image);
                    }

                    const response = await addBook(formData);
                    return { ...response.data }; // Trả về sách với `bookID` từ backend
                })
            );

            // Cập nhật `bookID` và `quantity` trong danh sách `items` với các sách vừa tạo
            const updatedItems = items.map((item) => {
                if (!item.bookID) {
                    const createdBook = createdBooks.find((book) => book.bookTitle === item.bookTitle);
                    if (createdBook) {
                        return { ...item, bookID: createdBook.bookID, quantity: item.quantity };
                    }
                }
                return item;
            });

            // Gửi thông tin nhập kho
            const stockData = {
                supID: { supID: values.supID },
                importDate: values.importDate.format("YYYY-MM-DD"),
                staffID: { staffID: values.staffID },
                ISStatus: 1,
            };
            const stockResponse = await createImportStock(stockData);
            const savedStockId = stockResponse.data.isid;

            // Gửi chi tiết nhập kho
            const detailsData = updatedItems.map((item) => ({
                bookID: { bookID: item.bookID },
                iSDQuantity: item.quantity,
                importPrice: item.price,
            }));
            await addImportStockDetail(savedStockId, detailsData);

            // Cập nhật quantity cho sách cũ
            for (const item of updatedItems) {
                const existingBook = books.find((book) => book.bookID === item.bookID);
                if (existingBook) {
                    const updatedBookData = {
                        ...existingBook,
                        bookQuantity: existingBook.bookQuantity + item.quantity,
                    };
                    const formData = new FormData();
                    formData.append("book", JSON.stringify(updatedBookData));
                    await updateBook(existingBook.bookID, formData);
                }
            }

            message.success("Stock added successfully.");
            setTemporaryBooks([]);
            setItems([]); // Reset items sau khi submit thành công
            navigate("/dashboard/inventory");
        } catch (error) {
            console.error("Error during stock submission:", error);
            message.error("Failed to submit stock.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const calculateTotalPrice = (quantity, price) => quantity * price;

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
                            <Input
                                placeholder="Book Title"
                                value={item.bookTitle}
                                readOnly
                                onClick={() => showBookModal(index)}
                            />
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>Quantity: </span>
                                <InputNumber
                                    min={1}
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(value) => handleItemChange(index, "quantity", value)}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>Import Price: </span>
                                <InputNumber
                                    min={0}
                                    step={0.01}
                                    placeholder="Import Price"
                                    value={item.price}
                                    onChange={(value) => handleItemChange(index, "price", value)}
                                />
                            </div>

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

                    <Form.Item label="Quantity" name="bookQuantity" rules={[{ required: true, message: "Please enter the quantity" }]}>
                        <InputNumber min={1} placeholder="Quantity" style={{ width: "100%" }} />
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
