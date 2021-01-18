import axios from 'axios';
import { getEntityData, addEntity, updateEntity, deleteEntity } from '../../../common/utils';

export const getGroupsData = async () => {
    const source = axios.CancelToken.source();
    try {
        const requests = [
            getEntityData('Group', source),
            getEntityData('speciality', source),
            getEntityData('faculty', source),
        ];
        const response = await Promise.all(requests);
        let specialities = [],
            faculties = [];
        response[1].data.forEach((item) =>
            specialities.push({
                speciality_name: item.speciality_name,
                speciality_id: item.speciality_id,
            }),
        );
        response[2].data.forEach((item) =>
            faculties.push({ faculty_name: item.faculty_name, faculty_id: item.faculty_id }),
        );
        const newData = genereteTableData(response);
        source.cancel();
        return [newData, specialities, faculties];
    } catch (err) {
        return { err: 'Виникла проблема під час завантаження' };
    }
};

export const updateGroupsData = async (groupsData, editGroup, facultyData, specialityData) => {
    try {
        const response = await updateEntity('group', editGroup.editId, {
            group_name: editGroup.data.group_name,
            faculty_id: getFacId(editGroup.data.faculty_name, facultyData),
            speciality_id: getSpecId(editGroup.data.speciality_name, specialityData),
        });
        response.data[0] = {
            ...response.data[0],
            speciality_name: getSpecName(response.data[0].speciality_id, specialityData),
            faculty_name: getFacName(response.data[0].faculty_id, facultyData),
        };
        const updatedList = groupsData.map((item) =>
            response.data[0].group_id === item.group_id ? response.data[0] : item,
        );
        return updatedList;
    } catch (err) {
        return { err: 'Виникла проблема під час редагування' };
    }
};

export const addGroupsData = async (addGroup, facultyData, specialityData) => {
    try {
        const response = await addEntity('group', {
            group_name: addGroup.data.group_name,
            faculty_id: getFacId(addGroup.data.faculty_name, facultyData),
            speciality_id: getSpecId(addGroup.data.speciality_name, specialityData),
        });
        response.data[0] = {
            ...response.data[0],
            speciality_name: getSpecName(response.data[0].speciality_id, specialityData),
            faculty_name: getFacName(response.data[0].faculty_id, facultyData),
        };
        console.log(response.data[0]);
        return response.data[0];
    } catch (err) {
        return { err: 'Виникла проблема під час додавання' };
    }
};

export const delGroupsData = async (id, groupsData) => {
    try {
        const response = await deleteEntity('group', id);
        const updatedList = groupsData.filter((item) => id !== item.group_id);
        return updatedList;
    } catch (err) {
        return { err: 'Виникла проблема під час видалення' };
    }
};

const genereteTableData = (data) => {
    const newData = data[0].data;
    newData.map((item) => {
        data[1].data.map((elem) => {
            if (item.speciality_id === elem.speciality_id) {
                item.speciality_name = elem.speciality_name;
            }
        });
        data[2].data.map((elem) => {
            if (item.faculty_id === elem.faculty_id) {
                item.faculty_name = elem.faculty_name;
            }
        });
    });
    return newData;
};

const getSpecName = (param, specialityData) => {
    const currentSpec = specialityData.filter((item) => item.speciality_id === param);
    return currentSpec[0].speciality_name;
};
const getFacName = (param, facultyData) => {
    const currentSpec = facultyData.filter((item) => item.faculty_id === param);
    return currentSpec[0].faculty_name;
};
const getSpecId = (param, specialityData) => {
    const currentSpec = specialityData.filter((item) => item.speciality_name === param);
    return currentSpec[0].speciality_id;
};
const getFacId = (param, facultyData) => {
    const currentSpec = facultyData.filter((item) => item.faculty_name === param);
    return currentSpec[0].faculty_id;
};
