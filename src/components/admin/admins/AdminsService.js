import axios from 'axios';
import { environment } from '../../../environments/environment';
export const source = axios.CancelToken.source();

export function createData(id, username, email) {
    return { id, username, email };
}

export function createDataSource(admins) {
    const rows = [];
    for (let item of admins) {
        rows.push(createData(item.id, item.username, item.email));
    }
    return rows;
}

export async function getAdmins() {
    const Admins = await axios
        .get(`${environment.BASEURL}AdminUser/getRecords`)
        .then((res) => res.data);
    return Admins;
}

export async function addAdmin(body) {
    return await axios.post(`${environment.BASEURL}AdminUser/insertData`, body);
}

export async function deleteAdmin(id) {
    return await axios.delete(`${environment.BASEURL}AdminUser/del/${id}`).then((res) => res.data);
}

export async function updateAdmin(body, id) {
    return await axios
        .post(`${environment.BASEURL}AdminUser/update/${id}`, body)
        .then((res) => res.data);
}

export async function checkAdminName(username) {
    return await axios
        .get(`${environment.BASEURL}AdminUser/checkUserName/${username}`)
        .then((res) => res.data);
}
