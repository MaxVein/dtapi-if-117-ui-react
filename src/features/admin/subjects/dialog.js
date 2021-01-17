import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UseLanguage } from '../../../lang/LanguagesContext';

export default function FormDialog({
    editSubject,
    openForm,
    setSubject,
    setOpenForm,
    setEditSubject,
}) {
    const { t } = UseLanguage();

    let dialogTitle = editSubject.edit
        ? t('subjects.modal.updateTitle')
        : t('subjects.modal.addTitle');
    let submitBtnTitle = editSubject.edit
        ? t('subjects.modal.submitUpdateButton')
        : t('subjects.modal.submitAddButton');
    const handleClose = () => {
        formik.resetForm();
        setOpenForm(false);
    };
    const validationSchema = yup.object({
        subject_name: yup.string('Введіть назву предмета').required("Це поле обов'язкове"),
        subject_description: yup
            .string('Введіть опис предмета')
            .min(4, 'Мінімальна довжина опису 4 символи')
            .required("Це поле обов'язкове"),
    });
    const formik = useFormik({
        initialValues: {
            subject_id: editSubject.edit ? editSubject.data.subject_id : '',
            subject_name: editSubject.edit ? editSubject.data.subject_name : '',
            subject_description: editSubject.edit ? editSubject.data.subject_description : '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (editSubject.edit) {
                if (objectsAreSame(editSubject.data, values)) {
                    return setEditSubject({
                        edit: true,
                        data: values,
                        equal: true,
                        first: false,
                    });
                }
                setEditSubject({ edit: true, data: values, equal: false });
            } else {
                delete values.subject_id;
                setSubject({ create: true, data: values });
            }
        },
    });
    const objectsAreSame = (x, y) => {
        let objectsAreSame = true;
        for (const propertyName in x) {
            if (x[propertyName] !== y[propertyName]) {
                objectsAreSame = false;
                break;
            }
        }
        return objectsAreSame;
    };

    return (
        <div>
            <Dialog open={openForm} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit} className="form-dialog-container">
                        <TextField
                            id="subject_name"
                            name="subject_name"
                            label={t('subjects.modal.name')}
                            value={formik.values.subject_name}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.subject_name && Boolean(formik.errors.subject_name)
                            }
                            helperText={formik.touched.subject_name && formik.errors.subject_name}
                        />
                        <TextField
                            id="subject_description"
                            name="subject_description"
                            label={t('subjects.modal.description')}
                            multiline
                            rows="5"
                            value={formik.values.subject_description}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.subject_description &&
                                Boolean(formik.errors.subject_description)
                            }
                            helperText={
                                formik.touched.subject_description &&
                                formik.errors.subject_description
                            }
                        />
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
                                {t('subjects.modal.cancelButton')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
