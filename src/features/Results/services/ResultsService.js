import axios from 'axios';
import { environment } from '../../../environments/environment';

class ResultsService {
    constructor(baseUrl) {
        this.url = baseUrl;
    }

    async fetchFaculties() {
        return await axios.get(`${this.url}Faculty/getRecords`);
    }

    async fetchGroupsByFaculty(id) {
        return await axios.get(`${this.url}group/getGroupsByFaculty/${id}`);
    }

    async fetchTests() {
        return await axios.get(`${this.url}test/getRecords`);
    }
}

export const ResultsServiceAPI = new ResultsService(environment.BASEURL);
