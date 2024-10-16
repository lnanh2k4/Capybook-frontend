import { useEffect, useState } from 'react';
import { fetchAccounts } from '../config'; // Import các function từ api.js
// import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
    // const navigate = useNavigate();

    // const goToAddAccount = () => {
    //     navigate('/account/add');
    // };
    // const goToEditAccount = (username) => {
    //     navigate(`/account/edit/${username}`);
    // };
    // const goToAccountDetail = (username) => {
    //     navigate(`/account/detail/${username}`); // Corrected string interpolation
    // };


    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        fetchAccounts().then(response => {
            console.log("Fetched account data:", response.data); // In dữ liệu account ra console
            setAccounts(response.data);
        }).catch(error => {
            console.error('Error account books:', error);
        });
    }, []);

    // const handleDelete = (username) => {
    //     if (window.confirm("Are you sure you want to delete this account?")) {
    //         deleteAccount(username).then(() => {
    //             setAccounts(accounts.filter(account => account.username !== username));
    //         }).catch(error => {
    //             console.error('Error deleting account:', error);
    //         });
    //     }
    // };
    return (
        <div className="table-container">
            <div className="action-container">
                <button className='add-book'>Add account</button>
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
                                    <button className="detail">Detail</button>
                                    <button className="edit" >Edit</button>
                                    <button className="delete">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AccountManagement