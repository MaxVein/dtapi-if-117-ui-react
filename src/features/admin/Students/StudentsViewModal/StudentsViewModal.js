import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../services/StudentsService';
import TableContext from '../StudentsTable/TableContext';
import StudentInfo from './StudentInfo/StudentInfo';
import PropTypes from 'prop-types';
import classes from './StudentsViewModal.module.css';

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

const StudentsViewModal = ({ groupID, studentID }) => {
    const { t } = UseLanguage();
    const { loading, setLoading, open, setOpen, messageHandler, errorHandler } = useContext(
        TableContext,
    );
    const [student, setStudent] = useState({});

    useEffect(() => {
        (async function studentInfo(studentID, groupID) {
            await getStudentInfo(studentID, groupID);
        })(studentID, groupID);
        return () => {
            setLoading((prevState) => {
                prevState.view = true;
                return prevState;
            });
        };
    }, [groupID, studentID]);

    const getStudentInfo = async (studentID, groupID) => {
        const info = await StudentsServiceApi.fetchStudentInfo(studentID, groupID);
        if (info.length) {
            setStudent(info[0]);
            setLoading((prevState) => {
                prevState.view = false;
                return prevState;
            });
            messageHandler(t('students.view.messages.uploadStudentData'), 'success');
        } else if (!info.length) {
            setOpen({ open: false });
            setLoading((prevState) => {
                prevState.view = true;
                return prevState;
            });
            messageHandler(t('students.view.messages.notStudentData'), 'warning');
        } else if (info.error) {
            setOpen({ open: false });
            setLoading((prevState) => {
                prevState.view = true;
                return prevState;
            });
            errorHandler(
                t('students.view.errors.uploadStudentData'),
                t('students.view.errors.typeError'),
            );
            messageHandler(t('students.view.messages.closeDueError'), 'error');
        }
    };

    return (
        <Paper component="div" elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open.open}>
                {loading.view ? (
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
                                {t('students.view.title')}
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
                                    messageHandler(t('students.view.messages.close'), 'info');
                                }}
                                type="reset"
                            >
                                {t('students.view.buttons.close')}
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
    groupID: PropTypes.string,
    studentID: PropTypes.string,
};
