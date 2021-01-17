import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import AddCircle from '@material-ui/icons/AddCircle';

import {
    createDataSource,
    getAdmins,
    deleteModeSubmit,
    updateModeSubmit,
    addModeSubmit,
} from './AdminsService';
import styles from './Admins.module.css';
import AdminCreationForm from './AdminsCreationForm';
import AdminsTableRow from './AdminTableRow';
import SnackbarHandler from '../../../common/components/Snackbar/snackbar';
import Loader from '../../../common/components/Loader/Loader';

import AdminsContext from './AdminsContext';
import { UseLanguage } from '../../../lang/LanguagesContext';

export default function AdminsTable() {
    const { t } = UseLanguage();
    const [open, setOpen] = React.useState(false);
    const [snack, setSnack] = React.useState({ open: false, message: '', type: 'success' });
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataSource, setDataSource] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [deleted, setDeleted] = React.useState({ status: false, id: '' });
    const [added, setAdded] = React.useState({ status: false, data: {} });
    const [updated, setUpdated] = React.useState({ status: false, data: {} });

    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const columns = [
        { id: 'id', label: t('admins.table.id'), minWidth: '25%' },
        { id: 'username', label: t('admins.table.name'), minWidth: '25%' },
        {
            id: 'email',
            label: t('admins.table.email'),
            minWidth: '25%',
            align: 'left',
        },
        {
            id: 'operations',
            label: t('admins.table.actions'),
            minWidth: '10%',
            align: 'center',
        },
    ];

    useEffect(() => {
        getAdmins().then((res) => {
            setDataSource(createDataSource(res));
            setLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (deleted.status) {
            deleteModeSubmit(deleted.id, setSnack, setDataSource, t, closeModal);
        }
    }, [deleted]);

    useEffect(() => {
        if (updated.status) {
            updateModeSubmit(updated.data, setSnack, setDataSource, t, updated.closeModal);
        }
    }, [updated]);

    useEffect(() => {
        if (added.status) {
            addModeSubmit(added.data, setSnack, setDataSource, t, closeModal);
        }
    }, [added]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <AdminsContext.Provider value={{ setAdded, setUpdated, setDeleted, closeModal }}>
            {loaded ? (
                <React.Fragment>
                    <div className={styles.entityHeader}>
                        <Typography
                            component="h2"
                            variant="h4"
                            color="textPrimary"
                            className={styles.entityHeaderTitle}
                        >
                            <SupervisedUserCircle fontSize="large" />
                            {t('admins.title')}
                        </Typography>
                        <Button
                            onClick={openModal}
                            disableElevation
                            variant="contained"
                            color="primary"
                            className={styles.entityHeaderButton}
                        >
                            <AddCircle />
                            {t('admins.addButton')}
                        </Button>
                    </div>
                    <Paper elevation={6}>
                        <TableContainer className={styles.entityTableContainer}>
                            <Table stickyHeader className={styles.entityTable}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((admin) => {
                                            return <AdminsTableRow key={admin.id} admin={admin} />;
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            labelRowsPerPage={t('labelRowsPerPage')}
                            component="div"
                            count={dataSource.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <AdminCreationForm open={open} setOpen={setOpen} mode={'Add'} />
                    <SnackbarHandler snack={snack} setSnack={setSnack} />
                </React.Fragment>
            ) : (
                <Loader />
            )}
        </AdminsContext.Provider>
    );
}
