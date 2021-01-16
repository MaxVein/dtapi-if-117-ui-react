import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmDelete = ({ open, setShowDelDialog, group, setDeleteGroup }) => {
    const handleClose = () => {
        setShowDelDialog(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{'Підтвердіть видалення?'}</DialogTitle>
            <DialogContent>
                <DialogContentText>Ви впевнені, що хочети видалити дану групу?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Відмінити
                </Button>
                <Button
                    onClick={() => {
                        setShowDelDialog(false);
                        setDeleteGroup({ id: group.group_id, delete: true });
                    }}
                    color="primary"
                    autoFocus
                >
                    Видалити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDelete;
