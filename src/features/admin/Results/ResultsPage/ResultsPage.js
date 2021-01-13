import React, { useCallback, useState } from 'react';
import { ResultsServiceApi } from '../services/ResultsService';
import ResultsFilter from '../ResultsFilter/ResultsFilter';
import ResultsTable from '../ResultsTable/ResultsTable';
import SnackBar from '../../../../common/components/Snackbar/snackbar';
import Alert from '../../../../common/components/Alert/Alert';
import classes from './ResultsPage.module.css';

import { CircularProgress } from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import BarChartIcon from '@material-ui/icons/BarChart';

const ResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState({ filter: true, table: false });
    const [snackBar, setSnackBar] = useState({ open: false, message: '', type: 'success' });
    const [error, setError] = useState({ error: false, message: '', type: '' });

    const errorHandler = useCallback(
        (message) => {
            setError({
                error: true,
                message,
                type: 'Помилка',
            });
        },
        [setError],
    );

    const getTestInfoByGroup = async (testId, groupId) => {
        const response = await ResultsServiceApi.fetchGroupTestResults(testId, groupId);
        if (response.length) {
            setResults(response);
            setSnackBar({ open: true, message: 'Результати завантажено', type: 'success' });
            setLoading({ filter: false, table: false });
        } else if (!response.length) {
            setResults([]);
            setSnackBar({ open: true, message: 'Результати відсутні', type: 'warning' });
            setLoading({ filter: false, table: false });
        } else if (response.error) {
            setLoading({ filter: false, table: false });
            errorHandler(
                'Сталася помилка при отриманні та формуванні результатів тестування! Спробуйте знову',
            );
        }
    };

    return (
        <div className={classes.Page}>
            <div className={classes.Header}>
                <h1>
                    <InsertChartIcon className={classes.Icon} />
                    Результати тестувань
                </h1>
            </div>
            <div className={classes.Content}>
                <div className={classes.Panel}>
                    <ResultsFilter
                        getTestInfoByGroup={getTestInfoByGroup}
                        loading={loading}
                        setLoading={setLoading}
                        setSnackBar={setSnackBar}
                        errorHandler={errorHandler}
                    />
                </div>
                <div className={classes.Table}>
                    {loading.table ? (
                        <CircularProgress
                            className={classes.Spinner}
                            color={'primary'}
                            size={80}
                            variant="indeterminate"
                        />
                    ) : (
                        <>
                            {results.length ? (
                                <ResultsTable results={results} />
                            ) : (
                                <div className={classes.Intro}>
                                    <BarChartIcon className={classes.IntroIcon} />
                                    <h1>
                                        Оберіть групу, результати <br /> якої бажаєте побачити
                                    </h1>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <SnackBar snack={snackBar} setSnack={setSnackBar} />
            {error.error ? (
                <Alert
                    show={error.error}
                    message={error.message}
                    type={error.type}
                    hide={setError}
                />
            ) : null}
        </div>
    );
};

export default ResultsPage;
