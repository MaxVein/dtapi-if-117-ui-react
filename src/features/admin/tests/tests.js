import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { findIndex } from 'lodash';

import {
    getTestRecords,
    updateEntities,
    createEntities,
    deleteEntities,
} from '../subjects/apiService';
import SnackbarHandler from '../../../common/components/Snackbar/snackbar';
import TableList from './tableList';
import TablePaginationActions from '../subjects/tablePagination';
import FormDialog from './dialog';
import classes from './test.module.css';
import SelectTest from './selectTest';

export default function Tests() {
    const location = useLocation();
    const { id, name } = location.state;
    const [testData, setTestData] = useState([]);
    const [snack, setSnack] = useState({ open: false });
    const [deleteEntity, setDeleteEntity] = useState({ delete: false, id: '' });
    const [openForm, setOpenForm] = useState(false);
    const [editTest, setEditTest] = useState({
        edit: false,
        data: {},
        equal: false,
    });
    const [test, setTest] = useState([]);
    const [sort, setSort] = useState({
        test_name: true,
        test_id: true,
        tasks: true,
        time_for_test: true,
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    //Read
    useEffect(() => {
        getTestRecords(id).then((res) => {
            setTestData(res.data);
        });
    }, [id]);

    // Table
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, testData.length - page * rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //create
    const handleClickCreate = () => {
        setOpenForm(true);
        setEditTest({});
    };
    useEffect(() => {
        if (test.create) {
            createEntities('test', test.data)
                .then((res) => {
                    setTestData((prevVal) => [...res.data, ...prevVal]);
                    setOpenForm(false);
                    setSnack({ open: true, type: 'success', message: 'Тест додано' });
                })
                .catch(() => {
                    setOpenSnackbar(true);
                    setSnack({
                        open: true,
                        type: 'erorr',
                        message: 'Схоже тест з такою назвою уже існує',
                    });
                });
        }
    }, [test]);

    //edit
    const handleEditTest = (item) => {
        setOpenForm(true);
        setEditTest({ edit: true, data: item, equal: true, first: true });
    };
    useEffect(() => {
        if (editTest.equal && !editTest.first) {
            setSnack({ open: true, type: 'warning', message: 'Внесіть зміни у форму' });
        } else if (editTest.edit && !editTest.equal) {
            updateEntities('test', editTest.data.test_id, editTest.data)
                .then((res) => {
                    setOpenForm(false);

                    setTestData((prevVal) => {
                        const updateIndex = findIndex(prevVal, (o) => {
                            return o.test_id === res.data[0].test_id;
                        });
                        prevVal[updateIndex] = res.data[0];
                        return [...prevVal];
                    });

                    setSnack({ open: true, type: 'success', message: 'Тест оновлено' });
                })
                .catch(() => {
                    setSnack({
                        open: true,
                        type: 'error',
                        message: 'Виникли проблеми на сервері спробуйте пізніше',
                    });
                });
        }
    }, [editTest]);

    // delete
    useEffect(() => {
        if (deleteEntity.delete) {
            deleteEntities('test', deleteEntity.id)
                .then((res) => {
                    if (res.data.response === 'ok') {
                        setTestData((prevVal) => {
                            return prevVal.filter((elem) => elem.test_id !== deleteEntity.id);
                        });
                        setSnack({ open: true, type: 'success', message: 'Тест видалено' });
                    }
                })
                .catch(() => {
                    setSnack({
                        open: true,
                        type: 'error',
                        message: 'Виникли проблеми на сервері спробуйте пізніше',
                    });
                });
        }
    }, [deleteEntity]);

    //Sorting
    const handleSorting = (key) => {
        let newTestData = [...testData];
        newTestData.forEach((elem) => {
            elem.tasks = +elem.tasks;
            elem.time_for_test = +elem.time_for_test;
            elem.test_id = +elem.test_id;
        });
        if (sort[key]) {
            setSort({ [key]: !sort[key] });
            newTestData = [...testData].sort((a, b) => {
                return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
            });
        } else {
            setSort({ [key]: !sort[key] });
            newTestData = [...testData].sort((a, b) => {
                return a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0;
            });
        }
        setTestData(newTestData);
    };
    //Select subject
    const handleSubjectChange = (event) => {
        console.log(`event`, event);
    };

    return (
        <div>
            <div className={classes.titleWraper}>
                <div className="test-title">
                    Тести з предмета:
                    <b>
                        <em> {name}</em>
                    </b>
                </div>
                <Button variant="contained" color="primary" onClick={handleClickCreate}>
                    Додати тест
                </Button>
            </div>
            {openForm && (
                <FormDialog
                    editTest={editTest}
                    openForm={openForm}
                    setTest={setTest}
                    setOpenForm={setOpenForm}
                    setEditTest={setEditTest}
                    subject_id={id}
                />
            )}
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="test table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" onClick={() => handleSorting('test_id')}>
                                <div className="table-head-title">
                                    <span className="sorting-arrows">
                                        {sort.test_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </span>
                                    ID
                                </div>
                            </TableCell>
                            <TableCell align="left" onClick={() => handleSorting('test_name')}>
                                <div className="table-head-title">
                                    <span className="sorting-arrows">
                                        {sort.test_name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </span>
                                    Назва
                                </div>
                            </TableCell>
                            <TableCell align="left">Предмет</TableCell>
                            <TableCell align="left" onClick={() => handleSorting('tasks')}>
                                <div className="table-head-title">
                                    <span className="sorting-arrows">
                                        {sort.tasks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </span>
                                    Кількість тестів
                                </div>
                            </TableCell>
                            <TableCell align="left" onClick={() => handleSorting('time_for_test')}>
                                <div className="table-head-title">
                                    <span className="sorting-arrows">
                                        {sort.time_for_test ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </span>
                                    Час для проходження тесту (хв)
                                </div>
                            </TableCell>
                            <TableCell align="left">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? testData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : testData
                        ).map((test) => (
                            <TableList
                                key={test.test_id}
                                test={test}
                                handleEditTest={handleEditTest}
                                setDeleteEntity={setDeleteEntity}
                                subjectName={name}
                            />
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={6}
                                count={testData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'рядків на сторінці' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </div>
    );
}
