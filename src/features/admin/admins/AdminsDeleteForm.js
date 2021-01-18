import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';

import styles from './Admins.module.css';
import AdminsContext from './AdminsContext';
import { UseLanguage } from '../../../lang/LanguagesContext';

function AdminsDeleteForm({ mode, open, setOpen, id, username }) {
    const { t } = UseLanguage();
    const { setDeleted } = React.useContext(AdminsContext);

    const closeModal = () => {
        setOpen(false);
    };

    function deleteAdminHandler() {
        setDeleted(() => {
            return {
                status: true,
                id: id,
            };
        });
    }
    return (
        <Dialog open={open} onClose={closeModal} aria-labelledby="alert-dialog-title">
            <DialogTitle id="alert-dialog-title">
                {t('admins.modal.deleteTitle')}: {username}?
            </DialogTitle>
            <DialogActions className={styles.deleteModal}>
                <Button onClick={closeModal} color="primary">
                    {t('admins.modal.cancelButton')}
                </Button>
                <Button variant="contained" onClick={deleteAdminHandler} color="primary" autoFocus>
                    {t('admins.modal.submitDeleteButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdminsDeleteForm;
