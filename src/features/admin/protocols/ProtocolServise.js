import axios from 'axios';
import { getEntityData, entityManager } from '../../../common/utils';

export const getProtocolData = async () => {
    const source = axios.CancelToken.source();
    try {
        const requests = [getEntityData('log', source), getEntityData('test', source)];
        const response = await Promise.all(requests);
        let tests = [];
        response[1].data.forEach((item) =>
            tests.push({
                test_name: item.test_name,
                test_id: item.test_id,
            }),
        );
        const newData = genereteTableData(response);
        source.cancel();
        return [newData, tests];
    } catch (err) {
        return { err: 'Виникла проблема під час завантаження' };
    }
};

export const filterProtocolsData = async (studentsIds, data) => {
    try {
        const studResponse = await entityManager('Student', studentsIds);
        const newDataWithStud = [];
        studResponse.data.forEach((student) => {
            data.forEach((protocol) => {
                if (protocol.user_id === student.user_id)
                    newDataWithStud.push({
                        ...protocol,
                        student_name: `${student.student_surname} ${student.student_name} ${student.student_fname}`,
                    });
            });
        });
        return newDataWithStud;
    } catch (err) {
        return { err: 'Виникла проблема під час фільтрування' };
    }
};

const genereteTableData = (data) => {
    const newData = data[0].data;
    newData.map((item) => {
        data[1].data.map((elem) => {
            if (item.test_id === elem.test_id) {
                item.test_name = elem.test_name;
            }
        });
    });
    return newData;
};
