import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { v4 as uuidv4 } from 'uuid';
import { Formik } from 'formik';

import * as Yup from 'yup';

const GroupAddDialog = ({
    open,
    setOpen,
    group,
    specialityData,
    facultyData,
    setEdit,
    setEditGroup,
    setAddGroup,
}) => {
    const initialValues = {
        group_name: group ? group.group_name : '',
        faculty_name: group ? group.faculty_name : '',
        speciality_name: group ? group.speciality_name : '',
    };

    const validationSchema = Yup.object({
        group_name: Yup.string()
            .required('Заповни поле')
            .matches(
                '[А-Я\u0406]{1,4}[мз]?-[0-9]{2}-[0-9]{1}[к]?',
                'Будь ласка введіть правильну назву групи',
            ),
        faculty_name: Yup.string().required('Заповни поле'),
        speciality_name: Yup.string().required('Заповни поле'),
    });
    const handleClose = () => {
        group ? setEdit(false) : setOpen(false);
    };
    const compareObj = (x, y) => {
        let isEqual = true;
        for (const prop in x) {
            if (x[prop] !== y[prop]) {
                isEqual = false;
                break;
            }
        }
        return isEqual;
    };
    return (
        <div>
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
                            if (group) {
                                if (
                                    compareObj(
                                        {
                                            group_name: group.group_name,
                                            faculty_name: group.faculty_name,
                                            speciality_name: group.speciality_name,
                                        },
                                        data,
                                    )
                                ) {
                                    setEditGroup({
                                        edit: true,
                                        data: data,
                                        isChanged: false,
                                        editId: group.group_id,
                                    });
                                } else {
                                    setEditGroup({
                                        edit: true,
                                        data: data,
                                        isChanged: true,
                                        editId: group.group_id,
                                    });
                                }
                            } else {
                                setAddGroup({
                                    add: true,
                                    data: data,
                                });
                            }
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
                                    name="group_name"
                                    value={values.group_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoFocus
                                    margin="dense"
                                    id="group_name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    error={touched.group_name && Boolean(errors.group_name)}
                                />
                                <Select
                                    name="faculty_name"
                                    className="select"
                                    value={values.faculty_name}
                                    displayEmpty
                                    key={uuidv4()}
                                    fullWidth
                                    margin="dense"
                                    id="faculties"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.faculty_name && Boolean(errors.faculty_name)}
                                >
                                    <MenuItem value="" disabled>
                                        Виберіть факультет
                                    </MenuItem>
                                    {facultyData.map((item) => (
                                        <MenuItem key={uuidv4()} value={`${item.faculty_name}`}>
                                            {item.faculty_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    name="speciality_name"
                                    className="select"
                                    value={values.speciality_name}
                                    displayEmpty
                                    key={uuidv4()}
                                    fullWidth
                                    margin="dense"
                                    id="specialities"
                                    label="specialities"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.faculty_name && Boolean(errors.faculty_name)}
                                >
                                    <MenuItem value="" disabled>
                                        Виберіть спеціальність
                                    </MenuItem>
                                    {specialityData.map((item) => (
                                        <MenuItem key={uuidv4()} value={`${item.speciality_name}`}>
                                            {item.speciality_name}
                                        </MenuItem>
                                    ))}
                                </Select>
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
        </div>
    );
};

export default GroupAddDialog;
