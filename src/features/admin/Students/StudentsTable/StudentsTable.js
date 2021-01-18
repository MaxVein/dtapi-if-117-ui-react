import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../services/StudentsService';
import TableContext from './TableContext';
import StudentsContext from '../StudentsPage/StudentsContext';
import TableSearch from './TableSearch/TableSearch';
import StudentsCreateUpdateModal from '../StudentsCreateUpdateModal/StudentsCreateUpdateModal';
import StudentsViewModal from '../StudentsViewModal/StudentsViewModal';
import StudentsTransferModal from '../StudentsTransferModal/StudentsTransferModal';
import StudentsConfirm from '../StudentsConfirm/StudentsConfirm';
import PropTypes from 'prop-types';
import classes from './StudentsTable.module.css';

import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
} from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import EditIcon from '@material-ui/icons/Edit';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import DeleteIcon from '@material-ui/icons/Delete';

const StudentsTable = ({ students, setStudents }) => {
    const { t } = UseLanguage();
    const { loading, setLoading, open, setOpen, messageHandler, errorHandler } = useContext(
        StudentsContext,
    );
    const [dataSource, setDataSource] = useState([]);
    const displayedColumns = [
        t('students.table.id'),
        t('students.table.code'),
        t('students.table.fullName'),
        t('students.table.actions'),
    ];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setDataSource(students);
    }, [students]);

    useEffect(() => {
        const filteredData = getFilteredData(students);
        setDataSource(filteredData);
    }, [search]);

    const getFilteredData = (data) => {
        if (!search) {
            return data;
        }

        return data.filter((item) => {
            return (
                item['student_surname'].toLowerCase().includes(search.toLowerCase()) ||
                item['student_name'].toLowerCase().includes(search.toLowerCase()) ||
                item['student_fname'].toLowerCase().includes(search.toLowerCase()) ||
                item['gradebook_id'].toLowerCase().includes(search.toLowerCase())
            );
        });
    };

    const transfer = async (id, student) => {
        const update = await StudentsServiceApi.update(id, student);
        if (update.response === 'ok') {
            setStudents((prevState) => prevState.filter((s) => s.user_id !== student.user_id));
            setOpen({ open: false });
            messageHandler(t('students.transfer.messages.studentTransfer'), 'success');
        } else if (update.error) {
            setOpen({ open: false });
            messageHandler(t('students.transfer.messages.closeDueError'), 'error');
            errorHandler(
                t('students.transfer.errors.transferStudent'),
                t('students.transfer.errors.typeWarning'),
            );
        }
    };

    const update = async (id, student) => {
        const update = await StudentsServiceApi.update(id, student);
        if (update.response === 'ok') {
            setStudents((prevState) => {
                const index = prevState.findIndex((s) => s.user_id === student.user_id);
                prevState[index] = student;
                return [...prevState];
            });
            setOpen({ open: false });
            messageHandler(t('students.createUpdate.messages.studentUpdated'), 'success');
        } else if (update.error) {
            updateErrorHandler(update);
        }
    };

    const updateErrorHandler = (update) => {
        if (update.error.response === 'Error when update') {
            setOpen({ open: false });
            messageHandler(t('students.createUpdate.messages.noChanges'), 'warning');
            errorHandler(
                t('students.createUpdate.errors.mustChangeData'),
                t('students.createUpdate.errors.typeWarning'),
            );
        } else {
            setOpen({ open: false });
            messageHandler(t('students.createUpdate.messages.closeDueError'), 'error');
            errorHandler(
                t('students.createUpdate.errors.updateStudent'),
                t('students.createUpdate.errors.typeError'),
            );
        }
    };

    const remove = async (id) => {
        const res = await StudentsServiceApi.remove(id);
        if (res.response === 'ok') {
            setStudents((prevState) => prevState.filter((s) => s.user_id !== id));
            messageHandler(t('students.remove.messages.studentRemove'), 'success');
        } else if (res.error) {
            errorHandler(
                t('students.remove.errors.studentRemove'),
                t('students.remove.errors.typeError'),
            );
        }
    };

    return (
        <TableContext.Provider
            value={{
                loading,
                setLoading,
                open,
                setOpen,
                messageHandler,
                errorHandler,
            }}
        >
            <div className={classes.Table}>
                {students.length > 0 ? (
                    <>
                        <TableSearch onSearch={(search) => setSearch(search)} />
                        <TableContainer className={classes.TableContainer} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {displayedColumns.map((column, index) => (
                                            <TableCell key={column + index}>{column}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((student, index) => (
                                            <TableRow key={student.user_id + index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{student.gradebook_id}</TableCell>
                                                <TableCell>
                                                    {student.student_surname}&nbsp;
                                                    {student.student_name}&nbsp;
                                                    {student.student_fname}
                                                </TableCell>
                                                <TableCell>
                                                    <div className={classes.Actions}>
                                                        <Tooltip
                                                            title={t(
                                                                'students.table.tooltips.view',
                                                            )}
                                                        >
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    setOpen({
                                                                        open: true,
                                                                        type: 'View',
                                                                        student: student,
                                                                    })
                                                                }
                                                            >
                                                                <AssignmentIndIcon
                                                                    className={classes.ActionIcon}
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t(
                                                                'students.table.tooltips.update',
                                                            )}
                                                        >
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    setOpen({
                                                                        open: true,
                                                                        isUpdate: true,
                                                                        type: 'Update',
                                                                        student: student,
                                                                    })
                                                                }
                                                            >
                                                                <EditIcon
                                                                    className={classes.ActionIcon}
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t(
                                                                'students.table.tooltips.transfer',
                                                            )}
                                                        >
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    setOpen({
                                                                        open: true,
                                                                        type: 'Transfer',
                                                                        student: student,
                                                                    })
                                                                }
                                                            >
                                                                <CompareArrowsIcon
                                                                    className={classes.ActionIcon}
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t(
                                                                'students.table.tooltips.remove',
                                                            )}
                                                        >
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    setOpen({
                                                                        open: true,
                                                                        type: 'Delete',
                                                                        student: student,
                                                                    })
                                                                }
                                                            >
                                                                <DeleteIcon
                                                                    className={classes.ActionIcon}
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                labelRowsPerPage={t('labelRowsPerPage')}
                                className={classes.TablePaginator}
                                rowsPerPageOptions={[10, 15, 20, 25, 30, 40, 50, 100]}
                                count={dataSource.length}
                                page={page}
                                onChangePage={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onChangeRowsPerPage={(event) => {
                                    setRowsPerPage(+event.target.value);
                                    setPage(0);
                                }}
                            />
                        </TableContainer>
                    </>
                ) : (
                    <div className={classes.Empty}>
                        <ReportIcon color={'primary'} className={classes.EmptyIcon} />
                        <h1>{t('students.table.noStudents')}</h1>
                    </div>
                )}
                {open.open && open.type === 'Update' ? (
                    <StudentsCreateUpdateModal
                        isUpdate={open.isUpdate}
                        student={open.student}
                        update={update}
                    />
                ) : null}
                {open.open && open.type === 'View' ? (
                    <StudentsViewModal
                        groupID={open.student.group_id}
                        studentID={open.student.user_id}
                    />
                ) : null}
                {open.open && open.type === 'Transfer' ? (
                    <StudentsTransferModal student={open.student} transfer={transfer} />
                ) : null}
                {open.open && open.type === 'Delete' ? (
                    <StudentsConfirm student={open.student} remove={remove} />
                ) : null}
            </div>
        </TableContext.Provider>
    );
};

export default StudentsTable;

StudentsTable.propTypes = {
    students: PropTypes.array,
    setStudents: PropTypes.func,
};
