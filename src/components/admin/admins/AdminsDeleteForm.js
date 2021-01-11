import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';

import './Admins.css';
import { deleteAdmin } from './AdminsService';
import AdminsContext from './AdminsContext';

function AdminsDeleteForm({ mode, open, setOpen, id }) {
    const { dataSource, setDataSource, snack, setSnack } = useContext(AdminsContext);

    const closeModal = () => {
        setOpen(false);
    };
    const deleteAdminHandler = () => {
        deleteAdmin(id)
            .then((res) => {
                if (res.response === 'ok') {
                    setDataSource(dataSource.filter((admin) => admin.id !== id));
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
                <DialogTitle id="alert-dialog-title">Видалити адміна?</DialogTitle>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Скасувати
                    </Button>
                    <Button
                        variant="contained"
                        onClick={deleteAdminHandler}
                        color="primary"
                        autoFocus
                    >
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AdminsDeleteForm;
