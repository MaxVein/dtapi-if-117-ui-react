import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import ResultsContext from '../ResultsPage/ResultsContext';
import ResultsDetailsModal from '../ResultsDetailsModal/ResultsDetailsModal';
import TableSearch from './TableSearch/TableSearch';
import PropTypes from 'prop-types';
import classes from './ResultsTable.module.css';

import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Icon,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import ReportIcon from '@material-ui/icons/Report';

const ResultsTable = ({ results }) => {
    const { t } = UseLanguage();
    const [chips] = useState([
        { name: JSON.parse(localStorage.getItem('group_name')), icon: 'group' },
        { name: JSON.parse(localStorage.getItem('subject_name')), icon: 'playlist_add_check' },
        { name: JSON.parse(localStorage.getItem('test_name')), icon: 'subject' },
    ]);
    const { loading, setLoading, messageHandler, errorHandler } = useContext(ResultsContext);
    const [dataSource, setDataSource] = useState([]);
    const displayedColumns = [
        t('results.table.no'),
        t('results.table.fullname'),
        t('results.table.mark'),
        t('results.table.date'),
        t('results.table.start'),
        t('results.table.duration'),
        t('results.table.details'),
    ];
    const [open, setOpen] = useState({
        open: false,
        data: {},
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setDataSource(results);
    }, [results]);

    useEffect(() => {
        const filteredData = getFilteredData(results);
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
                item['student_fname'].toLowerCase().includes(search.toLowerCase())
            );
        });
    };

    return (
        <div className={classes.Table}>
            {chips.length ? (
                <div className={classes.Info}>
                    {chips.map((chip, index) => (
                        <Chip
                            key={index}
                            className={classes.Chip}
                            color="primary"
                            icon={<Icon>{chip.icon}</Icon>}
                            label={chip.name}
                        />
                    ))}
                </div>
            ) : null}
            {results.length > 0 ? (
                <>
                    <TableSearch onSearch={(search) => setSearch(search)} />
                    <TableContainer className={classes.TableContainer} component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {displayedColumns.map((column, index) => (
                                        <TableCell
                                            align={'center'}
                                            key={column + index + Math.random()}
                                        >
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataSource
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={index + Math.random()}
                                        >
                                            <TableCell align={'center'}>{index + 1}</TableCell>
                                            <TableCell align={'center'}>
                                                {item.student_surname}&nbsp;
                                                {item.student_name}&nbsp;
                                                {item.student_fname}
                                            </TableCell>
                                            <TableCell align={'center'}>{item.result}</TableCell>
                                            <TableCell align={'center'}>
                                                {item.session_date}
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                {item.start_time}
                                            </TableCell>
                                            <TableCell align={'center'}>{item.duration}</TableCell>
                                            <TableCell align="center">
                                                <div className={classes.Actions}>
                                                    <Tooltip
                                                        title={t('results.table.tooltips.details')}
                                                    >
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                            onClick={() =>
                                                                setOpen({
                                                                    open: true,
                                                                    data: item,
                                                                })
                                                            }
                                                        >
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
                            labelRowsPerPage={t('labelRowsPerPage')}
                            className={classes.TablePaginator}
                            rowsPerPageOptions={[7, 10, 15, 20, 25, 30, 40, 50, 100]}
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
                    <h1>{t('results.table.noResults')}</h1>
                </div>
            )}
            {open.open ? (
                <ResultsDetailsModal
                    open={open.open}
                    setOpen={setOpen}
                    results={open.data}
                    loading={loading}
                    setLoading={setLoading}
                    messageHandler={messageHandler}
                    errorHandler={errorHandler}
                />
            ) : null}
        </div>
    );
};

export default ResultsTable;

ResultsTable.propTypes = {
    results: PropTypes.array,
};
