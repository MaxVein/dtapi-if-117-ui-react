import React from 'react';
import classes from './Alert.module.css';
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
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

const Alert = ({ show, message, type, hide }) => {
    return (
        <Paper className={classes.Dialog} elevation={0} variant={'outlined'}>
            <Dialog open={show} className={classes.Dialog} fullWidth={false} maxWidth={false}>
                <div className={classes.Alert}>
                    <DialogTitle className={classes.DialogTitle}>{type}</DialogTitle>
                    <DialogContent className={classes.DialogContent}>
                        {type === ('Помилка' || 'Error') ? (
                            <ErrorIcon color="primary" className={classes.Icon} />
                        ) : (
                            <WarningIcon color="primary" className={classes.Icon} />
                        )}
                        <DialogContentText className={classes.Message}>{message}</DialogContentText>
                    </DialogContent>
                    <Divider className={classes.Divider} />
                    <DialogActions className={classes.Actions}>
                        <Button
                            variant={'contained'}
                            className={classes.Button}
                            onClick={() => hide({ error: false })}
                            type="reset"
                        >
                            Закрити
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </Paper>
    );
};

export default Alert;
