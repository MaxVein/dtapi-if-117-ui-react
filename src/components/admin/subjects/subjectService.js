import axios from 'axios';
const url = 'https://dtapi.if.ua/api/';
class SubJectServices {
    getRecords() {
        return axios.get(`${url}Subject/getRecords`);
    }
    createSubject(payload) {
        return axios.post(`${url}Subject/insertData`, payload);
    }
    deleteSubject(id) {
        return axios.get(`${url}Subject/del/${id}`);
    }
    editSubject(id, payload) {
        return axios.post(`${url}Subject/update/${id}`, payload);
    }
}

export default SubJectServices;
