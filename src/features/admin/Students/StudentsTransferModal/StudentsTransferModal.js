import React, { useContext, useEffect, useState } from 'react';
import { StudentsServiceApi } from '../services/StudentsService';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import TableContext from '../StudentsTable/TableContext';
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

const StudentsTransferModal = ({ student, transfer }) => {
    const { t } = UseLanguage();
    const { loading, setLoading, open, setOpen, messageHandler, errorHandler } = useContext(
        TableContext,
    );
    const [studentData, setStudentData] = useState(student);
    const [loader, setLoader] = useState(loading.transfer);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        (async function studentInfo(id) {
            await getStudentInfo(id);
        })(student.user_id);
        return () => {
            setLoading((prevState) => {
                prevState.transfer = true;
                return prevState;
            });
        };
    }, [student]);

    const getStudentInfo = async (id) => {
        const response = await StudentsServiceApi.fetchStudentById('AdminUser', id, 'Transfer');
        if (response.length) {
            const { username, email } = response[0];
            setStudentData((prevState) => {
                prevState.username = username;
                prevState.email = email;
                return { ...prevState };
            });
            setLoader(false);
        } else if (response.error) {
            transferErrorHandler(t('students.transfer.errors.getStudentInfo'));
        }
    };

    const transferErrorHandler = (message) => {
        setOpen({ open: false });
        messageHandler(t('students.transfer.messages.closeDueError'), 'error');
        errorHandler(message, t('students.transfer.errors.typeWarning'));
    };

    return (
        <Paper component="div" elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open.open}>
                {loader ? (
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
                                {t('students.transfer.title')}
                            </h3>
                        </DialogTitle>
                        <DialogContent className={classes.Content}>
                            <TransferSelects
                                setOpen={setOpen}
                                setSubmitted={setSubmitted}
                                oldGroupId={+studentData.group_id}
                                setStudentData={setStudentData}
                                messageHandler={messageHandler}
                                errorHandler={transferErrorHandler}
                            />
                        </DialogContent>
                        <DialogActions className={classes.Actions}>
                            <Button
                                variant={'contained'}
                                className={classes.Button}
                                onClick={() => {
                                    setOpen({ open: false });
                                    messageHandler(
                                        t('students.transfer.messages.canceled'),
                                        'warning',
                                    );
                                }}
                                type="reset"
                            >
                                {t('students.transfer.buttons.cancel')}
                            </Button>
                            <Button
                                className={classes.Button}
                                type="submit"
                                disabled={!submitted}
                                onClick={() => {
                                    setLoader(true);
                                    transfer(studentData.user_id, studentData);
                                }}
                            >
                                {t('students.transfer.buttons.transfer')}
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
    student: PropTypes.object,
    transfer: PropTypes.func,
};
