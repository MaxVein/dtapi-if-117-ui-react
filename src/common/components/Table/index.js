import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TablePaginationActions from './tablePagination';
import TableHeadComponent from './tableHead';
import { UseLanguage } from '../../../lang/LanguagesContext';

export default function TableComponent({
    entity,
    handleEditEntity,
    setDeleteEntity,
    titleRow,
    TableList,
    entityNameId,
}) {
    const { t } = UseLanguage();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const useStyles = makeStyles({
        table: {
            minWidth: 400,
        },
    });
    const classes = useStyles();
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, entity.length - page * rowsPerPage);
    const noData = 'Немає розкладу для заданого предмету.';
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="subjects table">
                <TableHeadComponent titleRow={titleRow} />
                <TableBody>
                    {(rowsPerPage > 0
                        ? entity.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : entity
                    ).map((elem) => (
                        <TableList
                            key={elem[entityNameId]}
                            entity={elem}
                            handleEditEntity={handleEditEntity}
                            setDeleteEntity={setDeleteEntity}
                        />
                    ))}
                    {entity.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.noInputData} colSpan={6}>
                                {noData}
                            </TableCell>
                        </TableRow>
                    )}
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
                            colSpan={titleRow.length}
                            count={entity.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage={t('labelRowsPerPage')}
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
