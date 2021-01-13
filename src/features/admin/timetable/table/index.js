import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TableHeadComponent from './tableHead';
import TableList from './tableList';
import TablePagination from './tablePagination';

export default function TableComponent({ entity, handleEditEntity, setDeleteEntity, titleRow }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const useStyles = makeStyles({
        table: {
            minWidth: 400,
        },
    });
    const classes = useStyles();
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, entity.length - page * rowsPerPage);
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
                            key={elem.id}
                            elem={elem}
                            handleEditEntity={handleEditEntity}
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
