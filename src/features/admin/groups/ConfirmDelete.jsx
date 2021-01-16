import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UseLanguage } from '../../../lang/LanguagesContext';

const ConfirmDelete = ({ open, setShowDelDialog, group, setDeleteGroup }) => {
    const { t } = UseLanguage();

    const handleClose = () => {
        setShowDelDialog(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{t('groups.modal.deleteTitle')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('groups.modal.deleteSubTitle')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    {t('groups.modal.cancelButton')}
                </Button>
                <Button
                    onClick={() => {
                        setShowDelDialog(false);
                        setDeleteGroup({ id: group.group_id, delete: true });
                    }}
                    color="primary"
                    autoFocus
                >
                    {t('groups.modal.submitDeleteButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDelete;
