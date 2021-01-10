import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default function SnackbarHandler(message, type) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert elevation={6} variant="filled" onClose={handleClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>
    );
}
