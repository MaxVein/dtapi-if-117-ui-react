import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';

import styles from './QuestionDeleteConfirm.module.css';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import QuestionsContext from '../QuestionsContext';

export default function QuestionDeleteConfirm({ mode, open, setOpen, question }) {
    const { t } = UseLanguage();
    const { setDeleted } = React.useContext(QuestionsContext);

    const closeModal = () => {
        setOpen(false);
    };

    function deleteQuestionHandler() {
        setDeleted(() => {
            return {
                status: true,
                id: question.question_id,
            };
        });
    }
    return (
        <Dialog open={open} onClose={closeModal} aria-labelledby="alert-dialog-title">
            <DialogTitle id="alert-dialog-title">{t('questions.modal.deleteTitle')}?</DialogTitle>
            <DialogActions className={styles.deleteModal}>
                <Button onClick={closeModal} color="primary">
                    {t('admins.modal.cancelButton')}
                </Button>
                <Button
                    variant="contained"
                    onClick={deleteQuestionHandler}
                    color="primary"
                    autoFocus
                >
                    {t('admins.modal.submitDeleteButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
