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

import AddSupplier from "./SupplierManagement/AddSupplier";
import SupplierManagement from "./SupplierManagement/SupplierManagement";
import ViewSupplierDetail from "./SupplierManagement/ViewSupplierDetail";
import EditSupplier from "./SupplierManagement/EditSupplier";

import AccountDetail from "./AccountManagement/AccountDetail";
import AddAccount from "./AccountManagement/AddAccount";
import EditAccount from "./AccountManagement/EditAccount";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/dashboard/books/add/" element={<AddBook />} />

        <Route path="/dashboard/books/edit/:bookId" element={<EditBook />} />
        <Route path="/dashboard/books" element={<BookManagement />} />

        <Route path="/dashboard/accounts" element={<AccountManagement />} />

        <Route path="/dashboard/books/detail" element={<ViewBookDetail />} />
        <Route path="/dashboard/books/edit" element={<EditBook />} />


        <Route
          path="/dashboard/promotion-management"
          element={<PromotionManagement />}
        />
        <Route path="/dashboard/add-promotion" element={<AddPromotion />} />
        <Route
          path="/dashboard/edit-promotion/:proID"
          element={<EditPromotion />}
        />
        <Route
          path="/dashboard/order-management"
          element={<OrderManagement />}
        />
        <Route path="/dashboard/order-detail/:id" element={<OrderDetail />} />
        <Route
          path="/dashboard/books/detail/:bookId"
          element={<ViewBookDetail />}
        />

        <Route
          path="/dashboard/promotion-detail/:proID"
          element={<PromotionDetail />}
        />

        <Route path="/dashboard/suppliers" element={<SupplierManagement />} />
        <Route path="/dashboard/suppliers/add" element={<AddSupplier />} />
        <Route path="/dashboard/supplier/:supID" element={<ViewSupplierDetail />} />
        <Route path="/dashboard/suppliers/edit/:supID" element={<EditSupplier />} />

        <Route path="/dashboard/accounts" element={<AccountManagement />} />
        <Route path="/dashboard/accounts/detail/:username" element={<AccountDetail />} />
        <Route path="/dashboard/accounts/add" element={<AddAccount />} />
        <Route path="/dashboard/accounts/:username" element={<EditAccount />} />


      </Routes>
    </Router>
  );
}

export default App;
