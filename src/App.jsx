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
import AccountManagement from "./AccountManagement/AccountManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/books/addbook" element={<AddBook />} />
        <Route path="/dashboard/books/edit/:bookId" element={<EditBook />} />
        <Route path="/dashboard/books" element={<BookManagement />} />
        <Route path="/dashboard/books/detail" element={<ViewBookDetail />} />
        <Route path="/dashboard/books/edit" element={<EditBook />} />
        <Route path="/promotion-management" element={<PromotionManagement />} />
        <Route path="/add-promotion" element={<AddPromotion />} />
        <Route path="/edit-promotion/:proID" element={<EditPromotion />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        <Route path="/dashboard/books/detail/:bookId" element={<ViewBookDetail />} />
        <Route path="/dashboard/books/detail/:bookId" element={<ViewBookDetail />} />
        <Route path="/promotion-detail/:proID" element={<PromotionDetail />} />
        <Route path="/accounts/" element={<AccountManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
