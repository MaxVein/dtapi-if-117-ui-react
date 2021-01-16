import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { v4 as uuidv4 } from 'uuid';
import { Formik } from 'formik';
import { UseLanguage } from '../../../lang/LanguagesContext';

import * as Yup from 'yup';

const GroupFilter = ({
    open,
    setFilter,
    data,
    setGroupsData,
    groupsData,
    isFacFilter,
    allGroupsData,
    setIsFacFilter,
    openSnack,
    setOpenSnack,
    snackMes,
    setSnackMes,
}) => {
    const { t } = UseLanguage();

    const initialValues = {
        field: '',
    };

    const validationSchema = Yup.object({
        field: Yup.string().required('Заповни поле'),
    });
    const handleClose = () => {
        setFilter(false);
        setIsFacFilter(false);
    };
    const filterData = (fData) => {
        if (isFacFilter) {
            const newData = allGroupsData.filter((item) => item.faculty_name === fData.field);
            setGroupsData(newData);
            setSnackMes('Відфільтровано по факультетам');
            setOpenSnack(true);
            setFilter(false);
            setIsFacFilter(false);
        } else {
            const newData = allGroupsData.filter((item) => item.speciality_name === fData.field);
            setGroupsData(newData);
            setSnackMes('Відфільтровано по спеціальностям');
            setOpenSnack(true);
            setFilter(false);
        }
    };
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t('groups.modal.filters.title')}</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnMount={true}
                    onSubmit={(data) => {
                        filterData(data);
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
                            <Select
                                name="field"
                                value={values.field}
                                className="select"
                                key={uuidv4()}
                                displayEmpty
                                fullWidth
                                margin="dense"
                                id="field"
                                label="field"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.field && Boolean(errors.field)}
                            >
                                {isFacFilter ? (
                                    <MenuItem value="" disabled>
                                        {t('groups.modal.chooseFacultyButton')}
                                    </MenuItem>
                                ) : (
                                    <MenuItem value="" disabled>
                                        {t('groups.modal.chooseSpecialityButton')}
                                    </MenuItem>
                                )}
                                {data.map((item) => {
                                    return (
                                        <MenuItem key={uuidv4()} value={item}>
                                            {item}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            <div style={{ margin: '1rem', textAlign: 'center' }}>
                                <Button onClick={handleClose} color="primary">
                                    {t('groups.modal.cancelButton')}
                                </Button>
                                <Button disabled={!isValid} type="submit" color="primary">
                                    {t('groups.modal.filters.applyButton')}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default GroupFilter;
