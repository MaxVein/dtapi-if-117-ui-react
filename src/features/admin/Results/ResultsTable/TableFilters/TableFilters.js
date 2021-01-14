import React, { useContext, useState } from 'react';
import { ResultsServiceApi } from '../../services/ResultsService';
import ResultsContext from '../../ResultsPage/ResultsContext';
import PropTypes from 'prop-types';
import classes from './TableFilters.module.css';

import {
    Card,
    CardContent,
    FormControl,
    Icon,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns/esm';

const TableFilters = ({ results, setResults }) => {
    const { setSnackBar } = useContext(ResultsContext);
    const [dataSource] = useState(results);
    const [ranges] = useState([
        {
            label: 'Всі результати',
            value: 'all',
            icon: 'grading',
        },
        {
            label: 'Найменший результат',
            value: 'min',
            icon: 'trending_down',
        },
        {
            label: 'Максимальний результат',
            value: 'max',
            icon: 'trending_up',
        },
    ]);
    const [range, setRange] = useState('');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const selectRange = (value) => {
        switch (value) {
            case 'min': {
                const newMinResults = ResultsServiceApi.getMinStudentsResults(dataSource);
                setResults(newMinResults);
                setSnackBar({
                    open: true,
                    message: 'Відфільтровано по найменшим результатам студентів',
                    type: 'success',
                });
                break;
            }
            case 'max': {
                const newMaxResults = ResultsServiceApi.getMaxStudentsResults(dataSource);
                setResults(newMaxResults);
                setSnackBar({
                    open: true,
                    message: 'Відфільтровано по найбільшим результатам студентів',
                    type: 'success',
                });
                break;
            }
            case 'all': {
                setResults(dataSource);
                setSnackBar({
                    open: true,
                    message: 'Показано всі результати студентів',
                    type: 'success',
                });
                break;
            }
            default:
                return;
        }
    };

    const selectDate = (date) => {
        setResults((prevState) => {
            const arr = prevState.filter((d) => d.session_date === date);
            if (arr.length) {
                setSnackBar({
                    open: true,
                    message: `Показано всі результати студентів за ${date}`,
                    type: 'success',
                });
                return [...arr];
            } else {
                setSnackBar({
                    open: true,
                    message: `Результати студентів за ${date} відсутні`,
                    type: 'warning',
                });
                return [...dataSource];
            }
        });
    };

    return (
        <Card className={classes.TableFilters}>
            <CardContent className={classes.CardContent}>
                <div className={classes.Results}>
                    <div className={classes.Selector}>
                        <FormControl fullWidth={true} className={classes.FormControl}>
                            <InputLabel
                                classes={{ shrink: 'right: unset;' }}
                                className={classes.Label}
                            >
                                <SwapVertIcon className={classes.SelectorIcon} />
                                Фільтрація по результату
                            </InputLabel>
                            <Select
                                defaultValue={''}
                                placeholder="Виберіть фільтр результату"
                                value={range}
                                className={classes.Select}
                                onChange={(event) => {
                                    setRange(event.target.value);
                                    selectRange(event.target.value);
                                }}
                                disabled={false}
                            >
                                {ranges.map(({ label, value, icon }) => (
                                    <MenuItem key={value + Math.random()} value={value}>
                                        <Icon className={classes.SelectorIconTwo}>{icon}</Icon>
                                        &nbsp; {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className={classes.Date}>
                    <div className={classes.Selector}>
                        <FormControl fullWidth={true} className={classes.FormControl}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    format="yyyy-MM-dd"
                                    margin="normal"
                                    label="Виберіть дату здачі тесту"
                                    value={selectedDate}
                                    onChange={(date) => {
                                        setSelectedDate(format(date, 'yyyy-MM-dd'));
                                        selectDate(format(date, 'yyyy-MM-dd'));
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TableFilters;

TableFilters.propTypes = {
    results: PropTypes.array,
    setResults: PropTypes.func,
};
