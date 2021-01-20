import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentTextField,
    FormControl,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import styles from './QuestionsEditDialog.module.css';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import QuestionsContext from '../QuestionsContext';

const useStyles = makeStyles({
    DialogContent: {
        '&:first-child': {
            paddingTop: '0',
        },
    },
    DialogActions: {
        padding: '1rem',
    },
});

export default function QuestionEditDialog({ open, setOpen, mode, question }) {
    const { t } = UseLanguage();
    const { setUpdated } = React.useContext(QuestionsContext);
    const classes = useStyles();

    const levels = [...Array(20).keys()];
    const intialFormValues = {
        question_text: question.question_text,
        level: question.level,
    };
    const editValidationSchema = Yup.object().shape({
        question_text: Yup.string(),
        level: Yup.string(),
    });
    const closeModal = () => {
        setOpen(false);
    };

    const submit = (values) => {
        setUpdated({
            status: true,
            closeModal: () => closeModal(),
            data: {
                id: question.question_id,
                values: { ...values },
                intialFormValues: { ...intialFormValues },
            },
        });
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={closeModal} aria-labelledby="simple-dialog-title">
                <DialogTitle className={styles.entityTitle}>
                    {t('questions.form.updateTitle')}
                </DialogTitle>
                <Formik
                    initialValues={intialFormValues}
                    validationSchema={mode === 'Add' ? addValidationSchema : editValidationSchema}
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
                            <DialogContent className={classes.DialogContent}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="question_text"
                                    label={t('questions.form.questionText')}
                                    multiline
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.question_text}
                                    helperText={touched.question_text ? errors.question_text : ''}
                                    error={touched.question_text && Boolean(errors.question_text)}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="level-label">
                                        {t('questions.form.level')}
                                    </InputLabel>
                                    <Select
                                        labelId="level-label"
                                        name="level"
                                        id="level-select"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.level}
                                    >
                                        {levels.map((level, index) => {
                                            return (
                                                <MenuItem key={index} value={level + 1}>
                                                    {level + 1}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    {errors.level && touched.level ? (
                                        <div>{errors.level}</div>
                                    ) : null}
                                </FormControl>
                            </DialogContent>
                            <DialogActions className={classes.DialogActions}>
                                <Button onClick={closeModal}>
                                    {t('admins.modal.cancelButton')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    disableElevation
                                    variant="contained"
                                    color="primary"
                                >
                                    {t('questions.modal.submitUpdateButton')}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </React.Fragment>
    );
}
