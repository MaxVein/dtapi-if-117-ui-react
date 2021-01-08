import axios from "axios";
import { environment } from "../../../environments/environment";

export function getRecords(entity) {
  return axios.get(`${environment.BASEURL + entity}/getRecords`);
}
export function createSubjects(entity, payload) {
  return axios.post(`${environment.BASEURL + entity}/insertData`, payload);
}
export function deleteSubjects(entity, id) {
  return axios.get(`${environment.BASEURL + entity}/del/${id}`);
}
export function updateSubjects(entity, id, payload) {
  return axios.post(`${environment.BASEURL + entity}/update/${id}`, payload);
}
export function filterArr(arr, searchKey) {
  return arr.filter((obj) =>
    Object.keys(obj).some((key) => obj[key].includes(searchKey))
  );
}
