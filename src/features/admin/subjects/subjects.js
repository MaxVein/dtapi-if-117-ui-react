import React, { useState, useEffect } from 'react';

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
import { Typography } from '@material-ui/core';

import { findIndex } from 'lodash';

import OpenSnackbar from './snackbar';
import TableList from './tableList';
import {
    getRecords,
    createEntities,
    deleteEntities,
    updateEntities,
    filterArr,
} from './apiService';
import FormDialog from './dialog';
import SearchComponent from './searchComponent';
import TablePaginationActions from './tablePagination';

export default function Subjects() {
    const [initialSubjectData, setInitialSetSubjectData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [subject, setSubject] = useState({ create: false, data: {} });
    const [messageToSnackbar, setMessageToSnackbar] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deleteEntity, setDeleteEntity] = useState({ delete: false, id: '' });
    const [openForm, setOpenForm] = useState(false);
    const [editSubject, setEditSubject] = useState({
        edit: false,
        data: {},
        equal: false,
    });
    const [searchData, setSearchData] = useState('');

    //Read
    useEffect(() => {
        getRecords('Subject').then((res) => {
            setInitialSetSubjectData(res.data);
            setSubjectData(res.data);
        });
    }, []);
    // Table
    const useStyles2 = makeStyles({
        table: {
            minWidth: 400,
        },
    });
    const classes = useStyles2();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, subjectData.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //Create
    const handleClickCreate = () => {
        setOpenForm(true);
        setEditSubject({});
    };
    useEffect(() => {
        if (subject.create) {
            createEntities('Subject', subject.data)
                .then((res) => {
                    // const newSubjectData = [...res.data, ...subjectData];
                    setSubjectData((prevVal) => [...res.data, ...prevVal]);
                    setOpenForm(false);
                    setOpenSnackbar(true);
                    setMessageToSnackbar('Предмет додано');
                })
                .catch(() => {
                    setOpenSnackbar(true);
                    setMessageToSnackbar('Схоже предмет з такою назвою уже існує');
                });
        }
    }, [subject]);
    //Delete
    useEffect(() => {
        if (deleteEntity.delete) {
            deleteEntities('Subject', deleteEntity.id)
                .then((res) => {
                    if (res.data.response === 'ok') {
                        const newSubjectData = subjectData.filter(
                            (elem) => elem.subject_id !== deleteEntity.id,
                        );
                        setSubjectData(newSubjectData);
                        setOpenSnackbar(true);
                        setMessageToSnackbar('Предмет видалено');
                    }
                })
                .catch(() => {
                    setOpenSnackbar(true);
                    setMessageToSnackbar('Виникли проблеми на сервері спробуйте пізніше');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteEntity]);

    //Update
    const handleEditSubject = (item) => {
        setOpenForm(true);
        setEditSubject({ edit: true, data: item, equal: true, first: true });
    };
    useEffect(() => {
        if (editSubject.equal && !editSubject.first) {
            setOpenSnackbar(true);
            setMessageToSnackbar('Внесіть зміни у форму');
        } else if (editSubject.edit && !editSubject.equal) {
            const body = {
                subject_description: editSubject.data.subject_description,
                subject_name: editSubject.data.subject_name,
            };
            updateEntities('Subject', editSubject.data.subject_id, body)
                .then((res) => {
                    setOpenForm(false);
                    setOpenSnackbar(true);
                    setMessageToSnackbar('Предмет оновлено');
                    const updateIndex = findIndex(subjectData, (o) => {
                        return o.subject_id === res.data[0].subject_id;
                    });
                    let newSubjectData = [...subjectData];
                    newSubjectData[updateIndex] = res.data[0];
                    setSubjectData(newSubjectData);
                })
                .catch(() => {
                    setOpenSnackbar(true);
                    setMessageToSnackbar('Виникли проблеми на сервері спробуйте пізніше');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editSubject]);
    //search
    useEffect(() => {
        if (searchData !== '') {
            const searchElems = filterArr(initialSubjectData, searchData);
            setSubjectData(searchElems);
        } else {
            setSubjectData(initialSubjectData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData]);
    return (
        <div className="subjects-container">
            <div className="subject-btn">
                <Typography component="h2" variant="h4" color="textPrimary" gutterBottom>
                    Предмети
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClickCreate}>
                    Додати предмет
                </Button>
            </div>
            {openForm && (
                <FormDialog
                    editSubject={editSubject}
                    openForm={openForm}
                    setSubject={setSubject}
                    setOpenForm={setOpenForm}
                    setEditSubject={setEditSubject}
                />
            )}
            <SearchComponent setSearchData={setSearchData} />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="subjects table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Назва</TableCell>
                            <TableCell align="left">Опис</TableCell>
                            <TableCell align="left">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? subjectData.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                              )
                            : subjectData
                        ).map((subject) => (
                            <TableList
                                key={subject.subject_id}
                                subject={subject}
                                handleEditSubject={handleEditSubject}
                                setDeleteEntity={setDeleteEntity}
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
                                colSpan={4}
                                count={subjectData.length}
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
            <OpenSnackbar
                messageToSnackbar={messageToSnackbar}
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
            />
        </div>
    );
}
