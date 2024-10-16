// src/api.js
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:6789/api/'
});

export const fetchSuppliers = () => client.get('v1/suppliers/');

export const fetchSupplierDetail = (supID) => {
    console.log("Fetching supplier detail for ID:", supID);  // Log the proID
    return client.get(`/v1/suppliers/${supID}`);
}


export const addSupplier = async (supplierData) => {
    return await axios.post('http://localhost:6789/api/v1/suppliers/', supplierData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
export const updateSupplier = (supID, formDataToSend) => {
    return axios.put(`http://localhost:6789/api/v1/suppliers/${supID}`, formDataToSend);
};

export const deleteSupplier = (supID) => client.delete(`/v1/suppliers/${supID}`);
export const fetchSupplierById = (supID) => client.get(`/v1/suppliers/${supID}`);
