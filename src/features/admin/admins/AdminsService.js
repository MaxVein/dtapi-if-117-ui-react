import axios from 'axios';
import { environment } from '../../../environments/environment';
export const source = axios.CancelToken.source();

export function createData(id, username, email) {
    return { id, username, email };
}

export function createDataSource(admins) {
    const rows = [];
    for (let item of admins) {
        rows.push(createData(item.id, item.username, item.email));
    }
    return rows;
}

export async function getAdmins() {
    const Admins = await axios
        .get(`${environment.BASEURL}AdminUser/getRecords`)
        .then((res) => res.data);
    return Admins;
}

export async function addAdmin(body) {
    return await axios.post(`${environment.BASEURL}AdminUser/insertData`, body);
}

export async function deleteAdmin(id) {
    return await axios.delete(`${environment.BASEURL}AdminUser/del/${id}`).then((res) => res.data);
}

export async function updateAdmin(body, id) {
    return await axios
        .post(`${environment.BASEURL}AdminUser/update/${id}`, body)
        .then((res) => res.data);
}

export async function checkAdminName(username) {
    return await axios
        .get(`${environment.BASEURL}AdminUser/checkUserName/${username}`)
        .then((res) => res.data);
}

export function addModeSubmit(data, setSnack, setDataSource, t, closeModal) {
    checkAdminName(data.username)
        .then((res) => {
            if (res.response) {
                setSnack({
                    open: true,
                    message: t('admins.messages.nameFailed'),
                    type: 'warning',
                });
                return null;
            }
            addAdmin(data)
                .then((res) => {
                    setDataSource((prevVal) => prevVal.concat(res.data));
                    setSnack({
                        open: true,
                        message: t('admins.messages.addSuccess'),
                        type: 'success',
                    });
                    closeModal();
                })
                .catch((err) =>
                    setSnack({
                        open: true,
                        message: `${t('admins.messages.serverFailed')}${err}`,
                        type: 'error',
                    }),
                );
        })
        .catch(() =>
            setSnack({
                open: true,
                message: t('admins.messages.nameServerFailed'),
                type: 'error',
            }),
        );
}

export function updateModeSubmit(data, setSnack, setDataSource, t, closeModal) {
    if (
        data.values.username === data.intialFormValues.username &&
        data.values.email === data.intialFormValues.email &&
        data.values.password === data.intialFormValues.password
    ) {
        setSnack({
            open: true,
            message: t('admins.messages.changeNeeded'),
            type: 'info',
        });
    } else {
        checkAdminName(data.values.username)
            .then((res) => {
                if (res.response) {
                    setSnack({
                        open: true,
                        message: t('admins.messages.nameFailed'),
                        type: 'error',
                    });
                } else {
                    updateAdmin(data.values, data.id)
                        .then((res) => {
                            if (res.response === 'ok') {
                                setDataSource((prevVal) =>
                                    prevVal.map((item) =>
                                        item.id === data.id
                                            ? (item = { id: data.id, ...data.values })
                                            : item,
                                    ),
                                );
                                closeModal();
                                setSnack({
                                    open: true,
                                    message: t('admins.messages.updateSuccess'),
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
            })
            .catch(() =>
                setSnack({
                    open: true,
                    message: t('admins.messages.nameServerFailed'),
                    type: 'error',
                }),
            );
    }
}

export function deleteModeSubmit(id, setSnack, setDataSource, t, closeModal) {
    deleteAdmin(id)
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
