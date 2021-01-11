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
import EditOutlined from '@material-ui/icons/EditOutlined';
import TableHead from '@material-ui/core/TableHead';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';

import { Link } from 'react-router-dom';
import { findIndex } from 'lodash';

import OpenSnackbar from '../../../common/snackbar';
import './subjects.css';
import DeleteComponent from './confirmDelete';
import SubJectServices from './subjectService';
import FormDialog from './dialog';
import SearchComponent from './searchComponent';
import TablePaginationActions from './tablePagination';

export default function SubjectComponent() {
    const service = new SubJectServices();
    const [initialSubjectData, setInitialSetSubjectData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [subject, setSubject] = useState({ create: false, data: {} });
    const [messageToSnackbar, setMessageToSnackbar] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deleteSubject, setDeleteSubject] = useState({ delete: false, id: '' });
    const [openForm, setOpenForm] = useState(false);
    const [editSubject, setEditSubject] = useState({
        edit: false,
        data: {},
        equal: false,
    });
    const [searchData, setSearchData] = useState('');
    //Read
    useEffect(() => {
        service.getRecords().then((res) => {
            setInitialSetSubjectData(res.data);
            setSubjectData(res.data);
        });
    }, []);

    const useStyles2 = makeStyles({
        table: {
            minWidth: 500,
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
            service
                .createSubject(subject.data)
                .then((res) => {
                    const newSubjectData = [...res.data, ...subjectData];
                    setSubjectData(newSubjectData);
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
        if (deleteSubject.delete) {
            service
                .deleteSubject(deleteSubject.id)
                .then((res) => {
                    if (res.data.response === 'ok') {
                        const newSubjectData = subjectData.filter(
                            (elem) => elem.subject_id !== deleteSubject.id,
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
    }, [deleteSubject]);

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
            service
                .editSubject(editSubject.data.subject_id, body)
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
    }, [editSubject]);
    //search
    useEffect(() => {
        if (searchData !== '') {
            const searchElems = initialSubjectData.filter((subject) => {
                return (
                    subject.subject_name.includes(searchData) ||
                    subject.subject_description.includes(searchData)
                );
            });
            setSubjectData(searchElems);
        } else {
            setSubjectData(initialSubjectData);
        }
    }, [searchData]);
    return (
        <div className="subjects-container">
            <div className="subject-btn">
                <Button variant="contained" color="primary" onClick={handleClickCreate}>
                    Додати предмет
                </Button>
                {openForm && (
                    <FormDialog
                        editSubject={editSubject}
                        openForm={openForm}
                        setSubject={setSubject}
                        setOpenForm={setOpenForm}
                        setEditSubject={setEditSubject}
                    />
                )}
            </div>
            <SearchComponent setSearchData={setSearchData} />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="subjects table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Назва</TableCell>
                            <TableCell align="center">Опис</TableCell>
                            <TableCell align="center">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? subjectData.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                              )
                            : subjectData
                        ).map((subject, index) => (
                            <TableRow key={subject.subject_id}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="left">{subject.subject_name}</TableCell>
                                <TableCell align="left">{subject.subject_description}</TableCell>
                                <TableCell id={subject.subject_id} align="left">
                                    <div className="action-btn-container">
                                        <Link
                                            to={{
                                                pathname: '/admin/tests',
                                                id: subject.subject_id,
                                            }}
                                        >
                                            <SpeakerNotesIcon />
                                        </Link>
                                        <Link
                                            to={{
                                                pathname: '/admin/timetable',
                                                id: subject.subject_id,
                                            }}
                                        >
                                            <ScheduleIcon />
                                        </Link>
                                        <EditOutlined
                                            label="Редагувати"
                                            onClick={() => handleEditSubject(subject)}
                                        />
                                        <DeleteComponent
                                            id={subject.subject_id}
                                            setDeleteSubject={setDeleteSubject}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
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
                                colSpan={3}
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
