import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import { Help, AddCircle } from '@material-ui/icons';

import { createDataSource, getNumberOfQuestions, getQuestions } from '../QuestionsService';
import QuestionsTableRow from './QuestionsTableRow';
import Loader from '../../../../common/components/Loader/Loader';
import styles from './QuestionTable.module.css';

import { UseLanguage } from '../../../../lang/LanguagesContext';

export default function Questions() {
    const { t } = UseLanguage();
    const { state } = useLocation();

    const [open, setOpen] = React.useState(false);
    const [snack, setSnack] = React.useState({ open: false, message: '', type: 'success' });
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataSource, setDataSource] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [deleted, setDeleted] = React.useState({ status: false, id: '' });
    const [added, setAdded] = React.useState({ status: false, data: {} });
    const [updated, setUpdated] = React.useState({ status: false, data: {} });

    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const columns = [
        { id: 'question_id', label: t('questions.table.id'), minWidth: '10%' },
        { id: 'question_text', label: t('questions.table.questionText'), minWidth: '25%' },
        {
            id: 'type',
            label: t('questions.table.type'),
            minWidth: '25%',
            align: 'left',
        },
        {
            id: 'level',
            label: t('questions.table.level'),
            minWidth: '25%',
            align: 'left',
        },
        {
            id: 'operations',
            label: t('questions.table.actions'),
            minWidth: '10%',
            align: 'center',
        },
    ];

    useEffect(() => {
        getNumberOfQuestions(state.id).then((res) => {
            getQuestions(state.id, res.numberOfRecords).then((res) => {
                setDataSource(createDataSource(res));
                setLoaded(true);
            });
        });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            {loaded ? (
                <React.Fragment>
                    <div className={styles.entityHeader}>
                        <Typography
                            className={styles.entityHeaderTitle}
                            component="h2"
                            variant="h4"
                            color="textPrimary"
                        >
                            <Help fontSize="large" />
                            {t('questions.title')}
                        </Typography>
                        <Button
                            className={styles.entityHeaderButton}
                            onClick={openModal}
                            disableElevation
                            variant="contained"
                            color="primary"
                        >
                            <AddCircle />
                            {t('questions.addButton')}
                        </Button>
                    </div>
                    <Paper elevation={6}>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((question, index) => {
                                            return (
                                                <QuestionsTableRow
                                                    key={index}
                                                    question={question}
                                                />
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            labelRowsPerPage={t('labelRowsPerPage')}
                            component="div"
                            count={dataSource.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </React.Fragment>
            ) : (
                <Loader />
            )}
        </>
    );
}
