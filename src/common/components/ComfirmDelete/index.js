import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { UseLanguage } from '../../../lang/LanguagesContext';

export default function ConfirmDelete({ id, setDeleteEntity, message }) {
    const { t } = UseLanguage();
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
            <Tooltip title={t('subjects.modal.submitDeleteButton')}>
                <DeleteIcon onClick={handleClickOpen} />
            </Tooltip>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{message}</DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        {t('subjects.modal.cancelButton')}
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        {t('subjects.modal.submitDeleteButton')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
