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

function AdminCreationForm({ open, setOpen, mode, admin }) {
    const { t } = UseLanguage();
    const { setAdded, setUpdated } = React.useContext(AdminsContext);
    const classes = useStyles();
    const intialFormValues = {
        username: mode === 'Add' ? '' : admin.username,
        email: mode === 'Add' ? '' : admin.email,
        password: '',
        password_confirm: '',
    };
    const addValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(5, t('validation.tooShortName'))
            .max(50, t('validation.tooLongName'))
            .required(t('validation.requiredField')),
        email: Yup.string()
            .email(t('validation.invalidEmail'))
            .required(t('validation.requiredField')),
        password: Yup.string()
            .required(t('validation.requiredField'))
            .min(8, t('validation.tooShortPassword'))
            .matches('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})', t('validation.passwordPattern')),
        password_confirm: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation.passwordMustMatch'))
            .required(t('validation.passwordNeedConfirmation')),
    });
    const editValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(5, t('validation.tooShortName'))
            .max(50, t('validation.tooLongName')),
        email: Yup.string().email(t('validation.invalidEmail')),
        password: Yup.string()
            .min(8, t('validation.tooShortPassword'))
            .matches('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})', t('validation.passwordPattern')),
        password_confirm: Yup.string().oneOf(
            [Yup.ref('password'), null],
            t('validation.passwordMustMatch'),
        ),
    });
    const closeModal = () => {
        setOpen(false);
    };

    const submit = (values) => {
        if (mode === 'Add') {
            setAdded({ status: true, data: { ...values } });
        } else if (mode === 'Update') {
            setUpdated({
                status: true,
                closeModal: () => closeModal(),
                data: {
                    id: admin.id,
                    values: { ...values },
                    intialFormValues: { ...intialFormValues },
                },
            });
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
