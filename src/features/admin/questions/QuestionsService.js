import axios from 'axios';
import { environment } from '../../../environments/environment';
export const source = axios.CancelToken.source();

export function createData(question_id, question_text, type, level) {
    return { question_id, question_text, type, level };
}

export function createDataSource(source) {
    const rows = [];
    if (source.length) {
        for (let item of source) {
            rows.push(createData(item.question_id, item.question_text, item.type, item.level));
        }
    } else {
        return null;
    }

    return rows;
}

export async function getNumberOfQuestions(id) {
    const QuestionsNumber = await axios
        .get(`${environment.BASEURL}Question/countRecordsByTest/${id}`)
        .then((res) => res.data);
    return QuestionsNumber;
}

export async function getQuestions(id, quantity) {
    return await axios
        .get(`${environment.BASEURL}Question/getRecordsRangeByTest/${id}/${quantity}/0/wi`)
        .then((res) => res.data);
}

export async function deleteQuestionWithAnswers(id) {
    return await axios.delete(`${environment.BASEURL}AdminUser/del/${id}`).then((res) => res.data);
}

export async function updateQuestion(body, id) {
    return await axios
        .post(`${environment.BASEURL}AdminUser/update/${id}`, body)
        .then((res) => res.data);
}

export function deleteModeSubmit(id, setSnack, setDataSource, t, closeModal) {
    deleteQuestionWithAnswers(id)
        .then((res) => {
            if (res.response === 'ok') {
                setDataSource((prevVal) => prevVal.filter((tableAdmin) => tableAdmin.id !== id));
                closeModal();
                setSnack({
                    open: true,
                    message: t('admins.messages.deleteSuccess'),
                    type: 'success',
                });
            }
        })
        .catch((err) =>
            setSnack({
                open: true,
                message: `${t('admins.messages.serverFailed')}${err}`,
                type: 'error',
            }),
        );
}
