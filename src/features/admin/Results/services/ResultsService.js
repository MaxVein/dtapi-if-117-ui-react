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
        try {
            const faculties = await axios.get(`${this.url}Faculty/getRecords`);
            return faculties.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchTests() {
        try {
            const tests = await axios.get(`${this.url}test/getRecords`);
            return tests.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchGroupsByFaculty(id) {
        try {
            const groups = await axios.get(`${this.url}group/getGroupsByFaculty/${id}`);
            return groups.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchResultTestIdsByGroup(id) {
        try {
            const response = await axios.get(`${this.url}Result/getResultTestIdsByGroup/${id}`);
            return response.data;
        } catch (e) {
            return { error: e.response.data };
        }
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

    async fetchSubjectById(id) {
        return await axios.get(`${this.url}subject/getRecords/${id}`);
    }

    async fetchGroupTestResults(testId, groupId, subjectId) {
        try {
            const students = await this.fetchStudentsByGroup(groupId, true);
            const results = await this.fetchResultsByTestGroupDate(testId, groupId);
            const subject = await this.fetchSubjectById(subjectId);
            localStorage.setItem('subject_name', JSON.stringify(subject.data[0].subject_name));
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
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchAllQuestions(ids) {
        try {
            const response = await axios.post(`${this.url}EntityManager/getEntityValues`, {
                entity: 'Question',
                ids,
            });
            return response.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    getMaxStudentsResults(dataSource) {
        const filtered = [];
        for (const item of dataSource) {
            const index = filtered.findIndex((elem) => elem.student_id === item.student_id);
            if (index < 0) {
                filtered.push(item);
            } else {
                if (+filtered[index].result < +item.result) {
                    filtered[index] = item;
                }
            }
        }
        return filtered;
    }

    getMinStudentsResults(dataSource) {
        const filtered = [];
        for (const item of dataSource) {
            const index = filtered.findIndex((elem) => elem.student_id === item.student_id);
            if (index < 0) {
                filtered.push(item);
            } else {
                if (+item.result < +filtered[index].result) {
                    filtered[index] = item;
                }
            }
        }
        return filtered;
    }

    async fetchAnswersByQuestionId(id) {
        try {
            const answers = await axios.get(`${this.url}answer/getAnswersByQuestion/${id}`);
            return answers.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }
}

export const ResultsServiceApi = new ResultsService(environment.BASEURL);
