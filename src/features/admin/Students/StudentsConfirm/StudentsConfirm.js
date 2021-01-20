import React, { useContext } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import TableContext from '../StudentsTable/TableContext';
import PropTypes from 'prop-types';
import classes from './StudentsConfirm.module.css';

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

const StudentsConfirm = ({ student, remove }) => {
    const { t } = UseLanguage();
    const { open, setOpen, messageHandler } = useContext(TableContext);

    return (
        <Paper className={classes.Dialog} elevation={0} variant={'outlined'}>
            <Dialog open={open.open} className={classes.Dialog} fullWidth={false} maxWidth={false}>
                <div className={classes.StudentsConfirm}>
                    <DialogTitle className={classes.Title}>
                        {t('students.remove.title')}
                    </DialogTitle>
                    <DialogContent className={classes.Content}>
                        <PersonAddDisabledIcon color="primary" className={classes.Icon} />
                        <DialogContentText className={classes.Message}>
                            {`${t('students.remove.text')} ${student.student_surname} ${
                                student.student_name
                            }?`}
                        </DialogContentText>
                    </DialogContent>
                    <Divider className={classes.Divider} />
                    <DialogActions className={classes.Actions}>
                        <Button
                            variant={'contained'}
                            className={classes.Button}
                            onClick={() => {
                                setOpen({ open: false });
                                messageHandler(t('students.remove.messages.canceled'), 'warning');
                            }}
                            type="reset"
                        >
                            {t('students.remove.buttons.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            className={classes.Button}
                            onClick={() => {
                                remove(student.user_id);
                            }}
                        >
                            {t('students.remove.buttons.submit')}
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </Paper>
    );
};

export default StudentsConfirm;

StudentsConfirm.propTypes = {
    student: PropTypes.object,
    remove: PropTypes.func,
};
