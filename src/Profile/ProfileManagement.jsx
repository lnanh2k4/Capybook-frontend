import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccountDetail } from '../config';
import {
    Button,
    Form,
    Input,
    Radio,
    Select
} from 'antd';
const { TextArea } = Input;
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
        <>
            {/* <DashboardContainer /> */}
            <h1 style={{ textAlign: 'center' }}>View Account Detail</h1>
            {/* <DashboardContainer /> */}
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
                        placeholder="Username of account " readOnly />
                </Form.Item>
                <Form.Item label="Fist Name">
                    <Input type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        placeholder="First name of account" readOnly />
                </Form.Item>
                <Form.Item label="Last Name">
                    <Input type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        placeholder="Last name of account" readOnly />
                </Form.Item>
                <Form.Item label="Date Of Birth">
                    <Input type='date' name="dob"
                        value={formData.dob || ''}
                        placeholder="Date of birth" readOnly />
                </Form.Item>
                <Form.Item label="Email">
                    <Input type='email'
                        name="email"
                        value={formData.email || ''}
                        placeholder="Email of account" readOnly />
                </Form.Item>
                <Form.Item label="Phone">
                    <Input type='tel'
                        name="phone"
                        value={formData.phone || ''}
                        placeholder="Phone number of account" readOnly />
                </Form.Item>
                {console.log("Sex", formData.sex)}
                <Form.Item label="Sex" readOnly>
                    <Radio.Group name='sex' value={String(formData.sex)} readOnly>
                        <Radio value="0"  > Female </Radio>
                        <Radio value="1" > Male </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Role">
                    <Select name="role" value={String(formData.role)} readOnly>
                        <Select.Option value="0" >Admin</Select.Option>
                        <Select.Option value="1" >Customer</Select.Option>
                        <Select.Option value="2" >Seller staff</Select.Option>
                        <Select.Option value="3" >Warehouse staff</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Address" readOnly>
                    <TextArea rows={4} type="text"
                        name="address"
                        value={formData.address || ''}
                        placeholder="Address of account" />
                </Form.Item>
                <Form.Item>
                    <Button type='default' onClick={goToAccountManagement}>Cancel</Button>
                </Form.Item>
            </Form >
        </>
    );
}

export default AccountDetail;