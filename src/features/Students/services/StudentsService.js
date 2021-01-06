import axios from "axios";
import { environment } from "../../../environments/environment";

class StudentsService {
  constructor(baseUrl) {
    this.url = baseUrl;
  }

  async fetchStudentsByGroup(id, notPhotos = true) {
    try {
      const response = await axios.get(
        `${this.url}Student/getStudentsByGroup/${id}/${
          notPhotos ? "withoutPhoto" : ""
        }`
      );
      return await response.data;
    } catch (e) {
      return e;
    }
  }
}

export const StudentsServiceAPI = new StudentsService(environment.BASEURL);
