import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './DashBoard/DashBoard'; // Adjust this path if necessary
import AddBook from './BookManagement/AddBook'; // Assuming this component exists
import BookManagement from './BookManagement/BookManagement';
import ViewBookDetail from './BookManagement/ViewBookDetail';
import EditBook from './BookManagement/EditBook';

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
        <Route path="/book-detail/:bookId" element={<ViewBookDetail />} /> {/* Đảm bảo route này tồn tại */}
      </Routes>
    </Router>
  );
}

export default App;
