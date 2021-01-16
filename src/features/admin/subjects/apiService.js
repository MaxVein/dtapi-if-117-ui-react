import axios from 'axios';
import { environment } from '../../../environments/environment';

export function getEntityValues(ids) {
    return axios.post(`${environment.BASEURL}EntityManager/getEntityValues`, ids);
}
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
export function concatArrays(arr1, arr2, ids) {
    const filterArr = arr1.filter((elem) => ids.includes(elem.group_id));
    arr2.forEach((elem, index) => {
        elem.group_name = filterArr[index].group_name;
    });
    return arr2;
}
export function compareTimetables(obj1, obj2) {
    if (
        obj1.group_id === obj2.group_id &&
        obj1.subject_id === obj2.subject_id &&
        obj1.start_time === obj2.start_time.toLocaleTimeString() &&
        obj1.end_time === obj2.end_time.toLocaleTimeString() &&
        obj1.start_date === obj2.start_date.toLocaleDateString().split('.').reverse().join('-') &&
        obj1.end_date === obj2.end_date.toLocaleDateString().split('.').reverse().join('-')
    ) {
        return true;
    } else {
        return false;
    }
}
export function converTimetablesData(obj) {
    obj.start_time = obj.start_time.toLocaleTimeString();
    obj.end_time = obj.end_time.toLocaleTimeString();
    obj.start_date = obj.start_date.toLocaleDateString().split('.').reverse().join('-');
    obj.end_date = obj.end_date.toLocaleDateString().split('.').reverse().join('-');
}
