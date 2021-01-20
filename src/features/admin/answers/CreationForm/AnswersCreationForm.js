import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    FormGroup,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import styles from './AnswersCreationForm.module.css';
import { UseLanguage } from '../../../../lang/LanguagesContext';

const useStyles = makeStyles((theme) => ({
    row: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    formControl: {
        width: '45%',
    },
}));

export default function CreationForm({ mode, question }) {
    const { t } = UseLanguage();

    const classes = useStyles();
    const types = [
        { num: 1, text: 'Simple choice' },
        { num: 2, text: 'Multi-choice' },
        { num: 3, text: 'Text field' },
        { num: 4, text: 'Number range' },
    ];
    const levels = [...Array(20).keys()];
    const intialFormValues = {
        question_text: mode === 'Add' ? '' : question.question_text,
        attachment: mode === 'Add' ? '' : question.attachment,
        type: mode === 'Add' ? '' : question.type,
        level: mode === 'Add' ? '' : question.level,
    };
    const addValidationSchema = Yup.object().shape({
        question_text: Yup.string()
            .min(5, t('validation.tooShortName'))
            .max(70, t('validation.tooLongName'))
            .required(t('validation.requiredField')),
        attachment: Yup.string().required(t('validation.requiredField')),
        type: Yup.string().required(t('validation.requiredField')),
        level: Yup.string().required(t('validation.passwordNeedConfirmation')),
    });
    const editValidationSchema = Yup.object().shape({
        question_text: Yup.string()
            .min(5, t('validation.tooShortName'))
            .max(70, t('validation.tooLongName')),
        attachment: Yup.string(),
        type: Yup.string(),
        level: Yup.string(),
    });
    return (
        <React.Fragment>
            <Card elevation={6}>
                <CardHeader
                    title={
                        mode === 'Add'
                            ? t('questions.form.addTitle')
                            : t('questions.form.updateTitle')
                    }
                />
                <CardContent>
                    <Formik
                        initialValues={intialFormValues}
                        validationSchema={
                            mode === 'Add' ? addValidationSchema : editValidationSchema
                        }
                        onSubmit={(values) => submit(values)}
                    >
                        {({
                            isValid,
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="username"
                                    label={t('questions.form.questionText')}
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.question_text}
                                    helperText={touched.question_text ? errors.question_text : ''}
                                    error={touched.question_text && Boolean(errors.question_text)}
                                />
                                <TextField
                                    margin="dense"
                                    id="email"
                                    label={t('questions.form.attachment')}
                                    type="text"
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.attachment}
                                    helperText={touched.attachment ? errors.attachment : ''}
                                    error={touched.attachment && Boolean(errors.attachment)}
                                />
                                <FormGroup className={classes.row} fullWidth row={true}>
                                    <FormControl
                                        helperText={touched.level ? errors.level : ''}
                                        error={touched.level && Boolean(errors.level)}
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="type-label">
                                            {t('questions.form.type')}
                                        </InputLabel>
                                        <Select
                                            variant={mode === 'Add' ? 'standard' : 'filled'}
                                            labelId="type-label"
                                            name="type"
                                            id="type-select"
                                            label={t('questions.form.type')}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.type}
                                            helperText={touched.type ? errors.type : ''}
                                            error={touched.type && Boolean(errors.type)}
                                        >
                                            {types.map((type, index) => {
                                                return (
                                                    <MenuItem key={index} value={type.num}>
                                                        {type.text}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        helperText={touched.level ? errors.level : ''}
                                        error={touched.level && Boolean(errors.level)}
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="level-label">
                                            {t('questions.form.level')}
                                        </InputLabel>
                                        <Select
                                            variant={mode === 'Add' ? 'standard' : 'filled'}
                                            labelId="level-label"
                                            name="level"
                                            id="level-select"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.level}
                                        >
                                            {levels.map((level, index) => {
                                                return (
                                                    <MenuItem key={index} value={level}>
                                                        {level}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </FormGroup>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
