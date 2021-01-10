import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

import TableHead from '@material-ui/core/TableHead';
import { Button } from '@material-ui/core';

import TableRow from '@material-ui/core/TableRow';
import SpecialityViewList from './SpecialityViewList';
import SpecialityAddDialig from './SpecialityAddDialog';

import { getEntityData } from '../../../common/utils';
import axios from 'axios';

const SpecialityView = () => {
    const [specialityDates, setSpecialityDate] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);

    const headerName = ['ID', 'Спеціальність', 'Код', 'Дія'];

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function fetchData() {
            const specialityDate = await getEntityData('Speciality', source);
            setSpecialityDate(specialityDate.data);
        }

        fetchData();
        return () => {
            source.cancel();
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const styles = {
        btn: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '1rem',
        },
    };
    const dialogOpenHandler = () => {
        setOpen(true);
    };

    return (
        <div>
            <div style={styles.btn}>
                <h2>Спеціальності</h2>
                <Button onClick={dialogOpenHandler} variant="contained" color="primary">
                    Добавити спеціальність
                </Button>
            </div>
            <div style={{ boxShadow: '0.5rem 1rem 2rem gray' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {headerName.map((column) => (
                                <TableCell key={column + 1}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {specialityDates
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((speciality) => (
                                <SpecialityViewList
                                    speciality={speciality}
                                    key={speciality.speciality_id}
                                    setOpen={setOpen}
                                    open={open}
                                    specialityDates={specialityDates}
                                    setSpecialityDate={setSpecialityDate}
                                />
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={specialityDates.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
            <SpecialityAddDialig
                specialityDates={specialityDates}
                setSpecialityDate={setSpecialityDate}
                setOpen={setOpen}
                open={open}
            />
        </div>
    );
};
export default SpecialityView;
