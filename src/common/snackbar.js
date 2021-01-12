import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export const messages = [];

export default function SnackbarHandler({ snack, setSnack }) {
    const closeSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnack({ open: false });
    };

    return (
        <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
            <Alert elevation={4} variant="filled" onClose={closeSnack} severity={snack.type}>
                {snack.message}
            </Alert>
        </Snackbar>
    );
}
