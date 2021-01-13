import axios from 'axios';
import { environment } from '../../../environments/environment';

export function getTestRecords(id) {
    return axios.get(`${environment.BASEURL}/test/getTestsBySubject/${id}`);
}
export function getTimetableRecords(id) {
    return axios.get(`${environment.BASEURL}/timeTable/getTimeTablesForSubject/${id}`);
}
export function getRecords(entity) {
    return axios.get(`${environment.BASEURL + entity}/getRecords`);
}
export function createEntities(entity, payload) {
    return axios.post(`${environment.BASEURL + entity}/insertData`, payload);
}
export function deleteEntities(entity, id) {
    return axios.get(`${environment.BASEURL + entity}/del/${id}`);
}
export function updateEntities(entity, id, payload) {
    return axios.post(`${environment.BASEURL + entity}/update/${id}`, payload);
}
export function filterArr(arr, searchKey) {
    return arr.filter((obj) =>
        Object.keys(obj).some((key) => {
            return obj[key].toLowerCase().includes(searchKey.toLowerCase());
        }),
    );
}
export function objectsAreSame(x, y) {
    let objectsAreSame = true;
    for (const propertyName in x) {
        if (x[propertyName].toString() !== y[propertyName].toString()) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
}
