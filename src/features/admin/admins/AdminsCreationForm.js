import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import styles from './Admins.module.css';
import { addAdmin, checkAdminName, updateAdmin } from './AdminsService';
import AdminsContext from './AdminsContext';
import { UseLanguage } from '../../../lang/LanguagesContext';

const useStyles = makeStyles({
    DialogContent: {
        '&:first-child': {
            paddingTop: '0',
        },
    },
    DialogActions: {
        padding: '1rem',
    },
});

const addValidationSchema = Yup.object().shape({
    username: Yup.string()
        .min(5, "Надто коротке ім'я!")
        .max(50, "Надто довге ім'я!")
        .required("Обов'язкове поле"),
    email: Yup.string().email('Невалідний email').required("Обов'язкове поле"),
    password: Yup.string()
        .required("Обов'язкове поле")
        .min(8, 'Надто короткий пароль - повинно бути мінмімум 8 символів.')
        .matches(
            '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})',
            'Повинно бути як мінмум 1 цифра та тільки латинські літери.',
        ),
    password_confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Паролі повинні співпадати.')
        .required('Потрібно підтвердити пароль'),
});
const editValidationSchema = Yup.object().shape({
    username: Yup.string().min(5, "Надто коротке ім'я!").max(50, "Надто довге ім'я!"),
    email: Yup.string().email('Невалідний email'),
    password: Yup.string()
        .min(8, 'Надто короткий пароль - повинно бути мінмімум 8 символів.')
        .matches(
            '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})',
            'Пароль повинен містити як мінмум 1 цифру та тільки латинські літери.',
        ),
    password_confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Паролі повинні співпадати.'),
});

function AdminCreationForm({ open, setOpen, mode, admin }) {
    const { t } = UseLanguage();
    const { dataSource, setDataSource, setSnack } = useContext(AdminsContext);

    const classes = useStyles();
    const closeModal = () => {
        setOpen(false);
    };

    const intialFormValues = {
        username: mode === 'Add' ? '' : admin.username,
        email: mode === 'Add' ? '' : admin.email,
        password: '',
        password_confirm: '',
    };

    function AddModeSubmit(values) {
        checkAdminName(values.username)
            .then((res) => {
                if (res.response) {
                    setSnack({
                        open: true,
                        message: "Дане ім'я вже ісує",
                        type: 'warning',
                    });
                    return null;
                }
                addAdmin(values)
                    .then((res) => {
                        setDataSource(dataSource.concat(res.data));
                        setSnack({
                            open: true,
                            message: 'Адміна успішно додано',
                            type: 'success',
                        });
                        closeModal();
                    })
                    .catch((err) =>
                        setSnack({
                            open: true,
                            message: `На сервері відбулась помилка - ${err}`,
                            type: 'error',
                        }),
                    );
            })
            .catch((err) =>
                setSnack({
                    open: true,
                    message: `На сервері відбулась помилка, можливо ви ввели ім'я яке вже існує, будь ласка введіть нове ім'я`,
                    type: 'error',
                }),
            );
    }
    function UpdateModeSubmit(values) {
        checkAdminName(values.username)
            .then((res) => {
                if (
                    values.username === intialFormValues.username &&
                    values.email === intialFormValues.email &&
                    values.password === intialFormValues.password
                ) {
                    setSnack({
                        open: true,
                        message: 'Потрібно щось змінити',
                        type: 'info',
                    });
                } else if (res.response === true) {
                    setSnack({ open: true, message: "Дане ім'я вже існує", type: 'error' });
                } else {
                    updateAdmin(values, admin.id)
                        .then((res) => {
                            if (res.response === 'ok') {
                                setDataSource(
                                    dataSource.map((item) =>
                                        item.id === admin.id
                                            ? (item = { id: admin.id, ...values })
                                            : item,
                                    ),
                                );
                                setSnack({
                                    open: true,
                                    message: 'Адміна успішно оновлено',
                                    type: 'success',
                                });
                                closeModal();
                            }
                        })
                        .catch((err) =>
                            setSnack({
                                open: true,
                                message: `На сервері відбулась помилка - ${err}`,
                                type: 'error',
                            }),
                        );
                }
            })
            .catch((err) =>
                setSnack({
                    open: true,
                    message: `На сервері відбулась помилка - ${err}`,
                    type: 'error',
                }),
            );
    }

    const submit = (values) => {
        if (mode === 'Add') {
            AddModeSubmit(values);
        } else if (mode === 'Update') {
            UpdateModeSubmit(values);
        }
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={closeModal} aria-labelledby="simple-dialog-title">
                <DialogTitle className={styles.entityTitle}>
                    {mode === 'Add' ? t('admins.modal.addTitle') : t('admins.modal.updateTitle')}{' '}
                </DialogTitle>
                <Formik
                    initialValues={intialFormValues}
                    validationSchema={mode === 'Add' ? addValidationSchema : editValidationSchema}
                    onSubmit={(values) => submit(values)}
                >
                    {({
                        isValid,
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <DialogContent className={classes.DialogContent}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="username"
                                    label={t('admins.modal.name')}
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    helperText={touched.username ? errors.username : ''}
                                    error={touched.username && Boolean(errors.username)}
                                />
                                <TextField
                                    margin="dense"
                                    id="email"
                                    label={t('admins.modal.email')}
                                    type="email"
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    helperText={touched.email ? errors.email : ''}
                                    error={touched.email && Boolean(errors.email)}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="password"
                                    label={t('admins.modal.password')}
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    helperText={touched.password ? errors.password : ''}
                                    error={touched.password && Boolean(errors.password)}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="password"
                                    label={t('admins.modal.passwordConfirm')}
                                    name="password_confirm"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password_confirm}
                                    helperText={
                                        touched.password_confirm ? errors.password_confirm : ''
                                    }
                                    error={
                                        touched.password_confirm && Boolean(errors.password_confirm)
                                    }
                                />
                            </DialogContent>
                            <DialogActions className={classes.DialogActions}>
                                <Button onClick={closeModal}>
                                    {t('admins.modal.cancelButton')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    disableElevation
                                    variant="contained"
                                    color="primary"
                                >
                                    {mode === 'Add'
                                        ? t('admins.modal.submitAddButton')
                                        : t('admins.modal.submitUpdateButton')}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </React.Fragment>
    );
}

export default AdminCreationForm;
