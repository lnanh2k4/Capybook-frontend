import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccountDetail, updateAccount } from '../config';
import DashboardContainer from '../DashBoard/DashBoardContainer';

const AccountDetail = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const goToAccountManagement = () => {
        navigate(`/dashboard/accounts/`);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            const accountData = {
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                address: formData.address,
                sex: formData.sex,
                password: formData.password
            };

            formDataToSend.append('account', JSON.stringify(accountData));
            await updateAccount(username, formDataToSend);
            navigate("/dashboard/accounts");
        } catch (error) {
            console.error('Error adding accounts:', error);
        }
    };

    return (
        <div className="main-container">
            <DashboardContainer />
            <div className="add-account-container">
                <form className="add-account-form" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username || ''}
                                onChange={handleChange}
                                placeholder="Username of account "
                                readOnly />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName || ''}
                                onChange={handleChange}
                                placeholder="Last name of account"
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName || ''}
                                onChange={handleChange}
                                placeholder="First name of account"
                            />
                        </div>
                        <div className="form-group">
                            <label>Date Of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob || ''}
                                onChange={handleChange}
                                placeholder="Date of birth"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                placeholder="Address of account"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                placeholder="Email of account"
                            />
                        </div>
                    </div>

                    <div className="form-center">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                placeholder="Phone number of account"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name='role' onChange={handleChange}>
                                <option value={0}>Admin</option>
                                <option value={1}>Customer</option>
                                <option value={3}>Seller staff</option>
                                <option value={4}>Warehouse staff</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sex</label>
                            <select name='sex' onChange={handleChange}>
                                <option value={1}>Male</option>
                                <option value={0}>Female</option>
                            </select>
                        </div>

                    </div>
                    <div className="form-buttons">
                        <button type="submit">Submit</button>

                        <button type="button" onClick={goToAccountManagement}>Cancel</button>

                    </div>
                </form>
            </div>

            <div className="title-management">
                <div> Account Management - Edit Account </div>
            </div>

        </div>

    );
}

export default AccountDetail;
