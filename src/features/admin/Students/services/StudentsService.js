import axios from 'axios';
import { environment } from '../../../../environments/environment';

class StudentsService {
    constructor(baseUrl) {
        this.url = baseUrl;
    }

    async fetchStudentsByGroup(id, notPhotos = true) {
        try {
            const students = await axios.get(
                `${this.url}Student/getStudentsByGroup/${id}/${notPhotos ? 'withoutPhoto' : ''}`,
            );
            return students.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchStudentById(entity, id, operation) {
        if (operation === 'Transfer') {
            try {
                const response = await axios.get(`${this.url}${entity}/getRecords/${id}`);
                return response.data;
            } catch (e) {
                return { error: e.response.data };
            }
        } else {
            return await axios.get(`${this.url}${entity}/getRecords/${id}`);
        }
    }

    async fetchStudentDataForUpdate(id) {
        try {
            const studentUpdateData = [];
            const student = await this.fetchStudentById('Student', id, 'Update');
            studentUpdateData.push(student.data[0]);
            const adminUser = await this.fetchStudentById('AdminUser', id, 'Update');
            studentUpdateData[0].username = adminUser.data[0].username;
            studentUpdateData[0].email = adminUser.data[0].email;
            return studentUpdateData;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async create(student) {
        try {
            const update = await axios.post(`${this.url}Student/insertData`, student);
            return update.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async update(id, student) {
        try {
            const update = await axios.patch(`${this.url}Student/update/${id}`, student);
            return update.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async remove(id) {
        try {
            const response = await axios.delete(`${this.url}Student/del/${id}`);
            return response.data;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async check(entity, check, value) {
        try {
            const res = await axios.get(`${this.url}${entity}/${check}/${value}`);
            const { response } = res.data;
            return !response;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchEntityById(entity, id) {
        return await axios.get(`${this.url}${entity}/getRecords/${id}`);
    }

    async fetchStudentInfo(studentId, groupId) {
        try {
            const studentInfo = [];
            const student = await this.fetchStudentById('Student', studentId, 'View');
            studentInfo.push(student.data[0]);
            const adminUser = await this.fetchStudentById('AdminUser', studentId, 'View');
            studentInfo[0].username = adminUser.data[0].username;
            studentInfo[0].email = adminUser.data[0].email;
            const groupInfo = await this.fetchEntityById('Group', groupId);
            studentInfo[0].group_name = groupInfo.data[0].group_name;
            studentInfo[0].speciality_id = groupInfo.data[0].speciality_id;
            const facultyInfo = await this.fetchEntityById('Faculty', groupInfo.data[0].faculty_id);
            studentInfo[0].faculty_name = facultyInfo.data[0].faculty_name;
            const specialityInfo = await this.fetchEntityById(
                'Speciality',
                studentInfo[0].speciality_id,
            );
            studentInfo[0].speciality_code = specialityInfo.data[0].speciality_code;
            studentInfo[0].speciality_name = specialityInfo.data[0].speciality_name;
            return studentInfo;
        } catch (e) {
            return { error: e.response.data };
        }
    }

    async fetchFaculties() {
        try {
            const faculties = await axios.get(`${this.url}Faculty/getRecords`);
            return faculties.data;
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
}

export const StudentsServiceApi = new StudentsService(environment.BASEURL);
