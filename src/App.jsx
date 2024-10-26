import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./DashBoard/DashBoard"; // Adjust this path if necessary
import AddBook from "./BookManagement/AddBook";
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

import InventoryManagement from "./InventoryManagement/InventoryManagement"; // Ensure this import is added

import AddSupplier from "./SupplierManagement/AddSupplier";
import SupplierManagement from "./SupplierManagement/SupplierManagement";
import ViewSupplierDetail from "./SupplierManagement/ViewSupplierDetail";
import EditSupplier from "./SupplierManagement/EditSupplier";

import AccountDetail from "./AccountManagement/AccountDetail";
import AddAccount from "./AccountManagement/AddAccount";
import EditAccount from "./AccountManagement/EditAccount";

import NotificationManagement from "./NotificationManagement/NotificationManagement";
import AddNotification from "./NotificationManagement/AddNotification";

import CategoryManagement from "./CategoryManagement/CategoryManagement";
import AddCategory from "./CategoryManagement/AddCategory";
import CategoryDetail from "./CategoryManagement/CategoryDetail";
import EditCategory from "./CategoryManagement/EditCategory";

import Homepage from "./Homepage/Homepage";
import BookDetails from "./Homepage/BookDetails";

import ErrorPage from "./ErrorPage/Error404"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/PageNotFound" element={<ErrorPage />} />

        <Route path="/:bookId" element={<BookDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/books/add/" element={<AddBook />} />
        <Route path="/dashboard/books/edit/:bookId" element={<EditBook />} />
        <Route path="/dashboard/books" element={<BookManagement />} />
        <Route path="/dashboard/books/detail" element={<ViewBookDetail />} />
        <Route path="/dashboard/books/edit" element={<EditBook />} />
        <Route path="/dashboard/books/detail/:bookId" element={<ViewBookDetail />} />

        <Route path="/dashboard/inventory" element={<InventoryManagement />} /> {/* This should now work */}

        <Route path="/dashboard/promotion-detail/:proID" element={<PromotionDetail />} />
        <Route path="/dashboard/promotion-management" element={<PromotionManagement />} />
        <Route path="/dashboard/add-promotion" element={<AddPromotion />} />
        <Route path="/dashboard/edit-promotion/:proID" element={<EditPromotion />} />

        <Route path="/dashboard/order-management" element={<OrderManagement />} />
        <Route path="/dashboard/order-detail/:id" element={<OrderDetail />} />

        <Route path="/dashboard/suppliers" element={<SupplierManagement />} />
        <Route path="/dashboard/suppliers/add" element={<AddSupplier />} />
        <Route path="/dashboard/supplier/:supID" element={<ViewSupplierDetail />} />
        <Route path="/dashboard/suppliers/edit/:supID" element={<EditSupplier />} />

        <Route path="/dashboard/accounts" element={<AccountManagement />} />
        <Route path="/dashboard/accounts/detail/:username" element={<AccountDetail />} />
        <Route path="/dashboard/accounts/add" element={<AddAccount />} />
        <Route path="/dashboard/accounts/:username" element={<EditAccount />} />

        <Route path="/dashboard/notifications/" element={<NotificationManagement />} />
        <Route path="/dashboard/notifications/detail/:notID" element={<AccountDetail />} />
        <Route path="/dashboard/notifications/add" element={<AddNotification />} />
        <Route path="/dashboard/notifications/:notID" element={<EditAccount />} />

        <Route path="/dashboard/category" element={<CategoryManagement />} />
        <Route path="/dashboard/category/detail/:catID" element={<CategoryDetail />} />
        <Route path="/dashboard/category/add" element={<AddCategory />} />
        <Route path="/dashboard/category/:catID" element={<EditCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
