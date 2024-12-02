import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStaffDetail, updateStaff } from '../config';
import {
    Button,
    Form,
    Input,
    message,
    Radio,
    Select
} from 'antd';
const { TextArea } = Input;
const EditStaff = () => {
    const { staffID } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const goToStaffManagement = () => {
        navigate("/dashboard/staffs");
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
        staffID: ''
    });

    const handleSubmit = async (values) => {
        try {
            const formDataToSend = new FormData();

            // Create the book data object, explicitly setting bookStatus to 1
            const updatedStaffData = {
                ...values,
            };

            formDataToSend.append('staff', JSON.stringify(updatedStaffData));

            await updateStaff(staffID, formDataToSend);
            message.success('Account updated successfully');
            navigate("/dashboard/accounts");
        } catch (error) {
            console.error('Error updating account:', error);
            message.error('Failed to update account.');
        }
    };

    useEffect(() => {
        fetchStaffDetail(staffID)
            .then(response => {
                setFormData(response.data)
                form.setFieldsValue({
                    formData,
                    role: formData.role.toString(),
                    sex: formData.sex.toString()
                })
                console.log("data", response.data)
            })
            .catch(error => {
                console.error('Error fetching staff details:', error);
            });
    }, [staffID, form]);
    return (
        <>
            {/* <DashboardContainer /> */}
            <h1 style={{ textAlign: 'center' }}>Update Staff</h1>
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
                form={form}
                onFinish={handleSubmit}
            >
                <Form.Item label="Staff ID" name="staffID">
                    <Input
                        placeholder="Staff ID of account " readOnly disabled />
                </Form.Item>
                <Form.Item label="Username" name="username">
                    <Input
                        placeholder="Username of account " readOnly disabled />
                </Form.Item>
                <Form.Item label="Fist Name" name="firstName">
                    <Input type="text"
                        placeholder="First name of account" />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName">
                    <Input type="text"
                        placeholder="Last name of account" />
                </Form.Item>
                <Form.Item label="Date Of Birth" name="dob">
                    <Input type='date'
                        placeholder="Date of birth" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type='email'
                        placeholder="Email of staff" />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                    <Input type='tel'
                        placeholder="Phone number of account" />
                </Form.Item>
                <Form.Item label="Sex" name="sex">
                    <Radio.Group name='sex'>
                        <Radio value="0" > Female </Radio>
                        <Radio value="1" > Male </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Role" name="role">
                    <Select name="role">
                        <Select.Option value="0" >Admin</Select.Option>
                        <Select.Option value="2" >Seller staff</Select.Option>
                        <Select.Option value="3" >Warehouse staff</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Address" name="address">
                    <TextArea rows={4} type="text"
                        placeholder="Address of staff" />
                </Form.Item>
                <Form.Item>
                    <Button type='default' onClick={goToStaffManagement}>Cancel</Button>
                </Form.Item>
            </Form >
        </>
    );
}

export default EditStaff;
