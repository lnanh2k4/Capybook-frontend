import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAccount } from '../config.js';
import DashboardContainer from "../DashBoard/DashBoardContainer.jsx";
import {
    Button,
    Form,
    Input,
    Radio,
    Select
} from 'antd';
const AddAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        phone: '',
        role: -1,
        address: '',
        sex: -1,
        staffDTOCollection: '',
        password: '',
    }
    );

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(value)
    };

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
            await addAccount(formDataToSend);
            navigate("/dashboard/accounts");
        } catch (error) {
            console.error('Error adding accounts:', error);
        }
    };

    const handleReset = () => {
        setFormData({
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
    };

    const { TextArea } = Input;
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Add Account</h1>
            <DashboardContainer />
            <div className="add-account-container">
                <Form
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 600,
                        marginLeft: '20%',
                        background: '255, 255, 0, 0.9',
                        padding: '3%',
                        borderRadius: '5%'
                    }}
                >
                    <Form.Item label="Username">
                        <Input name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            placeholder="Username of account " />
                    </Form.Item>
                    <Form.Item label="Fist Name">
                        <Input type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            placeholder="First name of account" />
                    </Form.Item>
                    <Form.Item label="Last Name">
                        <Input type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            placeholder="Last name of account" />
                    </Form.Item>
                    <Form.Item label="Date Of Birth">
                        <Input type='date' name="dob"
                            value={formData.dob || ''}
                            onChange={handleChange}
                            placeholder="Date of birth" />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input type='email'
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            placeholder="Email of account" />
                    </Form.Item>
                    <Form.Item label="Phone">
                        <Input type='tel'
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            placeholder="Phone number of account" />
                    </Form.Item>
                    <Form.Item label="Sex">
                        <Radio.Group name='sex'>
                            <Radio value="0"> Female </Radio>
                            <Radio value="1"> Male </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Role">
                        <Select name="role">
                            <Select.Option value="0">Admin</Select.Option>
                            <Select.Option value="1">Customer</Select.Option>
                            <Select.Option value="2">Seller staff</Select.Option>
                            <Select.Option value="3">Warehouse staff</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Address">
                        <TextArea rows={4} type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            placeholder="Address of account" />
                    </Form.Item>
                    <Form.Item>
                        <Button type='default' onClick={handleSubmit}>Submit</Button>
                        <Button type='default' onClick={handleReset} style={{ marginLeft: 10 }}>Reset</Button>
                    </Form.Item>
                </Form>
            </div >
        </>
    );
}

export default AddAccount;
