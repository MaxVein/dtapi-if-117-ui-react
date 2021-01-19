import axios from 'axios';
import { environment } from '../../../environments/environment';
export const source = axios.CancelToken.source();

export function createData(answer_id, answer_text) {
    return { answer_id, answer_text };
}

export function createDataSource(source) {
    const rows = [];
    if (source.length) {
        for (let item of source) {
            rows.push(createData(item.answer_id, item.answer_text));
        }
    } else {
        return null;
    }

    return rows;
}

export async function getAnswers(id) {
    return await axios
        .get(`${environment.BASEURL}Answer/getAnswersByQuestion/${id}/`)
        .then((res) => res.data);
}

export async function getQuestionById(id) {
    return await axios
        .get(`${environment.BASEURL}Question/getRecords/${id}`)
        .then((res) => res.data);
}

export async function deleteAnswer(id) {
    return await axios.delete(`${environment.BASEURL}Answer/del/${id}`).then((res) => res.data);
}

export async function addQuestion(body) {
    return await axios
        .post(`${environment.BASEURL}Question/insertData/`, body)
        .then((res) => res.data);
}

export async function updateQuestion(body, id) {
    return await axios
        .post(`${environment.BASEURL}question/update/${id}`, body)
        .then((res) => res.data);
}

export async function addAnswer(body) {
    return await axios
        .post(`${environment.BASEURL}answer/insertData/`, body)
        .then((res) => res.data);
}

export async function updateAnswer(body, id) {
    return await axios
        .post(`${environment.BASEURL}answer/update/${id}`, body)
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
