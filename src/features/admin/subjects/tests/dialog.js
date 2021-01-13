import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { objectsAreSame } from '../apiService';

export default function FormDialog({
    editTest,
    openForm,
    setTest,
    setOpenForm,
    setEditTest,
    subject_id,
}) {
    let dialogTitle = editTest.edit ? 'Редагувати тест' : 'Додати тест';
    let submitBtnTitle = editTest.edit ? 'Редагувати' : 'Створити';
    const handleClose = () => {
        formik.resetForm();
        setOpenForm(false);
    };
    const validationSchema = yup.object({
        test_name: yup
            .string('Введіть назву тесту')
            .min(3, 'Мінімальна довжина 3 символи')
            .required("Це поле обов'язкове"),
        tasks: yup
            .number('Введіть кількість завдань тесту')
            .positive('Поле не може бути рівне або менше 0')
            .required("Це поле обов'язкове"),
        attempts: yup
            .number('Введіть кількість спроб тесту')
            .positive('Поле не може бути рівне або менше 0')
            .required("Це поле обов'язкове"),
        time_for_test: yup
            .number('Зазначте час проходження тесту')
            .positive('Поле не може бути рівне або менше 0')
            .required("Це поле обов'язкове"),
        enabled: yup.boolean().required("Це поле обов'язкове"),
    });
    const formik = useFormik({
        initialValues: {
            attempts: editTest.edit ? editTest.data.attempts : '',
            enabled: editTest.edit ? editTest.data.enabled : '',
            subject_id: subject_id,
            tasks: editTest.edit ? editTest.data.tasks : '',
            test_id: editTest.edit ? editTest.data.test_id : '',
            test_name: editTest.edit ? editTest.data.test_name : '',
            time_for_test: editTest.edit ? editTest.data.time_for_test : '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (editTest.edit) {
                if (objectsAreSame(editTest.data, values)) {
                    return setEditTest({
                        edit: true,
                        data: values,
                        equal: true,
                        first: false,
                    });
                }
                setEditTest({ edit: true, data: values, equal: false });
            } else {
                delete values.test_id;
                setTest({ create: true, data: values });
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
                            id="test_name"
                            name="test_name"
                            label="Назва тесту"
                            value={formik.values.test_name}
                            onChange={formik.handleChange}
                            error={formik.touched.test_name && Boolean(formik.errors.test_name)}
                            helperText={formik.touched.test_name && formik.errors.test_name}
                        />
                        <TextField
                            id="tasks"
                            name="tasks"
                            label="Кількість завдань тесту"
                            type="number"
                            value={formik.values.tasks}
                            onChange={formik.handleChange}
                            error={formik.touched.tasks && Boolean(formik.errors.tasks)}
                            helperText={formik.touched.tasks && formik.errors.tasks}
                        />
                        <TextField
                            id="time_for_test"
                            name="time_for_test"
                            label="Час на прохождення тесту (хв)"
                            type="number"
                            value={formik.values.time_for_test}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.time_for_test && Boolean(formik.errors.time_for_test)
                            }
                            helperText={formik.touched.time_for_test && formik.errors.time_for_test}
                        />
                        <TextField
                            id="attempts"
                            name="attempts"
                            label="Кількість спроб тесту"
                            type="number"
                            value={formik.values.attempts.toString()}
                            onChange={formik.handleChange}
                            error={formik.touched.attempts && Boolean(formik.errors.attempts)}
                            helperText={formik.touched.attempts && formik.errors.attempts}
                        />
                        <RadioGroup
                            className="form-radio-group"
                            id="enabled"
                            name="enabled"
                            value={formik.values.enabled}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="Доступний" />
                            <FormControlLabel value="0" control={<Radio />} label="Недоступний" />
                        </RadioGroup>{' '}
                        {formik.touched.enabled && Boolean(formik.errors.enabled) && (
                            <span className="form-error">
                                {formik.touched.enabled && formik.errors.enabled}
                            </span>
                        )}
                        <div className="form-dialog-btn-group">
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={
                                    Boolean(formik.errors.subject_description) ||
                                    Boolean(formik.errors.subject_name)
                                }
                            >
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
