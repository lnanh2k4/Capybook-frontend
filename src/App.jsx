import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./DashBoard/DashBoard"; // Adjust this path if necessary
import AddBook from "./BookManagement/AddBook"; // Assuming this component exists
import BookManagement from "./BookManagement/BookManagement";
import ViewBookDetail from "./BookManagement/ViewBookDetail";
import EditBook from "./BookManagement/EditBook";
import PromotionManagement from "./PromotionManagement/PromotionManagement";
import AddPromotion from "./PromotionManagement/AddPromotion";
import OrderManagement from "./OrderManagement/OrderManagement";
import OrderDetail from "./OrderManagement/OrderDetail";
import PromotionDetail from "./PromotionManagement/PromotionDetail";
import EditPromotion from "./PromotionManagement/EditPromotion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/edit-book/:bookId" element={<EditBook />} />
        <Route path="/book-management" element={<BookManagement />} />
        <Route path="/book-detail" element={<ViewBookDetail />} />
        <Route path="/book-edit" element={<EditBook />} />
        <Route path="/promotion-management" element={<PromotionManagement />} />
        <Route path="/add-promotion" element={<AddPromotion />} />
        <Route path="/edit-promotion/:proID" element={<EditPromotion />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        <Route path="/book-detail/:bookId" element={<ViewBookDetail />} />
        <Route path="/book-detail/:bookId" element={<ViewBookDetail />} />
        <Route path="/promotion-detail/:proID" element={<PromotionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
