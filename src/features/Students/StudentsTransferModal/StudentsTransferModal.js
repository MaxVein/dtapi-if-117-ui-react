import React, { useCallback, useEffect, useState } from 'react';
import { StudentsServiceAPI } from '../services/StudentsService';
import TransferSelects from './TransferSelects/TransferSelects';
import PropTypes from 'prop-types';
import classes from './StudentsTransferModal.module.css';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
} from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

const StudentsTransferModal = ({
    open,
    setOpen,
    student,
    setDataSource,
    setSnackBar,
    setError,
}) => {
    const [studentData, setStudentData] = useState(student);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    const errorHandler = useCallback(
        (message) => {
            setLoading(false);
            setOpen({ open: false });
            setSnackBar({ open: true, message: 'Закрито через помилку' });
            setError({
                error: true,
                message,
                type: 'Помилка',
            });
        },
        [setLoading, setOpen, setSnackBar, setError],
    );

    useEffect(() => {
        (async function getStudentInfo(id) {
            try {
                const response = await StudentsServiceAPI.fetchStudentById('AdminUser', id);
                const { username, email } = response[0];
                if (response.length) {
                    setLoading(false);
                    setStudentData((prevState) => {
                        prevState.username = username;
                        prevState.email = email;
                        return { ...prevState };
                    });
                }
            } catch (e) {
                errorHandler('Сталася помилка при отриманні даних студента. Спробуйте знову');
            }
            return () => setStudentData({});
        })(student.user_id);
    }, [student, errorHandler]);

    const submit = async () => {
        setLoading(true);
        try {
            const response = await StudentsServiceAPI.update(studentData.user_id, studentData);
            if (response.data.response === 'ok') {
                setDataSource((prevState) => {
                    const arr = prevState.filter((s) => s.user_id !== studentData.user_id);
                    return arr;
                });
                setLoading(false);
                setOpen(false);
                setSnackBar({
                    open: true,
                    message: 'Студента переведено',
                });
            }
        } catch (e) {
            errorHandler('Сталася помилка при переведенні студента. Спробуйте знову');
        }
    };

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
                    <div className={classes.TransferDialog}>
                        <DialogTitle disableTypography={true} className={classes.Title}>
                            <h3>
                                <CompareArrowsIcon className={classes.TitleIcon} />
                                Переведення студента
                            </h3>
                        </DialogTitle>
                        <DialogContent className={classes.Content}>
                            <TransferSelects
                                setSubmitted={setSubmitted}
                                oldGroupId={+studentData.group_id}
                                setStudentData={setStudentData}
                                setSnackBar={setSnackBar}
                                errorHandler={errorHandler}
                            />
                        </DialogContent>
                        <DialogActions className={classes.Actions}>
                            <Button
                                variant={'contained'}
                                className={classes.Button}
                                onClick={() => {
                                    setOpen({ open: false });
                                    setSnackBar({ open: true, message: 'Скасовано' });
                                }}
                                type="reset"
                            >
                                Скасувати
                            </Button>
                            <Button
                                className={classes.Button}
                                type="submit"
                                disabled={!submitted}
                                onClick={submit}
                            >
                                Перевести
                            </Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
        </Paper>
    );
};

export default StudentsTransferModal;

StudentsTransferModal.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    student: PropTypes.object,
    setDataSource: PropTypes.func,
    setSnackBar: PropTypes.func,
    setError: PropTypes.func,
};
