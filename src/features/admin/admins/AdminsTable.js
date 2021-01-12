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

import { createDataSource, getAdmins, columns } from './AdminsService';
import styles from './Admins.module.css';
import AdminCreationForm from './AdminsCreationForm';
import AdminsTableRow from './AdminTableRow';
import AdminsContext from './AdminsContext';
import SnackbarHandler from '../../../common/snackbar';
import Loader from '../../../components/Loader/Loader';

export default function AdminsTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataSource, setDataSource] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [snack, setSnack] = React.useState({ open: false, message: '', type: 'success' });

    useEffect(() => {
        getAdmins().then((res) => {
            setDataSource(createDataSource(res));
            setLoaded(true);
        });
    }, []);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openModal = () => {
        setOpen(true);
    };

    return (
        <AdminsContext.Provider value={{ dataSource, setDataSource, snack, setSnack }}>
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
                            Адміни
                        </Typography>
                        <Button
                            onClick={openModal}
                            disableElevation
                            variant="contained"
                            color="primary"
                            className={styles.entityHeaderButton}
                        >
                            <AddCircle />
                            Додати Адміна
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
                            component="div"
                            count={dataSource.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <AdminCreationForm
                        open={open}
                        setOpen={setOpen}
                        mode={'Add'}
                        dataSource={dataSource}
                        setDataSource={setDataSource}
                    />
                    <SnackbarHandler snack={snack} setSnack={setSnack} />
                </React.Fragment>
            ) : (
                <Loader />
            )}
        </AdminsContext.Provider>
    );
}
