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
import AddOrder from "./OrderManagement/AddOrder";
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
        
        {/* Book Management */}
        <Route path="/dashboard/books" element={<BookManagement />} />


        {/* Account Management */}
        <Route path="/dashboard/accounts" element={<AccountManagement />} />
        <Route path="/dashboard/accounts/add" element={<AddAccount />} />
        <Route path="/dashboard/accounts/detail/:username" element={<AccountDetail />} />
        <Route path="/dashboard/accounts/edit/:username" element={<EditAccount />} />

        <Route path="/dashboard/books/detail" element={<ViewBookDetail />} />
        <Route path="/dashboard/books/edit" element={<EditBook />} />
        <Route path="/dashboard/books/detail/:bookId" element={<ViewBookDetail />} />

        <Route path="/dashboard/inventory" element={<InventoryManagement />} /> {/* This should now work */}

        {/* Promotion Management */}
        <Route path="/dashboard/promotions" element={<PromotionManagement />} />
        <Route path="/dashboard/promotions/add" element={<AddPromotion />} />
        <Route path="/dashboard/promotions/detail/:proID" element={<PromotionDetail />} />
        <Route path="/dashboard/promotions/edit/:proID" element={<EditPromotion />} />

        {/* Order Management */}
        <Route path="/dashboard/orders" element={<OrderManagement />} />
        <Route path="/dashboard/orders/add" element={<AddOrder />} />
        <Route path="/dashboard/orders/detail/:id" element={<OrderDetail />} />

        {/* Supplier Management */}
        <Route path="/dashboard/suppliers" element={<SupplierManagement />} />
        <Route path="/dashboard/suppliers/add" element={<AddSupplier />} />
        <Route path="/dashboard/suppliers/detail/:supID" element={<ViewSupplierDetail />} />
        <Route path="/dashboard/suppliers/edit/:supID" element={<EditSupplier />} />

        {/* Notification Management */}
        <Route path="/dashboard/notifications" element={<NotificationManagement />} />
        <Route path="/dashboard/notifications/add" element={<AddNotification />} />
        <Route path="/dashboard/notifications/detail/:notID" element={<AccountDetail />} />
        <Route path="/dashboard/notifications/edit/:notID" element={<EditAccount />} />

        {/* Category Management */}
        <Route path="/dashboard/categories" element={<CategoryManagement />} />
        <Route path="/dashboard/categories/add" element={<AddCategory />} />
        <Route path="/dashboard/categories/detail/:catID" element={<CategoryDetail />} />
        <Route path="/dashboard/categories/edit/:catID" element={<EditCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
