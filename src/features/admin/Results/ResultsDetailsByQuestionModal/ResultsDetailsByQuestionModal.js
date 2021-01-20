import React, { useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
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
    const { t } = UseLanguage();
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        (async function answersByQuestionId(id) {
            await getAnswersByQuestionId(id);
        })(question.question_id);
        return () => {
            setLoading({
                filter: false,
                table: false,
                detailsModal: false,
                detailsByQuestionModal: true,
            });
        };
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
            messageHandler(t('results.detailsByQuestion.messages.detailsUpload'), 'success');
        } else if (!data.length) {
            getAnswersByQuestionIdErrorHandler(false);
        } else if (data.error) {
            getAnswersByQuestionIdErrorHandler(true);
        }
    };

    const getQuestionTypeText = (type) => {
        switch (type) {
            case '1': {
                return t('results.detailsByQuestion.types.first');
            }
            case '2': {
                return t('results.detailsByQuestion.types.second');
            }
            case '3': {
                return t('results.detailsByQuestion.types.third');
            }
            case '4': {
                return t('results.detailsByQuestion.types.fourth');
            }
        }
    };

    const getAnswersText = () => {
        const details = answers.filter((item) => {
            if (!question.answer_ids) {
                return t('results.detailsByQuestion.texts.noStudentAnswer');
            }
            return question.answer_ids.some((i) => i === item.answer_id);
        });

        if (!details.length) {
            if (!question.answer_ids[0]) {
                return t('results.detailsByQuestion.texts.noStudentAnswer');
            }
            return question.answer_ids;
        }
        const toText = details.map((i) => i.answer_text).join(', ');
        return toText;
    };

    const getAnswersByQuestionIdErrorHandler = (error) => {
        setOpen({ open: false, data: {}, q_num: '' });
        setAnswers([]);
        error
            ? errorHandler(
                  t('results.detailsByQuestion.errors.getDetailsError'),
                  t('results.detailsByQuestion.errors.typeError'),
              )
            : messageHandler(t('results.detailsByQuestion.messages.noDetails'), 'warning');
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
                                {`${t('results.detailsByQuestion.labels.details')}${q_num} ( ${t(
                                    'results.detailsByQuestion.labels.id',
                                )}${question.question_id} )`}
                            </Typography>
                        </DialogTitle>
                        <DialogContent className={classes.Content}>
                            <div className={classes.Cards}>
                                <Card className={classes.QuestionCard}>
                                    <CardContent className={classes.QuestionCardContent}>
                                        <h3>
                                            <ContactSupportIcon className={classes.CardIcon} />
                                            {t('results.detailsByQuestion.labels.question')}
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
                                            {t('results.detailsByQuestion.labels.info')}
                                        </h3>
                                        <div className={classes.DetailsCardChips}>
                                            <span>
                                                <GradeIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                {t('results.detailsByQuestion.labels.level')}{' '}
                                                {question.level}
                                            </span>
                                            <span>
                                                <ExtensionIcon
                                                    color="primary"
                                                    className={classes.CardIcon}
                                                />
                                                {t('results.detailsByQuestion.labels.type')}{' '}
                                                {getQuestionTypeText(question.type)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={classes.AnswerCard}>
                                    <CardContent className={classes.AnswerCardContent}>
                                        <h3>
                                            <CheckCircleOutlineIcon className={classes.CardIcon} />
                                            {t('results.detailsByQuestion.labels.answer')}
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
                                        {t('results.detailsByQuestion.labels.options')}
                                    </h3>
                                    <CardContent className={classes.AnswersCardContent}>
                                        {answers.map((elem, index) => (
                                            <Card
                                                key={index + Math.random()}
                                                className={classes.SAnswerCard}
                                            >
                                                <div className={classes.SAnswerCardHeader}>
                                                    <h3>
                                                        {index + 1}. {elem.answer_text}
                                                    </h3>
                                                </div>
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
                                                            ? t(
                                                                  'results.detailsByQuestion.labels.true',
                                                              )
                                                            : t(
                                                                  'results.detailsByQuestion.labels.false',
                                                              )}
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
                                    messageHandler(
                                        t('results.detailsByQuestion.messages.close'),
                                        'info',
                                    );
                                }}
                                type="reset"
                            >
                                {t('results.detailsByQuestion.buttons.close')}
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
