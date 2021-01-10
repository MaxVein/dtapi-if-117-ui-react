import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StudentsServiceAPI } from '../services/StudentsService';
import StudentsTable from '../StudentsTable/StudentsTable';
import StudentsCreateUpdateModal from '../StudentsCreateUpdateModal/StudentsCreateUpdateModal';
import Loader from '../../../components/Loader/Loader';
import SnackBar from '../../../components/SnackBar/SnackBar';
import Alert from '../../../components/Alert/Alert';
import classes from './StudentsPage.module.css';

import { Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HowToRegIcon from '@material-ui/icons/HowToReg';

const StudentsPage = ({ match, location }) => {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState({ open: false, isUpdate: false });
    const [loading, setLoading] = useState(true);
    const [snackBar, setSnackBar] = useState({ open: false, message: '' });
    const [error, setError] = useState({ error: false, message: '', type: '' });
    const history = useHistory();

    if (location.query !== undefined) {
        localStorage.setItem('group_name', location.query.group_name);
    }

    useEffect(() => {
        (async function getStudentsByGroup() {
            try {
                const students = await StudentsServiceAPI.fetchStudentsByGroup(
                    match.params.id,
                    true,
                );
                if (students.data.length) {
                    setSnackBar({ open: true, message: 'Студентів завантажено' });
                    setStudents(students.data);
                    setLoading(false);
                } else {
                    setSnackBar({ open: true, message: 'Студенти відсутні' });
                    setStudents([]);
                    setLoading(false);
                }
            } catch (e) {
                errorHandler(
                    'Сталася помилка! Не вдалося завантажити студентів даної групи! Спробуйте знову',
                );
                history.push('/admin/group');
            }
        })();
        return () => setStudents([]);
    }, [history, match.params.id]);

    const errorHandler = (message) => {
        setError({
            error: true,
            message,
            type: 'Помилка',
        });
    };

    return (
        <div className={classes.Page}>
            <div className={classes.Header}>
                <h1>
                    <HowToRegIcon className={classes.Icon} />
                    Студенти групи {localStorage.getItem('group_name')}
                </h1>
                <Button
                    className={classes.Button}
                    startIcon={<AddCircleIcon />}
                    size="large"
                    color="primary"
                    variant="contained"
                    onClick={() => setOpen({ open: true, isUpdate: false })}
                >
                    Додати студента
                </Button>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <StudentsTable
                    students={students}
                    setSnackBar={setSnackBar}
                    setError={setError}
                    errorHandler={errorHandler}
                />
            )}
            <SnackBar show={snackBar.open} message={snackBar.message} hide={setSnackBar} />
            {error.error ? (
                <Alert
                    show={error.error}
                    message={error.message}
                    type={error.type}
                    hide={setError}
                />
            ) : null}
            {open.open ? (
                <StudentsCreateUpdateModal
                    open={open.open}
                    setOpen={setOpen}
                    isUpdate={open.isUpdate}
                    groupID={match.params.id}
                    setError={setError}
                    setStudents={setStudents}
                    setSnackBar={setSnackBar}
                />
            ) : null}
        </div>
    );
};

export default StudentsPage;
