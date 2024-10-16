import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useParams và useNavigate
import { fetchAccountDetail } from '../config'; // Import API để lấy chi tiết sách

const AccountDetail = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const goToAccountManagement = () => {
        navigate("/dashboard/accounts");
    };

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        phone: '',
        role: '',
        address: '',
        sex: '',
        staffDTOCollection: '',
    });

    useEffect(() => {
        fetchAccountDetail(username)
            .then(response => {
                setFormData(response.data);
                console.log("data", response.data)
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
            });
    }, [username]);




    return (
        <div className="main-container">
            <div className="add-book-container">
                <form className="add-book-form">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} readOnly />
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Date Of Birth</label>
                            <input type="date" name="dob" value={formData.dob} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} readOnly />
                        </div>
                    </div>
                    <div className="form-center">
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" name="translator" value={formData.phone} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" name="hardcover" value={formData.role == 0 ? "Admin" : formData.role == 1 ? "Customer" : formData.role == 2 ? "Seller Staff" : "Warehouse Staff"} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" value={formData.address} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Sex</label>
                            <input type="text" name="sex" value={formData.sex == 0 ? "Female" : "Male"} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Staff ID</label>
                            <input type="text" name="staffID" value={formData.staffDTOCollection && formData.staffDTOCollection.length > 0 && formData.staffDTOCollection[0] ? formData.staffDTOCollection[0].staffID : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Manager ID</label>
                            <input type="text" name="managerID" value={formData.staffDTOCollection && formData.staffDTOCollection.length > 0 && formData.staffDTOCollection[0] ? formData.staffDTOCollection[0].managerID.staffID : ""} readOnly />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="button" onClick={goToAccountManagement}>Cancel</button>
                    </div>

                </form>
            </div>
            <div className="titlemanagement">
                <div> Account Management - View Account Detail </div>
            </div>
        </div>
    );
}

export default AccountDetail;
