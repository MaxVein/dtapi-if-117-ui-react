import React, { useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import AddCircle from '@material-ui/icons/AddCircle';

import { createDataSource, getAdmins } from './AdminsService';
import './Admins.css';
import AdminCreationForm from './AdminsCreationForm';
import AdminsTableRow from './AdminTableRow';
import AdminsContext from './AdminsContext';
import SnackbarHandler from '../../../common/snackbar';

const columns = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'username', label: "Ім'я", minWidth: 170 },
    {
        id: 'email',
        label: 'Email',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'operations',
        label: 'Операції',
        minWidth: 170,
        align: 'center',
    },
];

export default function AdminsTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dataSource, setDataSource] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getAdmins().then((res) => {
            setDataSource(createDataSource(res));
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
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <AdminsContext.Provider value={{ dataSource, setDataSource }}>
            <React.Fragment>
                <div className="entity-header">
                    <h1 className="entity-title">
                        <SupervisedUserCircle />
                        Адміни
                    </h1>
                    <Button
                        onClick={openModal}
                        disableElevation
                        variant="contained"
                        color="primary"
                    >
                        <AddCircle />
                        Додати Адміна
                    </Button>
                </div>
                <Paper>
                    <TableContainer>
                        <Table aria-label="sticky table">
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
            </React.Fragment>
        </AdminsContext.Provider>
    );
}
