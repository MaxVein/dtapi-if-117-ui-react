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
        .post(`${environment.BASEURL}Question/update/${id}`, body)
        .then((res) => res.data);
}

export function deleteModeSubmit(id, setSnack, setDataSource, t, closeModal) {
    getAnswers(id).then((res) => {
        deleteAnswers(res).then((res) => {
            if (Array.isArray(res)) {
                deleteQuestion(id)
                    .then((res) => {
                        if (res.response === 'ok') {
                            setDataSource((prevVal) =>
                                prevVal.filter((tableQuestion) => tableQuestion.question_id !== id),
                            );
                            closeModal();
                            setSnack({
                                open: true,
                                message: t('questions.messages.deleteSuccess'),
                                type: 'success',
                            });
                        }
                    })
                    .catch((err) => {
                        setSnack({
                            open: true,
                            message: t('questions.messages.serverFailed')`${err}`,
                            type: 'error',
                        });
                    });
            } else if (res === undefined) {
                deleteQuestion(id)
                    .then((res) => {
                        if (res.response === 'ok') {
                            setDataSource((prevVal) =>
                                prevVal.filter((tableQuestion) => tableQuestion.question_id !== id),
                            );
                            closeModal();
                            setSnack({
                                open: true,
                                message: t('questions.messages.deleteSuccess'),
                                type: 'success',
                            });
                        }
                    })
                    .catch((err) => {
                        setSnack({
                            open: true,
                            message: t('questions.messages.serverFailed')`${err}`,
                            type: 'error',
                        });
                    });
            }
        });
    });
}

export function updateModeSubmit(data, setSnack, setDataSource, t, closeModal) {
    if (
        data.values.question_text === data.intialFormValues.question_text &&
        data.values.level === data.intialFormValues.level
    ) {
        setSnack({
            open: true,
            message: t('questions.messages.changeNeeded'),
            type: 'info',
        });
    } else {
        updateQuestion(data.values, data.id)
            .then((res) => {
                if (Array.isArray(res)) {
                    setDataSource((prevVal) =>
                        prevVal.map((item) =>
                            item.question_id === data.id
                                ? (item = { question_id: data.id, type: item.type, ...data.values })
                                : item,
                        ),
                    );
                    closeModal();
                    setSnack({
                        open: true,
                        message: t('questions.messages.updateSuccess'),
                        type: 'success',
                    });
                }
            })
            .catch((err) =>
                setSnack({
                    open: true,
                    message: `${t('questions.messages.serverFailed')}${err}`,
                    type: 'error',
                }),
            );
    }
}
// export function updateModeSubmit(data, setSnack, setDataSource, t, closeModal) {
//      else {
//         checkAdminName(data.values.username)
//             .then((res) => {
//                 if (res.response) {
//                     setSnack({
//                         open: true,
//                         message: t('admins.messages.nameFailed'),
//                         type: 'error',
//                     });
//                 } else {
//                     updateAdmin(data.values, data.id)
//                         .then((res) => {
//                             if (res.response === 'ok') {
//                                 setDataSource((prevVal) =>
//                                     prevVal.map((item) =>
//                                         item.id === data.id
//                                             ? (item = { id: data.id, ...data.values })
//                                             : item,
//                                     ),
//                                 );
//                                 closeModal();
//                                 setSnack({
//                                     open: true,
//                                     message: t('admins.messages.updateSuccess'),
//                                     type: 'success',
//                                 });
//                             }
//                         })
//                         .catch((err) =>
//                             setSnack({
//                                 open: true,
//                                 message: `${t('admins.messages.serverFailed')}${err}`,
//                                 type: 'error',
//                             }),
//                         );
//                 }
//             })
//             .catch(() =>
//                 setSnack({
//                     open: true,
//                     message: t('admins.messages.nameServerFailed'),
//                     type: 'error',
//                 }),
//             );
//     }
// }
