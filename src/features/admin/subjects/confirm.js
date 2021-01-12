import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

export default function ConfirmDelete({ id, setDeleteEntity, message }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setDeleteEntity({ delete: true, id: id });
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title="Видалити">
                <DeleteIcon onClick={handleClickOpen} />
            </Tooltip>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{message}</DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Скасувати
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
