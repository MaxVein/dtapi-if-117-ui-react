import React, { useRef, useState } from 'react';
import { StudentsServiceAPI } from '../../services/StudentsService';
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

const CreateUpdateForm = ({
    isUpdate,
    setOpen,
    updateData,
    setSnackBar,
    setStudentData,
    setSubmit,
}) => {
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
        lastname: Yup.string().required('Поле не заповнене! Будь-ласка введіть прізвище студента'),
        firstname: Yup.string().required("Поле не заповнене! Будь-ласка введіть ім'я студента"),
        fathername: Yup.string().required(
            "Поле не заповнене! Будь-ласка введіть ім'я по-батькові студента",
        ),
        gradebookID: Yup.string().required(
            'Поле не заповнене! Будь-ласка введіть номер залікової книжки студента',
        ),
        username: Yup.string()
            .matches(
                /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                "Ім'я користувача повинно складатись з QWERTY літер, цифер та поширених розділових знаків, окрім знаку - .",
            )
            .required("Поле не заповнене! Будь-ласка введіть системне ім'я користувача студента")
            .min(6, "Мінімальна довжина ім'я користувача 6 символів")
            .max(12, "Довжина ім'я користувача не повинна бути більша ніж 12 символів"),
        email: Yup.string()
            .matches(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Некоректні дані! Будь-ласка введіть існуючу електронну пошту',
            )
            .required('Поле не заповнене! Будь-ласка введіть електронну пошту студента')
            .email('Некоректні дані! Будь-ласка введіть коректну електронну пошту'),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                'Пароль має містити лише QWERTY літери (великі та малі), цифри та поширені розділові знаки',
            )
            .required('Поле не заповнене! Будь-ласка введіть унікальний пароль студента')
            .min(8, 'Мінімальна довжина паролю 8 символів'),
        password_confirm: Yup.string()
            .required(
                'Поле не заповнене! Будь-ласка введіть повторно пароль студента, який був введений у попередньому полі',
            )
            .test(
                'password-match',
                'Паролі не збігаються. Пароль у попередньому полі повинен співпадати з паролем даного поля',
                function (value) {
                    return form.values.password === value;
                },
            ),
    });

    const form = useFormik({
        initialValues,
        validationSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            submit(values);
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
        errorHandler(message);
    };

    const uniqueValidator = (value, entity, method, check) => {
        if (isUpdate && updateData && updateData[check] === value) {
            return updateData[check] === value;
        } else {
            return StudentsServiceAPI.check(entity, method, value);
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
                'Користувач з таким номером залікової книжки вже існує',
                'Некоректні дані номеру залікової книжки! Операцію скасовано!',
            );
            return;
        }

        if (!username) {
            notValid(
                'username',
                'Користувач з таким системним ім`я вже існує',
                'Некоректні дані системного імені користувача! Операцію скасовано!',
            );
            return;
        }

        if (!email) {
            notValid(
                'email',
                'Користувач з такою електронною адресою вже існує',
                'Некоректні дані електронної пошти користувача! Операцію скасовано!',
            );
            return;
        }

        if (!isUpdate && !(form.isValid && form.dirty)) {
            errorHandler();
            return;
        }

        if (isUpdate && !form.isValid && !form.dirty) {
            errorHandler();
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
        };

        if (image === '' && isUpdate) {
            formData.photo = updateData.photo;
        }

        setStudentData((prevState) => ({
            ...prevState,
            ...formData,
        }));
        setSubmit(true);
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
                setSnackBar({
                    open: true,
                    message: 'Фото завантажено',
                });
            };
        }
    };

    const errorHandler = (
        message = 'Заповнена форма не відповідає вимогам! Будь ласка введіть коректні дані',
    ) => {
        setSnackBar({
            open: true,
            message,
        });
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
                        label="Прізвище"
                        type="text"
                        id="lastname"
                        placeholder="Шевченко"
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
                        label="Ім'я"
                        type="text"
                        id="firstname"
                        placeholder="Андрій/Катерина"
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
                        label="По-батькові"
                        type="text"
                        id="fathername"
                        placeholder="Миколайович/Миколаївна"
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
                        label="Номер залікової
                        книжки"
                        type="text"
                        placeholder="07-AS-IP"
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
                        label="Системне ім'я
                        користувача"
                        type="text"
                        id="username"
                        placeholder="andrew_sheva7"
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
                        label="Електронна пошта"
                        type="email"
                        id="email"
                        placeholder="Ex. pat@example.com"
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
                        label="Пароль"
                        type={showPassword.password ? 'text' : 'password'}
                        id="password"
                        placeholder="Пароль має містити лише літери, цифри та поширені розділові знаки"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            showPassword.password
                                                ? 'Сховати пароль'
                                                : 'Показати пароль'
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
                        label="Підтвердіть
                        пароль"
                        type={showPassword.password_confirm ? 'text' : 'password'}
                        id="password_confirm"
                        placeholder="Введіть повторно пароль, який був введений у попередньому полі"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            showPassword.password_confirm
                                                ? 'Сховати пароль'
                                                : 'Показати пароль'
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
                                    ? 'Нажміть, щоб оновити фото'
                                    : 'Нажміть, щоб завантажити фото'
                            }
                        >
                            <Button
                                color="primary"
                                variant="outlined"
                                className={classes.FileInputBtn}
                                onClick={fileInput}
                                startIcon={<CloudUploadIcon />}
                            >
                                {isUpdate && updateData && image === '' ? 'Завантажити фото' : null}
                                {isUpdate && updateData && image !== '' ? 'Оновити фото' : null}
                                {!isUpdate && image === '' ? 'Завантажити фото' : null}
                                {!isUpdate && image !== '' ? 'Оновити фото' : null}
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
                            setSnackBar({ open: true, message: 'Скасовано' });
                        }}
                        type="reset"
                    >
                        Скасувати
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
                        {isUpdate ? 'Редагувати дані' : 'Додати студента'}
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
    setSnackBar: PropTypes.func,
    setStudentData: PropTypes.func,
    setSubmit: PropTypes.func,
};
