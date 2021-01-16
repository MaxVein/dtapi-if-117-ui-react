import React, { useEffect, useState } from 'react';
import { StudentsServiceAPI } from '../services/StudentsService';
import StudentInfo from './StudentInfo/StudentInfo';
import PropTypes from 'prop-types';
import classes from './StudentsViewModal.module.css';
import { UseLanguage } from '../../../lang/LanguagesContext';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    CircularProgress,
    Button,
    DialogActions,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const StudentsViewModal = ({ open, setOpen, groupID, studentID, setError, setSnackBar }) => {
    const { t } = UseLanguage();

    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function getStudentInfo() {
            try {
                const response = await StudentsServiceAPI.fetchStudentInfo(studentID, groupID);
                if (response.length) {
                    setStudent(response[0]);
                    setLoading(false);
                    setSnackBar({
                        open: true,
                        message: 'Дані студента завантажено',
                    });
                } else {
                    setOpen({ open: false });
                    setSnackBar({
                        open: true,
                        message: 'Немає даних про вибраного студента',
                    });
                }
            } catch (e) {
                setLoading(false);
                setOpen({ open: false });
                setSnackBar({ open: true, message: 'Закрито через помилку' });
                setError({
                    error: true,
                    message: 'Сталася помилка при отриманні даних студента. Спробуйте знову',
                    type: 'Помилка',
                });
            }
        })();
        return () => setStudent({});
    }, [groupID, studentID, setError, setOpen, setSnackBar]);

    return (
        <Paper component="div" elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open}>
                {loading ? (
                    <CircularProgress
                        className={classes.Spinner}
                        color={'primary'}
                        size={80}
                        variant="indeterminate"
                    />
                ) : (
                    <div className={classes.ViewDialog}>
                        <DialogTitle disableTypography={true} className={classes.Title}>
                            <h3>
                                <InfoIcon className={classes.TitleIcon} />
                                {t('students.details.title')}
                            </h3>
                        </DialogTitle>
                        <DialogContent className={classes.Content}>
                            <StudentInfo student={student} />
                        </DialogContent>
                        <DialogActions className={classes.Actions}>
                            <Button
                                variant={'contained'}
                                className={classes.Button}
                                onClick={() => {
                                    setOpen({ open: false });
                                    setSnackBar({ open: true, message: 'Закрито' });
                                }}
                                type="reset"
                            >
                                {t('students.details.close')}
                            </Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
        </Paper>
    );
};

export default StudentsViewModal;

StudentsViewModal.propTypes = {
    open: PropTypes.bool,
    groupID: PropTypes.string,
    studentID: PropTypes.string,
    setOpen: PropTypes.func,
    setSnackBar: PropTypes.func,
    setError: PropTypes.func,
};
