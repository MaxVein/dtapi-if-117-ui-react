import React, { useEffect, useState } from 'react';
import { ResultsServiceApi } from '../services/ResultsService';
import PropTypes from 'prop-types';
import classes from './ResultsDetailsByQuestionModal.module.css';

import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import GradeIcon from '@material-ui/icons/Grade';
import ExtensionIcon from '@material-ui/icons/Extension';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TextsmsIcon from '@material-ui/icons/Textsms';
import TocIcon from '@material-ui/icons/Toc';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const ResultsDetailsByQuestionModal = ({
    open,
    setOpen,
    q_num,
    question,
    loading,
    setLoading,
    messageHandler,
    errorHandler,
}) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        (async function answersByQuestionId(id) {
            await getAnswersByQuestionId(id);
        })(question.question_id);
    }, [question]);

    const getAnswersByQuestionId = async (id) => {
        const data = await ResultsServiceApi.fetchAnswersByQuestionId(id);
        if (data.length) {
            setAnswers(data);
            setLoading({
                filter: false,
                table: false,
                detailsModal: false,
                detailsByQuestionModal: false,
            });
        } else if (!data.length) {
            setAnswers([]);
            messageHandler('Немає даних щодо деталей даного запитання', 'warning');
            setLoading({
                filter: false,
                table: false,
                detailsModal: false,
                detailsByQuestionModal: false,
            });
            setOpen({ open: false, data: {}, q_num: '' });
        } else if (data.error) {
            setLoading({
                filter: false,
                table: false,
                detailsModal: false,
                detailsByQuestionModal: true,
            });
            setOpen({ open: false, data: {}, q_num: '' });
            errorHandler('Сталася помилка під час отримання деталей тестування! Спробуйте знову');
        }
    };

    const getAnswersText = () => {
        const details = answers.filter((item) => {
            if (!question.answer_ids) {
                return 'Студент не дав відповіді на дане запитання';
            }
            return question.answer_ids.some((i) => i === item.answer_id);
        });

        if (!details.length) {
            if (!question.answer_ids[0]) {
                return 'Студент не дав відповіді на дане запитання';
            }
            return question.answer_ids;
        }
        const toText = details.map((i) => i.answer_text).join(', ');
        return toText;
    };

    return (
        <Paper component="div" elevation={0} variant={'outlined'}>
            <Dialog fullWidth={false} maxWidth={false} className={classes.Dialog} open={open}>
                {loading.detailsByQuestionModal ? (
                    <CircularProgress
                        className={classes.Spinner}
                        color={'primary'}
                        size={80}
                        variant="indeterminate"
                    />
                ) : (
                    <div className={classes.ResultsDetailsByQuestionDialog}>
                        <DialogTitle disableTypography={true} className={classes.Title}>
                            <Typography component="h3" variant="h3">
                                <InfoIcon className={classes.TitleIcon} />
                                Деталі запитання №{q_num} ( Ідентифікатор №{question.question_id} )
                            </Typography>
                        </DialogTitle>
                        <DialogContent className={classes.Content}>
                            <div className={classes.Cards}>
                                <Card className={classes.QuestionCard}>
                                    <CardContent className={classes.QuestionCardContent}>
                                        <h3>
                                            <ContactSupportIcon className={classes.CardIcon} />
                                            Запитання:
                                        </h3>
                                        <div className={classes.Question}>
                                            <h3>
                                                <QuestionAnswerIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                {question.question_text}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={classes.DetailsCard}>
                                    <CardContent className={classes.DetailsCardContent}>
                                        <h3>
                                            <SettingsApplicationsIcon
                                                className={classes.CardIcon}
                                            />
                                            Деталі запитання:
                                        </h3>
                                        <div className={classes.DetailsCardChips}>
                                            <span>
                                                <GradeIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                Рівень: {question.level}
                                            </span>
                                            <span>
                                                <ExtensionIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                Тип: {question.type}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={classes.AnswerCard}>
                                    <CardContent className={classes.AnswerCardContent}>
                                        <h3>
                                            <CheckCircleOutlineIcon className={classes.CardIcon} />
                                            Відповідь студента:
                                        </h3>
                                        <div className={classes.Answer}>
                                            <h3>
                                                <TextsmsIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                {getAnswersText()}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={classes.AnswersCard}>
                                    <h3>
                                        <TocIcon className={classes.CardIcon} />
                                        Варіанти відповіді запитання
                                    </h3>
                                    <CardContent className={classes.AnswersCardContent}>
                                        {answers.map((elem, index) => (
                                            <Card
                                                key={index + Math.random()}
                                                className={classes.SAnswerCard}
                                            >
                                                <h3>
                                                    {index + 1}. {elem.answer_text}
                                                </h3>
                                                <CardContent className={classes.SAnswerCardContent}>
                                                    <span
                                                        className={
                                                            +elem.true_answer
                                                                ? classes.True
                                                                : classes.False
                                                        }
                                                    >
                                                        {+elem.true_answer ? (
                                                            <CheckIcon
                                                                className={classes.CardIcon}
                                                            />
                                                        ) : (
                                                            <ClearIcon
                                                                className={classes.CardIcon}
                                                            />
                                                        )}
                                                        {+elem.true_answer
                                                            ? 'Правильна'
                                                            : 'Неправильна'}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </DialogContent>
                        <div className={classes.Actions}>
                            <Button
                                variant={'contained'}
                                color="primary"
                                className={classes.Button}
                                onClick={() => {
                                    setOpen({ open: false, data: {}, q_num: null });
                                    messageHandler('Закрито', 'info');
                                    setLoading({
                                        filter: false,
                                        table: false,
                                        detailsModal: false,
                                        detailsByQuestionModal: true,
                                    });
                                }}
                                type="reset"
                            >
                                Закрити
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </Paper>
    );
};

export default ResultsDetailsByQuestionModal;

ResultsDetailsByQuestionModal.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    question: PropTypes.object,
    q_num: PropTypes.string,
    loading: PropTypes.object,
    setLoading: PropTypes.func,
    messageHandler: PropTypes.func,
    errorHandler: PropTypes.func,
};
