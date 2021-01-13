import axios from 'axios';
import { environment } from '../../../../environments/environment';

class ResultsService {
    constructor(baseUrl) {
        this.url = baseUrl;
        this.A_THOUSAND = 1000;
        this.A_MINUTE_TO_SEC = 60;
        this.DAY_BY_HOURS = 24;
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

    async fetchResultTestIdsByGroup(id) {
        return await axios.get(`${this.url}Result/getResultTestIdsByGroup/${id}`);
    }

    async fetchStudentsByGroup(id, notPhotos = true) {
        return await axios.get(
            `${this.url}Student/getStudentsByGroup/${id}/${notPhotos ? 'withoutPhoto' : ''}`,
        );
    }

    async fetchResultsByTestGroupDate(testId, groupId) {
        return await axios.get(`${this.url}Result/getRecordsByTestGroupDate/${testId}/${groupId}`);
    }

    transformToTime(duration) {
        let seconds = Math.floor((duration / this.A_THOUSAND) % this.A_MINUTE_TO_SEC);
        let minutes = Math.floor(
            (duration / (this.A_THOUSAND * this.A_MINUTE_TO_SEC)) % this.A_MINUTE_TO_SEC,
        );
        let hours = Math.floor(
            (duration / (this.A_THOUSAND * this.A_MINUTE_TO_SEC * this.A_MINUTE_TO_SEC)) %
                this.DAY_BY_HOURS,
        );

        hours = `${hours}` < 10 ? '0' + `${hours}` : `${hours}`;
        minutes = `${minutes}` < 10 ? '0' + `${minutes}` : `${minutes}`;
        seconds = `${seconds}` < 10 ? '0' + `${seconds}` : `${seconds}`;

        return `${hours}:${minutes}:${seconds}`;
    }

    getTestDateAndTime(session_date, start_time, end_time) {
        const startTime = new Date(`${session_date} ${start_time}`);
        const endTime = new Date(`${session_date} ${end_time}`);
        const duration = Date.parse(endTime) - Date.parse(startTime);
        return this.transformToTime(duration);
    }

    async fetchGroupTestResults(testId, groupId) {
        const students = await this.fetchStudentsByGroup(groupId, true);
        const results = await this.fetchResultsByTestGroupDate(testId, groupId);
        const data = results.data.map((item) => {
            const duration = this.getTestDateAndTime(
                item.session_date,
                item.start_time,
                item.end_time,
            );
            const info = students.data.filter((data) => data.user_id === item.student_id);
            return Object.assign({}, item, ...info, { duration });
        });
        return data;
    }
}

export const ResultsServiceAPI = new ResultsService(environment.BASEURL);
