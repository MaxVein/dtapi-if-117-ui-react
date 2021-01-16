import axios from 'axios';
import { environment } from '../../../../environments/environment';

class StudentsService {
    constructor(baseUrl) {
        this.url = baseUrl;
    }

    async fetchStudentsByGroup(id, notPhotos = true) {
        return await axios.get(
            `${this.url}Student/getStudentsByGroup/${id}/${notPhotos ? 'withoutPhoto' : ''}`,
        );
    }

    async fetchStudentById(entity, id) {
        const response = await axios.get(`${this.url}${entity}/getRecords/${id}`);
        return response.data;
    }

    async fetchStudentDataForUpdate(id) {
        const studentUpdateData = [];
        const student = await this.fetchStudentById('Student', id);
        studentUpdateData.push(student[0]);
        const adminUser = await this.fetchStudentById('AdminUser', id);
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

    async fetchEntityById(entity, id) {
        const response = await axios.get(`${this.url}${entity}/getRecords/${id}`);
        return response.data;
    }

    async fetchStudentInfo(studentId, groupId) {
        const studentInfo = [];
        const student = await this.fetchStudentById('Student', studentId);
        studentInfo.push(student[0]);
        const adminUser = await this.fetchStudentById('AdminUser', studentId);
        studentInfo[0].username = adminUser[0].username;
        studentInfo[0].email = adminUser[0].email;
        const groupInfo = await this.fetchEntityById('Group', groupId);
        studentInfo[0].group_name = groupInfo[0].group_name;
        studentInfo[0].speciality_id = groupInfo[0].speciality_id;
        const facultyInfo = await this.fetchEntityById('Faculty', groupInfo[0].faculty_id);
        studentInfo[0].faculty_name = facultyInfo[0].faculty_name;
        const specialityInfo = await this.fetchEntityById(
            'Speciality',
            studentInfo[0].speciality_id,
        );
        studentInfo[0].speciality_code = specialityInfo[0].speciality_code;
        studentInfo[0].speciality_name = specialityInfo[0].speciality_name;
        return studentInfo;
    }

    async fetchFaculties() {
        return await axios.get(`${this.url}Faculty/getRecords`);
    }

    async fetchGroupsByFaculty(id) {
        return await axios.get(`${this.url}group/getGroupsByFaculty/${id}`);
    }
}

export const StudentsServiceAPI = new StudentsService(environment.BASEURL);
