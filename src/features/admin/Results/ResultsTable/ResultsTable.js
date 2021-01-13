import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './ResultsTable.module.css';

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
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import ReportIcon from '@material-ui/icons/Report';

const ResultsTable = ({ results }) => {
    const [dataSource, setDataSource] = useState([]);
    const displayedColumns = [
        'No.',
        'ПІБ',
        'Оцінка',
        'Дата',
        'Початок',
        'Тривалість',
        'Детальніше',
    ];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    useEffect(() => {
        setDataSource(results);
    }, [results]);

    return (
        <div className={classes.Table}>
            {results.length > 0 ? (
                <TableContainer component={Paper}>
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
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {item.student_surname}&nbsp;
                                            {item.student_name}&nbsp;
                                            {item.student_fname}
                                        </TableCell>
                                        <TableCell>{item.result}</TableCell>
                                        <TableCell>{item.session_date}</TableCell>
                                        <TableCell>{item.start_time}</TableCell>
                                        <TableCell>{item.duration}</TableCell>
                                        <TableCell>
                                            <div className={classes.Actions}>
                                                <Tooltip title="Переглянути деталі тестування">
                                                    <Button color="primary" variant="contained">
                                                        <ViewHeadlineIcon
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
                        labelRowsPerPage="Рядків у таблиці"
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
            ) : (
                <div className={classes.Empty}>
                    <ReportIcon className={classes.EmptyIcon} />
                    <h1>Результати відсутні</h1>
                </div>
            )}
        </div>
    );
};

export default ResultsTable;

ResultsTable.propTypes = {
    results: PropTypes.array,
};
