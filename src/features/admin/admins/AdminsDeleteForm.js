import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';

import styles from './Admins.module.css';
import { deleteAdmin } from './AdminsService';
import AdminsContext from './AdminsContext';
import { UseLanguage } from '../../../lang/LanguagesContext';

function AdminsDeleteForm({ mode, open, setOpen, admin }) {
    const { t } = UseLanguage();
    const { dataSource, setDataSource, setSnack } = useContext(AdminsContext);

    const closeModal = () => {
        setOpen(false);
    };
    const deleteAdminHandler = () => {
        deleteAdmin(id)
            .then((res) => {
                if (res.response === 'ok') {
                    setDataSource(dataSource.filter((tableAdmin) => tableAdmin.id !== admin.id));
                    closeModal();
                    setSnack({ open: true, message: 'Адміна успішно видалено', type: 'success' });
                }
            })
            .catch((err) =>
                setSnack({
                    open: true,
                    message: `На сервері відбулась помилка - ${err}`,
                    type: 'error',
                }),
            );
    };
    return (
        <React.Fragment>
            <Dialog open={open} onClose={closeModal} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">
                    {t('admins.modal.deleteTitle')}: {admin.username}?
                </DialogTitle>
                <DialogActions className={styles.deleteModal}>
                    <Button onClick={closeModal} color="primary">
                        {t('admins.modal.cancelButton')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={deleteAdminHandler}
                        color="primary"
                        autoFocus
                    >
                        {t('admins.modal.submitDeleteButton')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AdminsDeleteForm;
