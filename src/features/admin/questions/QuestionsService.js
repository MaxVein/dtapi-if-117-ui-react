import axios from 'axios';
import { environment } from '../../../environments/environment';
export const source = axios.CancelToken.source();
import { getAnswers } from '../answers/AnswersService';

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

export async function deleteAnswers(answers) {
    if (answers.length) {
        const newAnswers = answers.map((answer) =>
            axios.delete(`${environment.BASEURL}Answer/del/${answer.answer_id}`),
        );
        return axios.all(newAnswers).then((res) => res);
    }
}

export async function deleteQuestion(id) {
    return await axios.delete(`${environment.BASEURL}Question/del/${id}`).then((res) => res.data);
}

export async function updateQuestion(body, id) {
    return await axios
        .post(`${environment.BASEURL}AdminUser/update/${id}`, body)
        .then((res) => res.data);
}

export function deleteModeSubmit(id, setSnack, setDataSource, t, closeModal) {
    getAnswers(id).then((res) => {
        deleteAnswers(res).then((res) => console.log(res));
    });
    // deleteAnswers(id).then((res) => {
    //     console.log(res);
    //     if (res.response === 'ok') {
    //         setDataSource((prevVal) =>
    //             prevVal.filter((tableQuestion) => tableQuestion.question_id !== id),
    //         );
    //         closeModal();
    //         setSnack({
    //             open: true,
    //             message: t('admins.messages.deleteSuccess'),
    //             type: 'success',
    //         });
    //     }
    // });
    //     .catch((err) =>
    //         setSnack({
    //             open: true,
    //             message: `${t('admins.messages.serverFailed')}${err}`,
    //             type: 'error',
    //         }),
    //     );
}
// Answers(deleted.id).then((res) => {
//     if (res.length) {
//         deleteAnswers(res).then((res) => {
//             if (res[0].status === 200) {
//                 deleteQuestion(deleted.id)
//         }}
// }
