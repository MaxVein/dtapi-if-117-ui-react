import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { deleteEntity } from '../../../common/utils';

const ConfirmDelete = ({
    open,
    setShowDelDialog,
    group,
    groupsData,
    setGroupsData,
    setRowsPerPage,
    rowsPerPage,
    page,
    setPage,
    openSnack,
    setOpenSnack,
    snackMes,
    setSnackMes,
}) => {
    const handleClose = () => {
        setShowDelDialog(false);
    };
    const delGroup = (id) => {
        deleteEntity('group', id)
            .then((res) => {
                const updatedList = groupsData.filter((item) => id !== item.group_id);
                setGroupsData(updatedList);
                setShowDelDialog(false);
                setPage(Math.ceil((groupsData.length - 1) / rowsPerPage) - 1);
                setSnackMes('Групу видалено');
                setOpenSnack(true);
            })
            .catch(() => {
                setShowDelDialog(false);
                setSnackMes('Помилка при видаленні');
                setOpenSnack(true);
            });
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
                        handleClose();
                        delGroup(group.group_id);
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
