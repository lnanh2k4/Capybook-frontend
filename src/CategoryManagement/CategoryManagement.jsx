import { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from './CategoryAPI';
import { useNavigate } from 'react-router-dom';
import './CategoryManagement.css';

function CategoryManagement() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories()
            .then(response => {
                console.log("Fetched categories data:", response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteCategory(id)
                .then(() => {
                    setCategories(categories.filter(category => category.catID !== id));
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                });
        }
    };
    const handleSearch = () => {
        const filteredCategories = categories.filter(category =>
            category.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCategories(filteredCategories);
    };

    const goToAddCategory = () => {
        navigate('/add-category');
    };

    const goToEditCategory = (catID) => {
        navigate(`/edit-category/${catID}`);
    };

    const goToCategoryDetail = (catID) => {
        navigate(`/category-detail/${catID}`);
    };

    return (
        <div className="main-container">
            <div className="dashboard-container-alt">
                <div className="logo-container">
                    <img src="/logo-capybook.png" alt="Cabybook Logo" className="logo-image" />
                </div>
                <h2 className="dashboard-title">{"Le Nhut Anh"}</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-item">
                        <i className="fas fa-book dashboard-icon"></i>
                        <p>Account Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-user dashboard-icon"></i>
                        <p>Book Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Order Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Promotion Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Category Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Supplier Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Inventory Management</p>
                    </div>
                    <div className="dashboard-item">
                        <i className="fas fa-tags dashboard-icon"></i>
                        <p>Notification Management</p>
                    </div>
                </div>
                <div className="leave-logo-container">
                    <img src="/back_icon.png" className="leave-logo-image" />
                </div>
            </div>
            <div className="titlemanagement">
                <div> Category Management</div>
            </div>

            <div className="table-container">
                <div className="action-container">
                    <button className='add-book' onClick={goToAddCategory}>Add Category</button>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Parent Category</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.catID}>
                                <td>{category.catID}</td>
                                <td>{category.CategoryName}</td>
                                <td>{category.ParentCategory}</td>
                                <td>{category.Status}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={() => goToCategoryDetail(category.catID)}>Detail</button>
                                        <button className="edit" onClick={() => goToEditCategory(category.catID)}>Edit</button>
                                        <button className="delete" onClick={() => handleDelete(category.catID)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="copyright">
                <div>© Copyright {new Date().getFullYear()}</div>
                <div>Cabybook Management System</div>
                <div>All Rights Reserved</div>
            </div>
        </div>
    );
}

export default CategoryManagement;
