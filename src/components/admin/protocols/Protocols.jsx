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
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns/esm';
import ProtocolsRow from './ProtocolsRow';
import '../../../styles/app.scss';

const Protocols = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [protocolsData, setProtocolsData] = useState([]);
    const [testsData, setTestsData] = useState([]);

    const [allProtocolsData, setAllProtocolsData] = useState([]);
    const [protocolsDataToShow, setProtocolsDataToShow] = useState([]);

    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMes, setSnackMes] = useState('');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async function fetchData() {
            const requests = [getEntityData('log', source), getEntityData('test', source)];
            const response = await Promise.all(requests);
            let tests = [];
            response[1].data.forEach((item) =>
                tests.push({
                    test_name: item.test_name,
                    test_id: item.test_id,
                }),
            );
            setTestsData(tests);
            const newData = genereteTableData(response);
            setProtocolsData(newData);
            setAllProtocolsData(newData);
            setLoading(false);
        })();
        return () => {
            source.cancel();
        };
    }, []);

    const genereteTableData = (data) => {
        const newData = data[0].data;
        newData.map((item) => {
            data[1].data.map((elem) => {
                if (item.test_id === elem.test_id) {
                    item.test_name = elem.test_name;
                }
            });
        });
        return newData;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log(event.target.value);
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const dialogOpenHandler = () => {
        setOpen(true);
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

    const handleStartDateChange = (date) => {
        setStartDate(format(date, 'yyyy-MM-dd'));
    };
    const handleEndDateChange = (date) => {
        setEndDate(format(date, 'yyyy-MM-dd'));
    };

    const showProtocolsData = () => {
        const newData = [];
        protocolsData.forEach(async (protocol) => {
            if (protocol.log_date > startDate && protocol.log_date < endDate) {
                newData.push(protocol);
            }
        });
        setProtocolsDataToShow(newData);
    };

    const fieldsName = ['ID користувача', 'Студент', 'Тест', 'IP-адреса', 'Дата', 'Час'];
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
                    Протокол
                </Typography>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-start">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={startDate}
                        onChange={handleStartDateChange}
                        spacing={3}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={endDate}
                        onChange={handleEndDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <Button onClick={showProtocolsData}>Вивести дані</Button>
                </Grid>
            </MuiPickersUtilsProvider>

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
                        {protocolsDataToShow.length
                            ? protocolsData
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((protocolData) => (
                                      <ProtocolsRow key={uuidv4()} log={protocolData} />
                                  ))
                            : null}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={protocolsDataToShow.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
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
