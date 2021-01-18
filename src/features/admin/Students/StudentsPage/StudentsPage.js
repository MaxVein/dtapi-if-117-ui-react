import React, { useState, useEffect, useCallback } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../services/StudentsService';
import StudentsContext from './StudentsContext';
import StudentsTable from '../StudentsTable/StudentsTable';
import StudentsCreateUpdateModal from '../StudentsCreateUpdateModal/StudentsCreateUpdateModal';
import Loader from '../../../../common/components/Loader/Loader';
import SnackBar from '../../../../common/components/Snackbar/snackbar';
import Alert from '../../../../common/components/Alert/Alert';
import classes from './StudentsPage.module.css';

import { Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HowToRegIcon from '@material-ui/icons/HowToReg';

const StudentsPage = ({ match, location }) => {
    const { t } = UseLanguage();
    const [groupInfo] = useState({
        id: match.params.id,
        name:
            location.query !== undefined
                ? location.query.group_name
                : localStorage.getItem('group_name'),
    });
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState({
        open: false,
        isUpdate: false,
        type: 'Add' | 'Update' | 'Transfer' | 'Delete' | 'View',
        student: {},
    });
    const [loading, setLoading] = useState({
        page: true,
        create: false,
        update: true,
        view: true,
        transfer: true,
    });
    const [snackBar, setSnackBar] = useState({ open: false, message: '', type: 'success' });
    const [error, setError] = useState({ error: false, message: '', type: '' });

    const errorHandler = useCallback(
        (message, type) => {
            setError({
                error: true,
                message,
                type,
            });
        },
        [error, setError],
    );

    const messageHandler = useCallback(
        (message, type) => {
            setSnackBar({
                open: true,
                message,
                type,
            });
        },
        [setSnackBar],
    );

    useEffect(() => {
        if (location.query !== undefined) {
            localStorage.setItem('group_name', location.query.group_name);
        }
    }, [location.query]);

    useEffect(() => {
        (async function studentsByGroup(id) {
            await getStudentsByGroup(id);
        })(groupInfo.id);
    }, [groupInfo.id]);

    const getStudentsByGroup = async (id) => {
        const students = await StudentsServiceApi.fetchStudentsByGroup(id, true);
        if (students.length) {
            setStudents(students);
            setLoading((prevState) => {
                prevState.page = false;
                return prevState;
            });
            messageHandler(t('students.page.messages.uploadStudents'), 'success');
        } else if (!students.length) {
            setStudents([]);
            setLoading((prevState) => {
                prevState.page = false;
                return prevState;
            });
            messageHandler(t('students.page.messages.noStudents'), 'warning');
        } else if (students.error) {
            setStudents([]);
            setLoading((prevState) => {
                prevState.page = false;
                return prevState;
            });
            errorHandler(
                t('students.page.errors.uploadStudents'),
                t('students.page.errors.typeError'),
            );
        }
    };

    const create = async (student) => {
        const create = await StudentsServiceApi.create(student);
        if (create.id && create.response === 'ok') {
            student.user_id = create.id.toString();
            setStudents((prevState) => [...prevState, student]);
            setOpen((prevState) => {
                prevState.open = false;
                return prevState;
            });
            messageHandler(t('students.createUpdate.messages.studentAdded'), 'success');
        } else if (create.error) {
            setOpen((prevState) => {
                prevState.open = false;
                return prevState;
            });
            messageHandler(t('students.createUpdate.messages.closeDueError'), 'error');
            errorHandler(
                t('students.createUpdate.errors.createStudent'),
                t('students.createUpdate.errors.typeError'),
            );
        }
    };

    return (
        <StudentsContext.Provider
            value={{
                loading,
                setLoading,
                open,
                setOpen,
                messageHandler,
                errorHandler,
            }}
        >
            <div className={classes.Page}>
                <div className={classes.Header}>
                    <h1>
                        <HowToRegIcon className={classes.Icon} />
                        {t('students.page.title')} {groupInfo.name}
                    </h1>
                    <Button
                        className={classes.Button}
                        startIcon={<AddCircleIcon />}
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={() =>
                            setOpen({ open: true, isUpdate: false, type: 'Add', student: {} })
                        }
                    >
                        {t('students.page.addButton')}
                    </Button>
                </div>
                {loading.page ? (
                    <Loader />
                ) : (
                    <StudentsTable students={students} setStudents={setStudents} />
                )}
                {open.open && open.type === 'Add' ? (
                    <StudentsCreateUpdateModal
                        isUpdate={open.isUpdate}
                        groupID={groupInfo.id}
                        create={create}
                    />
                ) : null}
                <SnackBar snack={snackBar} setSnack={setSnackBar} />
                {error.error ? (
                    <Alert
                        show={error.error}
                        message={error.message}
                        type={error.type}
                        hide={setError}
                    />
                ) : null}
            </div>
        </StudentsContext.Provider>
    );
};

export default StudentsPage;
