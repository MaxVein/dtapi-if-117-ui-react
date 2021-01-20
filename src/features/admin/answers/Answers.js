import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import Loader from '../../../common/components/Loader/Loader';
import { createDataSource, getAnswers, getQuestionById } from './AnswersService';
import AnswersCard from './AnswersCard';
import CreationForm from './CreationForm/AnswersCreationForm';
import styles from './Answers.module.css';

import { UseLanguage } from '../../../lang/LanguagesContext';

export default function Answers() {
    const { t } = UseLanguage();
    const { state } = useLocation();

    const [open, setOpen] = React.useState(false);
    const [snack, setSnack] = React.useState({ open: false, message: '', type: 'success' });
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataSource, setDataSource] = React.useState([]);
    const [question, setQuestion] = React.useState({});
    const [level, setLevel] = React.useState('');
    const [loaded, setLoaded] = React.useState(false);
    const [mode, setMode] = React.useState('');

    useEffect(() => {
        if (state.mode === 'Add') {
            setMode('Add');
            setLoaded(true);
            return null;
        } else {
            getQuestionById(state.id).then((res) => {
                setQuestion(() => {
                    return { ...res[0] };
                });
                setLevel(question.level);
            });
            getAnswers(state.id).then((res) => {
                setDataSource(createDataSource(res));
                setLoaded(true);
            });
        }
    }, []);
    const closeModal = () => {
        setOpen(false);
    };

    const openModal = () => {
        setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            {mode === 'Add' ? (
                <CreationForm mode={state.mode} question={question} />
            ) : loaded ? (
                <React.Fragment>
                    <div className={styles.entityHeader}>
                        <Typography
                            component="h2"
                            variant="h4"
                            color="textPrimary"
                            className={styles.entityHeaderTitle}
                        >
                            <SupervisedUserCircle fontSize="large" />
                            {t('answers.title')}
                        </Typography>
                        <Button
                            onClick={openModal}
                            disableElevation
                            variant="contained"
                            color="primary"
                            className={styles.entityHeaderButton}
                        >
                            <AddCircle />
                            {t('answers.addButton')}
                        </Button>
                    </div>
                    <CreationForm mode={state.mode} question={question} />
                    <Paper elevation={6}>
                        <TableContainer className={styles.entityTableContainer}>
                            <Table stickyHeader className={styles.entityTable}>
                                <TableBody>
                                    {dataSource
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((answer, index) => {
                                            return <AnswersCard key={index} answer={answer} />;
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 15, 25]}
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
