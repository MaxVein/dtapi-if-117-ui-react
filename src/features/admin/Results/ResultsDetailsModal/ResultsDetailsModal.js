import React, { useCallback, useEffect, useState } from 'react';
import { ResultsServiceApi } from '../services/ResultsService';
import PropTypes from 'prop-types';
import classes from './ResultsDetailsModal.module.css';

import {
    Button,
    CircularProgress,
    Dialog,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@material-ui/core';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

const ResultsDetailsModal = ({
    open,
    setOpen,
    results,
    loading,
    setLoading,
    setSnackBar,
    errorHandler,
}) => {
    const [data] = useState({
        results: results,
        questions: JSON.parse(results.questions),
        true_answers: JSON.parse(results.true_answers),
        ids: [
            ...JSON.parse(results.questions).map((i) => {
                return i['question_id'];
            }),
        ],
    });
    const [dataSource, setDataSource] = useState([]);
    const displayedColumns = ['Ідентифікатор', 'Текст запитання', 'Відповідь', 'Детальніше'];

    useEffect(() => {
        (async function allQuestions(ids) {
            await getAllQuestions(ids);
        })(data.ids);
    }, [data.ids]);

    const messageHandler = useCallback(
        (message, type) => {
            setSnackBar({
                open: true,
                message,
                type,
            });
        },
        [setSnackBar],
    );

    const getAllQuestions = async (ids) => {
        const questions = await ResultsServiceApi.fetchAllQuestions(ids);
        if (questions.length) {
            initQuestions(questions);
        } else if (!questions.length) {
            setDataSource([]);
            messageHandler('Деталі про тестування відсутні', 'warning');
            setLoading({ filter: false, table: false, detailsModal: false });
        } else if (questions.error) {
            setLoading({ filter: false, table: false, detailsModal: false });
            errorHandler('Сталася помилка під час отримання деталей тестування! Спробуйте знову');
        }
    };

    const initQuestions = (questions) => {
        const arr = questions.map((item) => {
            const studentInfo = data.true_answers.filter(
                (s) => +s.question_id === +item.question_id,
            );
            const answerData = data.questions.filter((a) => +a.question_id === +item.question_id);
            return Object.assign({}, item, ...studentInfo, ...answerData);
        });
        setDataSource(arr);
        setLoading({ filter: false, table: false, detailsModal: false });
        messageHandler('Деталі про тестування завантажено', 'success');
    };

    return (
        <Paper component="div" elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open}>
                {loading.detailsModal ? (
                    <CircularProgress
                        className={classes.Spinner}
                        color={'primary'}
                        size={80}
                        variant="indeterminate"
                    />
                ) : (
                    <div className={classes.ResultsDetailsDialog}>
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
                                    {dataSource.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                {item.question_id}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                {item.question_text}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                {+item.true ? 'Правильна' : 'Неправильна'}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                <div className={classes.Actions}>
                                                    <Tooltip title="Переглянути деталі питання">
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
                        </TableContainer>
                        <Button
                            variant={'contained'}
                            color="primary"
                            className={classes.Button}
                            onClick={() => {
                                setOpen({ open: false });
                                messageHandler('Закрито', 'info');
                                setLoading({ filter: false, table: false, detailsModal: true });
                            }}
                            type="reset"
                        >
                            Закрити
                        </Button>
                    </div>
                )}
            </Dialog>
        </Paper>
    );
};

export default ResultsDetailsModal;

ResultsDetailsModal.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    results: PropTypes.object,
    loading: PropTypes.object,
    setLoading: PropTypes.func,
    setSnackBar: PropTypes.func,
    errorHandler: PropTypes.func,
};
