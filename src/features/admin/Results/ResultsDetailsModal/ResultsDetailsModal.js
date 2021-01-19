import React, { useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { ResultsServiceApi } from '../services/ResultsService';
import ResultsDetailsByQuestionModal from '../ResultsDetailsByQuestionModal/ResultsDetailsByQuestionModal';
import PropTypes from 'prop-types';
import classes from './ResultsDetailsModal.module.css';

import {
    Button,
    CircularProgress,
    Dialog,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    withStyles,
} from '@material-ui/core';
import MuiTableCell from '@material-ui/core/TableCell';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

const TableCell = withStyles({
    root: {
        borderBottom: 'none',
    },
})(MuiTableCell);

const ResultsDetailsModal = ({
    open,
    setOpen,
    results,
    loading,
    setLoading,
    messageHandler,
    errorHandler,
}) => {
    const { t } = UseLanguage();
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
    const displayedColumns = [
        t('results.detailsModal.table.no'),
        t('results.detailsModal.table.id'),
        t('results.detailsModal.table.text'),
        t('results.detailsModal.table.answer'),
        t('results.detailsModal.table.details'),
    ];
    const [openDetails, setOpenDetails] = useState({
        open: false,
        data: {},
        q_num: '',
    });

    useEffect(() => {
        (async function allQuestions(ids) {
            await getAllQuestions(ids);
        })(data.ids);
        return () => {
            setLoading({
                filter: false,
                table: false,
                detailsModal: true,
                detailsByQuestionModal: true,
            });
        };
    }, [data.ids]);

    const getAllQuestions = async (ids) => {
        const questions = await ResultsServiceApi.fetchAllQuestions(ids);
        if (questions.length) {
            initQuestions(questions);
        } else if (!questions.length) {
            getAllQuestionErrorHandler(false);
        } else if (questions.error) {
            getAllQuestionErrorHandler(true);
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
        setLoading({
            filter: false,
            table: false,
            detailsModal: false,
            detailsByQuestionModal: true,
        });
        messageHandler(t('results.detailsModal.messages.detailsUpload'), 'success');
    };

    const getAllQuestionErrorHandler = (error) => {
        setOpen({ open: false });
        setDataSource([]);
        error
            ? errorHandler(
                  t('results.detailsModal.errors.getDetailsError'),
                  t('results.detailsModal.errors.typeError'),
              )
            : messageHandler(t('results.detailsModal.messages.noDetails'), 'warning');
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
                                    {dataSource.map((item, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            className={classes.TableRow}
                                            key={index + Math.random()}
                                            onClick={() =>
                                                setOpenDetails({
                                                    open: true,
                                                    data: item,
                                                    q_num: Number(index + 1).toString(),
                                                })
                                            }
                                        >
                                            <TableCell
                                                align={'center'}
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell
                                                align={'center'}
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
                                                align={'center'}
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                {+item.true
                                                    ? t('results.detailsModal.table.true')
                                                    : t('results.detailsModal.table.false')}
                                            </TableCell>
                                            <TableCell
                                                align={'center'}
                                                className={
                                                    +item.true ? classes.True : classes.False
                                                }
                                            >
                                                <div className={classes.Actions}>
                                                    <Tooltip
                                                        title={t(
                                                            'results.detailsModal.tooltips.details',
                                                        )}
                                                    >
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                            onClick={() =>
                                                                setOpenDetails({
                                                                    open: true,
                                                                    data: item,
                                                                    q_num: Number(
                                                                        index + 1,
                                                                    ).toString(),
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
                        </TableContainer>
                        <Button
                            variant={'contained'}
                            color="primary"
                            className={classes.Button}
                            onClick={() => {
                                setOpen({ open: false });
                                messageHandler(t('results.detailsModal.messages.close'), 'info');
                            }}
                            type="reset"
                        >
                            {t('results.detailsModal.buttons.close')}
                        </Button>
                        {openDetails.open ? (
                            <ResultsDetailsByQuestionModal
                                open={openDetails.open}
                                q_num={openDetails.q_num}
                                setOpen={setOpenDetails}
                                question={openDetails.data}
                                loading={loading}
                                setLoading={setLoading}
                                messageHandler={messageHandler}
                                errorHandler={errorHandler}
                            />
                        ) : null}
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
    messageHandler: PropTypes.func,
    errorHandler: PropTypes.func,
};
