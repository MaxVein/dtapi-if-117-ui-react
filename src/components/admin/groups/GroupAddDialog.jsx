import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik } from 'formik';
import { addEntity, updateEntity } from '../../../common/utils';

import * as Yup from 'yup';

const GroupAddDialog = ({ open, setOpen, group }) => {
    const initialValues = {
        group_name: group ? group.group_name : '',
        faculty_name: group ? group.faculty_name : '',
        speciality_name: group ? group.faculty_name : '',
    };

    const validationSchema = Yup.object({
        group_name: Yup.string().required('Заповни поле'),
        faculty_name: Yup.string().required('Заповни поле'),
        speciality_name: Yup.string().required('Заповни поле'),
    });
    const handleClose = () => {};
    const updateGroup = (data) => {
        updateEntity('group', group.group_id, {
            group_name: data.group_name,
            faculty_name: data.faculty_name,
            speciality_name: data.speciality_name,
        }).then((res) => {});
    };
    const addGroup = (data) => {
        addEntity('Speciality', {
            group_name: data.group_name,
            faculty_name: data.faculty_name,
            speciality_name: data.speciality_name,
        })
            .then((res) => {})
            .catch((e) => {});
    };
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {group ? 'Редагувати групу' : 'Додати групу'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnMount={true}
                    onSubmit={(data) => {
                        group ? updateGroup(data) : addGroup(data);
                    }}
                >
                    {({
                        isValid,
                        errors,
                        touched,
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                helperText={touched.name ? errors.name : ''}
                                error={touched.name && Boolean(errors.name)}
                            />

                            <TextField
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                margin="dense"
                                id="code"
                                label="Code"
                                type="text"
                                fullWidth
                                helperText={touched.code ? errors.code : ''}
                                error={touched.code && Boolean(errors.code)}
                            />
                            <div style={{ margin: '1rem', textAlign: 'center' }}>
                                <Button onClick={handleClose} color="primary">
                                    Відмінити
                                </Button>
                                <Button disabled={!isValid} type="submit" color="primary">
                                    {group ? 'Редагувати' : 'Додати'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default GroupAddDialog;
