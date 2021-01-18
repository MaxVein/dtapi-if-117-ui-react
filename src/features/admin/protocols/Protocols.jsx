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
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns/esm';
import { List } from '@material-ui/icons';

import { getProtocolData, filterProtocolsData } from './ProtocolServise';
import ProtocolsRow from './ProtocolsRow';
import SnackbarHandler from '../../../common/components/Snackbar/snackbar';
import styles from '../groups/Groups.module.css';

import { UseLanguage } from '../../../lang/LanguagesContext';

const Protocols = () => {
    const { t } = UseLanguage();

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [protocolsData, setProtocolsData] = useState([]);
    const [testsData, setTestsData] = useState([]);

    const [allProtocolsData, setAllProtocolsData] = useState([]);
    const [protocolsDataToShow, setProtocolsDataToShow] = useState([]);

    const [filter, setFilter] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [snack, setSnack] = useState({ open: false, message: '', type: 'success' });
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(async () => {
        const response = await getProtocolData();
        if (Array.isArray(response)) {
            setTestsData(response[1]);
            setProtocolsData(response[0]);
            setAllProtocolsData(response[0]);
            setLoading(false);
            setSnack({
                open: true,
                message: 'Оберіть період для відображення',
                type: 'info',
            });
        } else {
            setLoading(false);
            setSnack({
                open: true,
                message: response.err,
                type: 'error',
            });
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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

    const showProtocolsData = async () => {
        const newData = [];
        protocolsData.forEach((protocol) => {
            if (protocol.log_date > startDate && protocol.log_date < endDate) {
                newData.push(protocol);
            }
        });
        let studentsIds = [];
        newData.forEach((item) => {
            if (!studentsIds.includes(item.user_id)) studentsIds.push(item.user_id);
        });
        const studResponse = await filterProtocolsData(studentsIds, newData);
        if (Array.isArray(studResponse)) {
            setProtocolsDataToShow(studResponse);
            setSnack({
                open: true,
                message: 'Успішно відфільтровано',
                type: 'success',
            });
        } else {
            setSnack({
                open: true,
                message: response.studResponse,
                type: 'error',
            });
        }
    };

    const fieldsName = [
        t('protocol.table.id'),
        t('protocol.table.student'),
        t('protocol.table.test'),
        t('protocol.table.ip'),
        t('protocol.table.date'),
        t('protocol.table.time'),
    ];
    return loading ? (
        <div className={styles.loader}>
            <CircularProgress />
        </div>
    ) : (
        <div>
            <div className={styles.entityHeader}>
                <Typography
                    component="h2"
                    variant="h4"
                    color="textPrimary"
                    className={styles.entityHeaderTitle}
                >
                    <List fontSize="large" />
                    {t('protocol.title')}
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
                        minDate={startDate}
                        value={endDate}
                        onChange={handleEndDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <Button onClick={showProtocolsData}> {t('protocol.showButton')}</Button>
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
                            ? protocolsDataToShow
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((protocolData) => (
                                      <ProtocolsRow key={uuidv4()} log={protocolData} />
                                  ))
                            : null}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage={t('labelRowsPerPage')}
                    component="div"
                    count={protocolsDataToShow.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <SnackbarHandler snack={snack} setSnack={setSnack} />
            </div>
        </div>
    );
};

export default Protocols;
