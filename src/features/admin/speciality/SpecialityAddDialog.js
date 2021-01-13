import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik } from 'formik';
import { addEntity, updateEntity } from '../../../common/utils';

import * as Yup from 'yup';

const SpecialityAddDialig = ({
    open,
    setOpen,
    speciality,
    setEdit,
    setSpecialityDate,
    specialityDates,
}) => {
    const initialValues = {
        name: speciality ? speciality.speciality_name : '',
        code: speciality ? speciality.speciality_code : '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Заповни поле'),
        code: Yup.string().required('Заповни поле').max(5, 'Максимум 5 чисел'),
    });
    const handleClose = () => {
        speciality ? setEdit(false) : setOpen(false);
    };
    const updateSpeciality = (data) => {
        updateEntity('Speciality', speciality.speciality_id, {
            speciality_name: data.name,
            speciality_code: data.code,
        }).then((res) => {
            const updatedList = specialityDates.map((item) =>
                res.data[0].speciality_id === item.speciality_id ? res.data[0] : item,
            );
            setSpecialityDate(updatedList);
            setEdit(false);
        });
    };
    const addSpeciality = (data) => {
        addEntity('Speciality', {
            speciality_name: data.name,
            speciality_code: data.code,
        })
            .then((res) => {
                setSpecialityDate([...specialityDates, res.data[0]]);
                setOpen(false);
            })
            .catch((e) => {});
    };
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {speciality ? 'Редагувати спеціальність' : 'Додати спеціальність'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnMount={true}
                    onSubmit={(data) => {
                        speciality ? updateSpeciality(data) : addSpeciality(data);
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
                                    {speciality ? 'Редагувати' : 'Додати'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default SpecialityAddDialig;
