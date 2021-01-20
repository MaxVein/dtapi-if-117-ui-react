import React, { useRef, useState } from 'react';
import { UseLanguage } from '../../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../../services/StudentsService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import classes from './CreateUpdateForm.module.css';

import { Avatar, Button, FormControl, InputAdornment, TextField, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailIcon from '@material-ui/icons/Email';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const CreateUpdateForm = ({ isUpdate, setOpen, updateData, messageHandler, start }) => {
    const { t } = UseLanguage();
    const initialValues = {
        lastname: updateData && isUpdate ? updateData.student_surname : '',
        firstname: updateData && isUpdate ? updateData.student_name : '',
        fathername: updateData && isUpdate ? updateData.student_fname : '',
        gradebookID: updateData && isUpdate ? updateData.gradebook_id : '',
        username: updateData && isUpdate ? updateData.username : '',
        email: updateData && isUpdate ? updateData.email : '',
        password: updateData && isUpdate ? updateData.plain_password : '',
        password_confirm: updateData && isUpdate ? updateData.plain_password : '',
    };
    const validationSchema = Yup.object().shape({
        lastname: Yup.string().required(t('students.createUpdate.form.messages.lastnameRequired')),
        firstname: Yup.string().required(
            t('students.createUpdate.form.messages.firstnameRequired'),
        ),
        fathername: Yup.string().required(
            t('students.createUpdate.form.messages.fathernameRequired'),
        ),
        gradebookID: Yup.string().required(
            t('students.createUpdate.form.messages.gradebookIdRequired'),
        ),
        username: Yup.string()
            .matches(
                /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                t('students.createUpdate.form.messages.usernameMatches'),
            )
            .required(t('students.createUpdate.form.messages.usernameRequired'))
            .min(6, t('students.createUpdate.form.messages.usernameMin'))
            .max(12, t('students.createUpdate.form.messages.usernameMax')),
        email: Yup.string()
            .matches(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                t('students.createUpdate.form.messages.emailMatches'),
            )
            .required(t('students.createUpdate.form.messages.emailRequired'))
            .email(t('students.createUpdate.form.messages.emailIsEmail')),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                t('students.createUpdate.form.messages.passwordMatches'),
            )
            .required(t('students.createUpdate.form.messages.passwordRequired'))
            .min(8, t('students.createUpdate.form.messages.passwordMin')),
        password_confirm: Yup.string()
            .required(t('students.createUpdate.form.messages.passwordConfirmRequired'))
            .test(
                'password-match',
                t('students.createUpdate.form.messages.passwordConfirmTest'),
                function (value) {
                    return form.values.password === value;
                },
            ),
    });
    const form = useFormik({
        initialValues,
        validationSchema,
        validateOnMount: true,
        onSubmit: async (values) => {
            await submit(values);
        },
    });
    const [image, setImage] = useState(isUpdate && updateData ? updateData.photo : '');
    const [showPassword, setShowPassword] = useState({
        password: false,
        password_confirm: false,
    });
    const inputRef = useRef();

    const notValid = (field, value, message) => {
        form.setSubmitting(false);
        form.isValid = true;
        form.dirty = true;
        form.setFieldError(field, value);
        messageHandler(message, 'warning');
    };

    const uniqueValidator = (value, entity, method, check) => {
        if (isUpdate && updateData && updateData[check] === value) {
            return updateData[check] === value;
        } else {
            return StudentsServiceApi.check(entity, method, value);
        }
    };

    const submit = async (data) => {
        const gradebook_id = await uniqueValidator(
            data.gradebookID,
            'Student',
            'checkGradebookID',
            'gradebook_id',
        );

        const username = await uniqueValidator(
            data.username,
            'AdminUser',
            'checkUserName',
            'username',
        );

        const email = await uniqueValidator(data.email, 'AdminUser', 'checkEmailAddress', 'email');

        if (!gradebook_id) {
            notValid(
                'gradebookID',
                t('students.createUpdate.form.messages.gradebookIdNotValid'),
                t('students.createUpdate.messages.incorrectGradebookId'),
            );
            return;
        }

        if (!username) {
            notValid(
                'username',
                t('students.createUpdate.form.messages.usernameNotValid'),
                t('students.createUpdate.messages.incorrectUsername'),
            );
            return;
        }

        if (!email) {
            notValid(
                'email',
                t('students.createUpdate.form.messages.emailNotValid'),
                t('students.createUpdate.messages.incorrectEmail'),
            );
            return;
        }

        if (!isUpdate && !(form.isValid && form.dirty)) {
            messageHandler(t('students.createUpdate.messages.formNotValid'), 'warning');
            return;
        }

        if (isUpdate && !form.isValid && !form.dirty) {
            messageHandler(t('students.createUpdate.messages.formNotValid'), 'warning');
            return;
        }

        form.resetForm();

        const formData = {
            gradebook_id: data.gradebookID,
            student_surname: data.lastname,
            student_name: data.firstname,
            student_fname: data.fathername,
            group_id: updateData.group_id,
            photo: image,
            password: data.password,
            password_confirm: data.password_confirm,
            plain_password: data.password,
            email: data.email,
            username: data.username,
            user_id: updateData.user_id,
        };

        if (image === '' && isUpdate) {
            formData.photo = updateData.photo;
        }

        start(updateData.user_id, formData);
    };

    const fileInput = () => {
        inputRef.current.click();
    };

    const fileUpload = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result);
                messageHandler(t('students.createUpdate.messages.photoUpload'), 'success');
            };
        }
    };

    return (
        <div className={classes.DialogForm}>
            <form onSubmit={form.handleSubmit}>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.lastname}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.lastname')}
                        type="text"
                        id="lastname"
                        placeholder={t('students.createUpdate.form.placeholders.lastname')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.lastname && Boolean(form.errors.lastname)}
                        helperText={
                            form.touched.lastname && form.errors.lastname
                                ? form.errors.lastname
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.firstname}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.name')}
                        type="text"
                        id="firstname"
                        placeholder={t('students.createUpdate.form.placeholders.name')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.firstname && Boolean(form.errors.firstname)}
                        helperText={
                            form.touched.firstname && form.errors.firstname
                                ? form.errors.firstname
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.fathername}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.afterName')}
                        type="text"
                        id="fathername"
                        placeholder={t('students.createUpdate.form.placeholders.afterName')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.fathername && Boolean(form.errors.fathername)}
                        helperText={
                            form.touched.fathername && form.errors.fathername
                                ? form.errors.fathername
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.gradebookID}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.gradebook')}
                        type="text"
                        placeholder={t('students.createUpdate.form.placeholders.gradebook')}
                        id="gradebookID"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <LibraryBooksIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.gradebookID && Boolean(form.errors.gradebookID)}
                        helperText={
                            form.touched.gradebookID && form.errors.gradebookID
                                ? form.errors.gradebookID
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.username}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.login')}
                        type="text"
                        id="username"
                        placeholder={t('students.createUpdate.form.placeholders.login')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <PersonAddIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.username && Boolean(form.errors.username)}
                        helperText={
                            form.touched.username && form.errors.username
                                ? form.errors.username
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.email}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.email')}
                        type="email"
                        id="email"
                        placeholder={t('students.createUpdate.form.placeholders.email')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.email && Boolean(form.errors.email)}
                        helperText={
                            form.touched.email && form.errors.email ? form.errors.email : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.password}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.password')}
                        type={showPassword.password ? 'text' : 'password'}
                        id="password"
                        placeholder={t('students.createUpdate.form.placeholders.password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            showPassword.password
                                                ? t('students.createUpdate.tooltips.hidePassword')
                                                : t('students.createUpdate.tooltips.showPassword')
                                        }
                                    >
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword({
                                                    password: !showPassword.password,
                                                    password_confirm: false,
                                                })
                                            }
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {showPassword.password ? (
                                                <Visibility
                                                    color="primary"
                                                    className={classes.PasswordIcon}
                                                />
                                            ) : (
                                                <VisibilityOff
                                                    color="primary"
                                                    className={classes.PasswordIcon}
                                                />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        error={form.touched.password && Boolean(form.errors.password)}
                        helperText={
                            form.touched.password && form.errors.password
                                ? form.errors.password
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <TextField
                        onChange={form.handleChange}
                        value={form.values.password_confirm}
                        className={classes.TextField}
                        onBlur={form.handleBlur}
                        label={t('students.createUpdate.form.fields.passwordConfirm')}
                        type={showPassword.password_confirm ? 'text' : 'password'}
                        id="password_confirm"
                        placeholder={t('students.createUpdate.form.placeholders.passwordConfirm')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            showPassword.password_confirm
                                                ? t('students.createUpdate.tooltips.hidePassword')
                                                : t('students.createUpdate.tooltips.showPassword')
                                        }
                                    >
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword({
                                                    password: false,
                                                    password_confirm: !showPassword.password_confirm,
                                                })
                                            }
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {showPassword.password_confirm ? (
                                                <Visibility
                                                    color="primary"
                                                    className={classes.PasswordIcon}
                                                />
                                            ) : (
                                                <VisibilityOff
                                                    color="primary"
                                                    className={classes.PasswordIcon}
                                                />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        error={
                            form.touched.password_confirm && Boolean(form.errors.password_confirm)
                        }
                        helperText={
                            form.touched.password_confirm && form.errors.password_confirm
                                ? form.errors.password_confirm
                                : null
                        }
                    />
                </FormControl>
                <FormControl className={classes.FormControl}>
                    <div className={classes.ImageFormControl}>
                        <Avatar className={classes.Avatar} src={image} />
                    </div>
                    <div className={classes.FileInput}>
                        <Tooltip
                            title={
                                isUpdate
                                    ? t('students.createUpdate.tooltips.updatePhoto')
                                    : t('students.createUpdate.tooltips.uploadPhoto')
                            }
                        >
                            <Button
                                color="primary"
                                variant="outlined"
                                className={classes.FileInputBtn}
                                onClick={fileInput}
                                startIcon={<CloudUploadIcon />}
                            >
                                {isUpdate && updateData && image === ''
                                    ? t('students.createUpdate.form.fields.uploadPhoto')
                                    : null}
                                {isUpdate && updateData && image !== ''
                                    ? t('students.createUpdate.form.fields.updatePhoto')
                                    : null}
                                {!isUpdate && image === ''
                                    ? t('students.createUpdate.form.fields.uploadPhoto')
                                    : null}
                                {!isUpdate && image !== ''
                                    ? t('students.createUpdate.form.fields.updatePhoto')
                                    : null}
                            </Button>
                        </Tooltip>
                        <input
                            disabled={false}
                            type="file"
                            hidden
                            ref={inputRef}
                            onChange={fileUpload}
                        />
                    </div>
                </FormControl>
                <div className={classes.FormActions}>
                    <Button
                        className={classes.FormActionsBtn}
                        onClick={() => {
                            setOpen({ open: false });
                            messageHandler(t('students.createUpdate.messages.canceled'), 'warning');
                        }}
                        type="reset"
                    >
                        {t('students.createUpdate.buttons.cancel')}
                    </Button>
                    <Button
                        className={classes.FormActionsBtn}
                        type="submit"
                        disabled={
                            isUpdate
                                ? !form.isValid && !form.dirty
                                : !(form.isValid && form.dirty) || form.isSubmitting
                        }
                    >
                        {isUpdate
                            ? t('students.createUpdate.buttons.updateStudent')
                            : t('students.createUpdate.buttons.addStudent')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateUpdateForm;

CreateUpdateForm.propTypes = {
    isUpdate: PropTypes.bool,
    setOpen: PropTypes.func,
    updateData: PropTypes.object,
    messageHandler: PropTypes.func,
    start: PropTypes.func,
};
