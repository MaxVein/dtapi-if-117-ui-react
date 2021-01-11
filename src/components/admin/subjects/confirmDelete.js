import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';

export default function DeleteComponent({ id, setDeleteSubject }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setDeleteSubject({ delete: true, id: id });
        setOpen(false);
    };

    return (
        <div>
            <DeleteIcon onClick={handleClickOpen} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
                    {'Ви впевнені що бажаєте видалити предмет?'}
                </DialogTitle>
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
