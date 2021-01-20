import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../../lang/LanguagesContext';
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
    const { t } = UseLanguage();
    const { messageHandler } = useContext(ResultsContext);
    const [dataSource] = useState(results);
    const [ranges] = useState([
        {
            label: `${t('results.filters.labels.all')}`,
            value: 'all',
            icon: 'grading',
        },
        {
            label: `${t('results.filters.labels.min')}`,
            value: 'min',
            icon: 'trending_down',
        },
        {
            label: `${t('results.filters.labels.max')}`,
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
                messageHandler(t('results.filters.messages.min'), 'success');
                break;
            }
            case 'max': {
                const newMaxResults = ResultsServiceApi.getMaxStudentsResults(dataSource);
                setResults(newMaxResults);
                messageHandler(t('results.filters.messages.max'), 'success');
                break;
            }
            case 'all': {
                setResults(dataSource);
                messageHandler(t('results.filters.messages.all'), 'success');
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
                messageHandler(`${t('results.filters.messages.dateSuccess')} ${date}`, 'success');
                return [...arr];
            } else {
                messageHandler(
                    `${t('results.filters.messages.dateFail')} ${date} ${t(
                        'results.filters.messages.noDateResults',
                    )}`,
                    'warning',
                );
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
                                {t('results.filters.labels.titleResultsFilter')}
                            </InputLabel>
                            <Select
                                defaultValue={''}
                                placeholder={t('results.filters.placeholders.resultsFilter')}
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
                                    placeholder={t('results.filters.placeholders.dateFilter')}
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
