import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import TableHeadComponent from './tableHead';
import TableList from './tableList';
import TablePaginationActions from './tablePagination';
import classes from './table.module.css';

export default function TableComponent({ entity, handleEditEntity, setDeleteEntity, titleRow }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHeadComponent titleRow={titleRow} />
                <TableBody>
                    {(rowsPerPage > 0
                        ? entity.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : entity
                    ).map((elem) => (
                        <TableList
                            key={elem.timetable_id}
                            entity={elem}
                            handleEditEntity={handleEditEntity}
                            setDeleteEntity={setDeleteEntity}
                        />
                    ))}
                    {entity.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.noInputData} colSpan={6}>
                                Немає розкладу для заданого предмету.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={7}
                            count={entity.length}
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
    );
}
