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

import { addEntity, updateEntity } from '../../../common/utils';

import * as Yup from 'yup';

const GroupAddDialog = ({
    open,
    setOpen,
    group,
    specialityData,
    facultyData,
    setGroupsData,
    setEdit,
    groupsData,
}) => {
    const initialValues = {
        group_name: group ? group.group_name : '',
        faculty_name: group ? group.faculty_name : '',
        speciality_name: group ? group.speciality_name : '',
    };

    const validationSchema = Yup.object({
        group_name: Yup.string().required('Заповни поле'),
        faculty_name: Yup.string().required('Заповни поле'),
        speciality_name: Yup.string().required('Заповни поле'),
    });
    const handleClose = () => {
        group ? setEdit(false) : setOpen(false);
    };
    const updateGroup = (data) => {
        console.log(data);
        updateEntity('group', group.group_id, {
            group_name: data.group_name,
            faculty_id: getFacId(data.faculty_name),
            speciality_id: getSpecId(data.speciality_name),
        }).then((res) => {
            res.data[0] = {
                ...res.data[0],
                speciality_name: getSpecName(res.data[0].speciality_id),
                faculty_name: getFacName(res.data[0].faculty_id),
            };
            const updatedList = groupsData.map((item) =>
                res.data[0].group_id === item.group_id ? res.data[0] : item,
            );
            setGroupsData(updatedList);
            setEdit(false);
        });
    };
    const getSpecName = (param) => {
        const currentSpec = specialityData.filter((item) => item.speciality_id === param);
        return currentSpec[0].speciality_name;
    };
    const getFacName = (param) => {
        const currentSpec = facultyData.filter((item) => item.faculty_id === param);
        return currentSpec[0].faculty_name;
    };
    const getSpecId = (param) => {
        const currentSpec = specialityData.filter((item) => item.speciality_name === param);
        return currentSpec[0].speciality_id;
    };
    const getFacId = (param) => {
        const currentSpec = facultyData.filter((item) => item.faculty_name === param);
        return currentSpec[0].faculty_id;
    };
    const addGroup = (data) => {
        console.log(data);
        addEntity('group', {
            group_name: data.group_name,
            faculty_id: getFacId(data.faculty_name),
            speciality_id: getSpecId(data.speciality_name),
        })
            .then((res) => {
                res.data[0] = {
                    ...res.data[0],
                    speciality_name: getSpecName(res.data[0].speciality_id),
                    faculty_name: getFacName(res.data[0].faculty_id),
                };
                setGroupsData([...groupsData, res.data[0]]);
                setOpen(false);
            })
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
                                label="faculties"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.faculty_name && Boolean(errors.faculty_name)}
                            >
                                <MenuItem key={uuidv4()} value={values.faculty_name}>
                                    {values.faculty_name}
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
                                <MenuItem key={uuidv4()} value={values.speciality_name}>
                                    {values.speciality_name}
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
    );
};

export default GroupAddDialog;
