import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { getEntityData } from '../../../common/utils';

import '../../../styles/app.scss';

const Protocols = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [protocolsData, setProtocolsData] = useState([]);
    const [allProtocolsData, setAllProtocolsData] = useState([]);

    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMes, setSnackMes] = useState('');

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async function fetchData() {
            const requests = [
                getEntityData('Group', source),
                getEntityData('speciality', source),
                getEntityData('faculty', source),
            ];
            const response = await Promise.all(requests);
            let specialities = [],
                faculties = [];
            response[1].data.forEach((item) =>
                specialities.push({
                    speciality_name: item.speciality_name,
                    speciality_id: item.speciality_id,
                }),
            );
            setSpecialityData(specialities);
            response[2].data.forEach((item) =>
                faculties.push({ faculty_name: item.faculty_name, faculty_id: item.faculty_id }),
            );
            setFacultyData(faculties);
            const newData = genereteTableData(response);
            setGroupsData(newData);
            setAllGroupsData(newData);
            setLoading(false);
        })();
        return () => {
            source.cancel();
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        console.log(event);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log(event.target.value);
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const genereteTableData = (data) => {
        const newData = data[0].data;
        newData.map((item) => {
            data[1].data.map((elem) => {
                if (item.speciality_id === elem.speciality_id) {
                    item.speciality_name = elem.speciality_name;
                }
            });
            data[2].data.map((elem) => {
                if (item.faculty_id === elem.faculty_id) {
                    item.faculty_name = elem.faculty_name;
                }
            });
        });
        return newData;
    };

    const dialogOpenHandler = () => {
        setOpen(true);
    };
    const setAllGroupData = () => {
        setGroupsData(allGroupsData);
    };
    const filterByFaculty = () => {
        setFilter(true);
        setIsFacFilter(true);
        const newData = [];
        facultyData.forEach((item) => {
            newData.push(item.faculty_name);
        });
        setFilterData(newData);
    };

    const filterBySpec = () => {
        setFilter(true);
        const newData = [];
        specialityData.forEach((item) => {
            newData.push(item.speciality_name);
        });
        setFilterData(newData);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const fieldsName = ['№', 'Шифр групи', 'Спеціальність', 'Факультет', 'Дії'];
    return loading ? (
        <div className="loader">
            <CircularProgress />
        </div>
    ) : (
        <div
            className="groups"
            style={{
                width: '90%',
                margin: 'auto',
            }}
        >
            <div className="header">
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Групи і студенти
                </Typography>
                <Button color="primary" onClick={dialogOpenHandler}>
                    Додати групу
                </Button>
            </div>

            <div>
                <Button variant="outlined" startIcon={<SearchIcon />} onClick={filterBySpec}>
                    Перелік протоколів по тесту
                </Button>
                <Button variant="outlined" startIcon={<SearchIcon />} onClick={setAllGroupData}>
                    Перелік всіх протоколів
                </Button>
            </div>
            <div style={{ boxShadow: '0.5rem 1rem 2rem gray' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {fieldsName.map((elem) => (
                                <TableCell key={uuidv4()}>{elem}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {groupsData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((groupData) => (
                                <GroupRow
                                    groupData={groupData}
                                    key={uuidv4()}
                                    specialityData={specialityData}
                                    facultyData={facultyData}
                                    setGroupsData={setGroupsData}
                                    groupsData={groupsData}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    openSnack={openSnack}
                                    setOpenSnack={setOpenSnack}
                                    snackMes={snackMes}
                                    setSnackMes={setSnackMes}
                                />
                            ))} */}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={groupsData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
            {/* <GroupFilter
                setFilter={setFilter}
                open={filter}
                data={filterData}
                setGroupsData={setGroupsData}
                groupsData={groupsData}
                isFacFilter={isFacFilter}
                allGroupsData={allGroupsData}
                setIsFacFilter={setIsFacFilter}
                openSnack={openSnack}
                setOpenSnack={setOpenSnack}
                snackMes={snackMes}
                setSnackMes={setSnackMes}
            /> */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnack}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
                message={snackMes}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseSnack}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </div>
    );
};

export default Protocols;
