import axios from "axios";
import { environment } from "../../../environments/environment";

export function getRecords() {
  return axios.get(`${environment.BASEURL}Subject/getRecords`);
}
export function createSubjects(payload) {
  return axios.post(`${environment.BASEURL}Subject/insertData`, payload);
}
export function deleteSubjects(id) {
  return axios.get(`${environment.BASEURL}Subject/del/${id}`);
}
export function updateSubjects(id, payload) {
  return axios.post(`${environment.BASEURL}Subject/update/${id}`, payload);
}
export function filterArr(arr, searchKey) {
  return arr.filter((obj) =>
    Object.keys(obj).some((key) => obj[key].includes(searchKey))
  );
}
