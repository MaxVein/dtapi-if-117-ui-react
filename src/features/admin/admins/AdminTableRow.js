import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, Button, Tooltip } from '@material-ui/core';

import { Edit, Delete } from '@material-ui/icons';

import AdminCreationForm from './AdminsCreationForm';
import AdminsDeleteForm from './AdminsDeleteForm';

import { UseLanguage } from '../../../lang/LanguagesContext';

const useStyles = makeStyles((theme) => ({
    button: {
        padding: '0.5rem .5rem',
        cursor: 'pointer',
        minWidth: '1rem',
        marginRight: '0.5rem',
    },
}));

export default function AdminsTableRow({ admin }) {
    const { t } = UseLanguage();

    const [edit, setUpdateOpen] = React.useState(false);
    const [del, setDelOpen] = React.useState(false);
    const classes = useStyles();

    const openModal = (mode) => {
        mode === 'Update' ? setUpdateOpen(true) : setDelOpen(true);
    };

    return (
        <React.Fragment>
            <TableRow hover role="checkbox" tabIndex={-1} key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell align="center">
                    <Tooltip title={t('admins.modal.updateTooltip')} arrow>
                        <Button
                            disableElevation
                            variant="contained"
                            className={classes.button}
                            color="primary"
                            onClick={() => openModal('Update')}
                        >
                            <Edit />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t('admins.modal.deleteTooltip')} arrow>
                        <Button
                            onClick={() => openModal('Delete')}
                            disableElevation
                            variant="contained"
                            className={classes.button}
                            color="primary"
                        >
                            <Delete />
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <AdminCreationForm admin={admin} open={edit} setOpen={setUpdateOpen} mode={'Update'} />
            <AdminsDeleteForm
                id={admin.id}
                username={admin.username}
                open={del}
                setOpen={setDelOpen}
                mode={'Delete'}
            />
        </React.Fragment>
    );
}
