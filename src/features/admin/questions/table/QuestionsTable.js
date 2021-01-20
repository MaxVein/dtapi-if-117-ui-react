import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Button,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { Help, AddCircle } from '@material-ui/icons';

import QuestionsTableRow from './QuestionsTableRow';
import Loader from '../../../../common/components/Loader/Loader';
import styles from './QuestionTable.module.css';

import {
    createDataSource,
    getNumberOfQuestions,
    getQuestions,
    deleteModeSubmit,
    updateModeSubmit,
} from '../QuestionsService';
import SnackbarHandler from '../../../../common/components/Snackbar/snackbar';
import QuestionsContext from '../QuestionsContext';
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
    const [added, setAdded] = React.useState({ status: false, data: {} });
    const [deleted, setDeleted] = React.useState({ status: false, id: '' });
    const [updated, setUpdated] = React.useState({ status: false, data: {} });

    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const columns = [
        { id: 'question_id', label: t('questions.table.id'), minWidth: '15%' },
        { id: 'question_text', label: t('questions.table.questionText'), minWidth: '15%' },
        {
            id: 'type',
            label: t('questions.table.type'),
            minWidth: '20%',
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
            minWidth: '25%',
            align: 'center',
        },
    ];

    useEffect(() => {
        getNumberOfQuestions(state.id).then((res) => {
            getQuestions(state.id, res.numberOfRecords).then((res) => {
                if (res.response) {
                    setSnack({ open: true, message: 'Питань немає', type: 'info' });
                    return null;
                }
                setDataSource(createDataSource(res));
                setLoaded(true);
            });
        });
    }, []);

    useEffect(() => {
        if (deleted.status) {
            deleteModeSubmit(deleted.id, setSnack, setDataSource, t, closeModal);
        }
    }, [deleted]);

    useEffect(() => {
        if (updated.status) {
            updateModeSubmit(updated.data, setSnack, setDataSource, t, updated.closeModal);
        }
    }, [updated]);

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
                <QuestionsContext.Provider value={{ setAdded, setUpdated, setDeleted, closeModal }}>
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
                        <Tooltip title={t('questions.messages.addTooltip')} arrow>
                            <Button
                                className={styles.entityHeaderButton}
                                onClick={openModal}
                                disableElevation
                                variant="contained"
                                color="primary"
                            >
                                <Link
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        color: 'white',
                                    }}
                                    to={{
                                        pathname: '/admin/subjects/tests/answers',
                                        state: {
                                            mode: 'Add',
                                        },
                                    }}
                                >
                                    <AddCircle />
                                    <span>{t('questions.addButton')}</span>
                                </Link>
                            </Button>
                        </Tooltip>
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
                    <SnackbarHandler snack={snack} setSnack={setSnack} />
                </QuestionsContext.Provider>
            ) : (
                <Loader />
            )}
        </>
    );
}
