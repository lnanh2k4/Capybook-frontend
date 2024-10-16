import { useEffect, useState } from 'react';
import { fetchAccounts, deleteAccount } from '../config';
import { useNavigate } from 'react-router-dom';
import DashboardContainer from "../DashBoardContainer.jsx";

const AccountManagement = () => {
    const navigate = useNavigate();

    const goToAddAccount = () => {
        navigate('/dashboard/accounts/add');
    };
    const goToEditAccount = (username) => {
        navigate(`/dashboard/accounts/${username}`);
    };
    const goToAccountDetail = (username) => {
        navigate(`/dashboard/accounts/detail/${username}`);
    };


    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        fetchAccounts().then(response => {
            setAccounts(response.data);
        }).catch(error => {
            console.error('Error account books:', error);
        });
    }, []);

    const handleDelete = (username) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            deleteAccount(username).then(() => {
                setAccounts(accounts.filter(account => account.username !== username));
            }).catch(error => {
                console.error('Error deleting account:', error);
            });
        }
    };

    return (

        <div className="main-container">
            <DashboardContainer />
            <div className="title-management">
                <h1 style={{ color: 'white' }}> Account Management</h1>
            </div>
            <div className="table-container">

                <div className="action-container">
                    <button className='add-account' onClick={goToAddAccount}>Add account</button>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                        />
                        <button className="search-button">Search</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Sex</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {accounts.map((account) => (
                            <tr key={account.username}>
                                <td>{account.username}</td>
                                <td>{account.lastName + " " + account.firstName}</td>
                                <td>{account.sex === 0 ? "Female" : "Male"}</td>
                                <td>{account.role === 0 ? "Admin" : account.role === 1 ? "Customer" : account.role === 1 ? "Seller Staff" : "Warehouse Staff"}</td>
                                <td>{account.email}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="detail" onClick={() => goToAccountDetail(account.username)}>Detail</button>
                                        <button className="edit" onClick={() => goToEditAccount(account.username)}>Edit</button>
                                        <button className="delete" onClick={() => handleDelete(account.username)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AccountManagement