import React from 'react';
import PropTypes from 'prop-types';
import classes from './StudentsConfirm.module.css';
import { UseLanguage } from '../../../../lang/LanguagesContext';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Paper,
} from '@material-ui/core';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

const StudentsConfirm = ({ show, hide, student, remove, setSnackBar }) => {
    const { t } = UseLanguage();

    const cancel = () => {
        hide({ open: false });
        setSnackBar({ open: true, message: 'Скасовано' });
    };

    const confirm = () => {
        hide({ open: false });
        remove(student.user_id);
    };

    return (
        <Paper className={classes.Dialog} elevation={0} variant={'outlined'}>
            <Dialog open={show} className={classes.Dialog} fullWidth={false} maxWidth={false}>
                <div className={classes.StudentsConfirm}>
                    <DialogTitle className={classes.Title}>
                        {t('students.modal.deleteTitle')}
                    </DialogTitle>
                    <DialogContent className={classes.Content}>
                        <PersonAddDisabledIcon className={classes.Icon} />
                        <DialogContentText className={classes.Message}>
                            {`${t('students.modal.deleteSubTitle')} ${student.student_surname} ${
                                student.student_name
                            }?`}
                        </DialogContentText>
                    </DialogContent>
                    <Divider className={classes.Divider} />
                    <DialogActions className={classes.Actions}>
                        <Button
                            variant={'contained'}
                            className={classes.Button}
                            onClick={() => cancel()}
                            type="reset"
                        >
                            {t('students.modal.cancelButton')}
                        </Button>
                        <Button className={classes.Button} onClick={() => confirm()} type="submit">
                            {t('students.modal.submitAddButton')}
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </Paper>
    );
};

export default StudentsConfirm;

StudentsConfirm.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    student: PropTypes.object,
    remove: PropTypes.func,
    setSnackBar: PropTypes.func,
};
