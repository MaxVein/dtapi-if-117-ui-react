import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { objectsAreSame, compareTimetables } from '../../subjects/apiService';
import classes from './formDialog.module.css';

export default function FormDialog({
    groups,
    editEntity,
    openForm,
    setOpenForm,
    subject_id,
    subjects,
    setEditEntity,
    setCreateEntity,
    setSnack,
}) {
    let dialogTitle = editEntity.edit ? 'Редагувати розклад предмету' : 'Додати розклад предмету';
    let submitBtnTitle = editEntity.edit ? 'Редагувати' : 'Створити';
    const handleClose = () => {
        formik.resetForm();
        setOpenForm(false);
    };
    const validationSchema = yup.object({
        group_id: yup.string().required("Це поле обов'язкове"),
        subject_id: yup.string().required("Це поле обов'язкове"),
        start_date: yup.date(),
        end_date: yup
            .date()
            .min(yup.ref('start_date'), 'Кінцева дата не може бути меншою від початкової'),
    });
    const formik = useFormik({
        initialValues: {
            timetable_id: editEntity.edit ? editEntity.data.timetable_id : '',
            group_id: editEntity.edit ? editEntity.data.group_id : '1',
            subject_id: subject_id,
            group_name: editEntity.edit ? editEntity.data.group_name : '',
            start_date: editEntity.edit
                ? new Date(`${editEntity.data.start_date} ${editEntity.data.start_time}`)
                : new Date(),
            start_time: editEntity.edit
                ? new Date(`${editEntity.data.start_date} ${editEntity.data.start_time}`)
                : new Date(),
            end_date: editEntity.edit
                ? new Date(`${editEntity.data.end_date} ${editEntity.data.end_time}`)
                : new Date(),
            end_time: editEntity.edit
                ? new Date(`${editEntity.data.end_date} ${editEntity.data.end_time}`)
                : new Date(),
        },
        validationSchema: validationSchema,

        onSubmit: (values) => {
            if (editEntity.edit) {
                if (compareTimetables(editEntity.data, values)) {
                    setSnack({ open: true, type: 'warning', message: 'Внесіть зміни у форму' });
                } else {
                    setEditEntity({
                        edit: true,
                        data: values,
                        equal: false,
                        id: values.timetable_id,
                    });
                    setOpenForm(false);
                }
            } else {
                setCreateEntity({ create: true, data: values });
                setOpenForm(false);
            }
        },
    });
    return (
        <div>
            <Dialog open={openForm} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle className="form-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="form-dialog-container">
                        <TextField
                            id="group_id"
                            name="group_id"
                            label="Група"
                            value={formik.values.group_id}
                            variant="outlined"
                            select
                            onChange={formik.handleChange}
                            error={formik.touched.group_id && Boolean(formik.errors.group_id)}
                            helperText={formik.touched.group_id && formik.errors.group_id}
                        >
                            {groups.map((elem) => {
                                return (
                                    <MenuItem
                                        id={elem.group_id}
                                        key={elem.group_id}
                                        value={elem.group_id}
                                    >
                                        {elem.group_name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                        <TextField
                            id="subject_id"
                            name="subject_id"
                            label="Предмет"
                            value={formik.values.subject_id}
                            variant="outlined"
                            select
                            onChange={formik.handleChange}
                            error={formik.touched.subject_id && Boolean(formik.errors.subject_id)}
                            helperText={formik.touched.subject_id && formik.errors.subject_id}
                        >
                            {subjects.map((elem) => {
                                return (
                                    <MenuItem
                                        id={elem.subject_id}
                                        key={elem.subject_id}
                                        value={elem.subject_id}
                                    >
                                        {elem.subject_name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disablePast
                                variant="outline"
                                format="yyyy/MM/dd"
                                margin="normal"
                                id="start_date"
                                label="Дата початку"
                                value={formik.values.start_date}
                                onChange={(value) => {
                                    formik.setFieldValue('start_date', value);
                                }}
                                error={
                                    formik.touched.start_date && Boolean(formik.errors.start_date)
                                }
                                helperText={formik.touched.start_date && formik.errors.start_date}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />

                            <KeyboardTimePicker
                                clearable
                                ampm={false}
                                margin="normal"
                                id="start_time"
                                label="Час початку"
                                value={formik.values.start_time}
                                onChange={(value) => {
                                    formik.setFieldValue('start_time', value);
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />

                            <KeyboardDatePicker
                                disablePast
                                variant="outline"
                                format="yyyy/MM/dd"
                                margin="normal"
                                id="end_date"
                                label="Дата закінчення"
                                value={formik.values.end_date}
                                onChange={(value) => formik.setFieldValue('end_date', value)}
                                error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                                helperText={formik.touched.end_date && formik.errors.end_date}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                clearable
                                ampm={false}
                                margin="normal"
                                id="end_time"
                                label="Час закінчення"
                                value={formik.values.end_time}
                                onChange={(value) => formik.setFieldValue('end_time', value)}
                                error={formik.touched.end_time && Boolean(formik.errors.end_time)}
                                helperText={formik.touched.end_time && formik.errors.end_time}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <div className="form-dialog-btn-group">
                            <Button color="primary" variant="contained" type="submit">
                                {submitBtnTitle}
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => handleClose()}
                            >
                                Скасувати
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
