import React, { useCallback, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { ResultsServiceApi } from '../services/ResultsService';
import ResultsContext from './ResultsContext';
import ResultsFilter from '../ResultsFilter/ResultsFilter';
import ResultsTable from '../ResultsTable/ResultsTable';
import TableFilters from '../ResultsTable/TableFilters/TableFilters';
import SnackBar from '../../../../common/components/Snackbar/snackbar';
import Alert from '../../../../common/components/Alert/Alert';
import classes from './ResultsPage.module.css';

import { CircularProgress } from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import BarChartIcon from '@material-ui/icons/BarChart';

const ResultsPage = () => {
    const { t } = UseLanguage();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState({
        filter: true,
        table: false,
        detailsModal: true,
        detailsByQuestionModal: true,
    });
    const [snackBar, setSnackBar] = useState({ open: false, message: '', type: 'success' });
    const [error, setError] = useState({ error: false, message: '', type: '' });

    const errorHandler = useCallback(
        (message, type) => {
            setError({
                error: true,
                message,
                type,
            });
        },
        [setError],
    );

    const messageHandler = useCallback(
        (message, type) => {
            setSnackBar({
                open: true,
                message,
                type,
            });
        },
        [setSnackBar],
    );

    const getTestInfoByGroup = async (testId, groupId, subjectId) => {
        setResults([]);
        const response = await ResultsServiceApi.fetchGroupTestResults(testId, groupId, subjectId);
        if (response.length) {
            setResults(response);
            setLoading({
                filter: false,
                table: false,
                detailsModal: true,
                detailsByQuestionModal: true,
            });
            messageHandler(t('results.page.messages.resultsUpload'), 'success');
        } else if (!response.length) {
            getTestInfoErrorHandler(false);
        } else if (response.error) {
            getTestInfoErrorHandler(true);
        }
    };

    const getTestInfoErrorHandler = (error) => {
        setResults([]);
        setLoading({
            filter: false,
            table: false,
            detailsModal: true,
            detailsByQuestionModal: true,
        });
        error
            ? errorHandler(
                  t('results.page.errors.getResultsError'),
                  t('results.page.errors.typeError'),
              )
            : messageHandler(t('results.page.messages.noResults'), 'warning');
    };

    return (
        <ResultsContext.Provider value={{ loading, setLoading, messageHandler, errorHandler }}>
            <div className={classes.Page}>
                <div className={classes.Header}>
                    <h1>
                        <InsertChartIcon className={classes.Icon} />
                        {t('results.page.title')}
                    </h1>
                </div>
                <div className={classes.Content}>
                    <div className={classes.Panel}>
                        <ResultsFilter getTestInfoByGroup={getTestInfoByGroup} />
                        {loading.table ? (
                            <CircularProgress
                                className={classes.SpinnerFilters}
                                color={'primary'}
                                size={60}
                                variant="indeterminate"
                            />
                        ) : (
                            <>
                                {results.length ? (
                                    <TableFilters results={results} setResults={setResults} />
                                ) : null}
                            </>
                        )}
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
                                        <BarChartIcon
                                            color="primary"
                                            className={classes.IntroIcon}
                                        />
                                        <h1>{t('results.page.text')}</h1>
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
        </ResultsContext.Provider>
    );
};

export default ResultsPage;
