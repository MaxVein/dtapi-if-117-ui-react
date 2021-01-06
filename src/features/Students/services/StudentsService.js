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
}

export const StudentsServiceAPI = new StudentsService(environment.BASEURL);
