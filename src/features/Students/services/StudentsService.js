import axios from "axios";
import { environment } from "../../../environments/environment";

class StudentsService {
  constructor(baseUrl) {
    this.url = baseUrl;
  }

  async fetchStudentsByGroup(id, notPhotos = true) {
    return await axios.get(
      `${this.url}Student/getStudentsByGroup/${id}/${
        notPhotos ? "withoutPhoto" : ""
      }`
    );
  }

  async fetchStudentById(entity, id) {
    const response = await axios.get(`${this.url}${entity}/getRecords/${id}`);
    return response.data;
  }

  async fetchStudentDataForUpdate(id) {
    const studentUpdateData = [];
    const student = await this.fetchStudentById("Student", id);
    studentUpdateData.push(student[0]);
    const adminUser = await this.fetchStudentById("AdminUser", id);
    studentUpdateData[0].username = adminUser[0].username;
    studentUpdateData[0].email = adminUser[0].email;
    return studentUpdateData;
  }

  async create(student) {
    return await axios.post(`${this.url}Student/insertData`, student);
  }

  async update(id, student) {
    return await axios.patch(`${this.url}Student/update/${id}`, student);
  }

  async remove(id) {
    return await axios.delete(`${this.url}Student/del/${id}`);
  }

  async check(entity, check, value) {
    const res = await axios.get(`${this.url}${entity}/${check}/${value}`);
    const { response } = res.data;
    return !response;
  }
}

export const StudentsServiceAPI = new StudentsService(environment.BASEURL);
