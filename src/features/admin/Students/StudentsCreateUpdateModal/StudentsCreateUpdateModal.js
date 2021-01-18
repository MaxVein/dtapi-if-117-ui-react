import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../services/StudentsService';
import TableContext from '../StudentsTable/TableContext';
import StudentsContext from '../StudentsPage/StudentsContext';
import CreateUpdateForm from './CreateUpdateForm/CreateUpdateForm';
import PropTypes from 'prop-types';
import classes from './StudentsCreateUpdateModal.module.css';

import { Dialog, DialogContent, DialogTitle, Paper, CircularProgress } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const StudentsCreateUpdateModal = ({ isUpdate, groupID, student, create, update }) => {
    const { t } = UseLanguage();
    const { loading, setLoading, open, setOpen, messageHandler, errorHandler } = useContext(
        isUpdate ? TableContext : StudentsContext,
    );
    const [studentData, setStudentData] = useState(
        isUpdate && student ? { ...student } : { group_id: groupID },
    );
    const [loader, setLoader] = useState(isUpdate ? loading.update : loading.create);

    useEffect(() => {
        if (isUpdate && student) {
            (async function studentInfo(id) {
                await getStudentInfo(id);
            })(student.user_id);
        }
        return () => {
            setLoading((prevState) => {
                prevState.create = false;
                prevState.update = true;
                return prevState;
            });
        };
    }, [isUpdate, student]);

    const getStudentInfo = async (id) => {
        const student = await StudentsServiceApi.fetchStudentDataForUpdate(id);
        if (student.length) {
            setStudentData((prevState) => ({
                ...prevState,
                ...student[0],
            }));
            setLoader(false);
        } else if (student.error) {
            setOpen({ open: false });
            messageHandler(t('students.createUpdate.messages.closeDueError'), 'error');
            errorHandler(
                t('students.createUpdate.errors.getStudentInfo'),
                t('students.createUpdate.errors.typeError'),
            );
        }
    };

    const start = (id, student) => {
        setLoader(true);
        if (isUpdate) {
            update(id, student);
        } else {
            create(student);
        }
    };

    return (
        <Paper className={classes.Dialog} elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open.open}>
                {loader ? (
                    <CircularProgress
                        className={classes.Spinner}
                        color={'primary'}
                        size={80}
                        variant="indeterminate"
                    />
                ) : (
                    <div className={classes.StudentsDialog}>
                        <DialogTitle disableTypography={true} className={classes.DialogTitle}>
                            <h1>
                                {isUpdate ? (
                                    <EditIcon className={classes.TitleIcon} />
                                ) : (
                                    <PersonAddIcon className={classes.TitleIcon} />
                                )}
                                {isUpdate
                                    ? t('students.createUpdate.updateTitle')
                                    : t('students.createUpdate.addTitle')}
                            </h1>
                        </DialogTitle>
                        <DialogContent className={classes.DialogContent}>
                            <CreateUpdateForm
                                isUpdate={isUpdate}
                                updateData={studentData}
                                messageHandler={messageHandler}
                                setOpen={setOpen}
                                start={start}
                            />
                        </DialogContent>
                    </div>
                )}
            </Dialog>
        </Paper>
    );
};

export default StudentsCreateUpdateModal;

StudentsCreateUpdateModal.propTypes = {
    isUpdate: PropTypes.bool,
    groupID: PropTypes.string,
    student: PropTypes.object,
    create: PropTypes.func,
    update: PropTypes.func,
};
