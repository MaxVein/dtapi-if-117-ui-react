import React from 'react';
import classes from './ResultsPage.module.css';

import InsertChartIcon from '@material-ui/icons/InsertChart';
import ResultsFilter from '../ResultsFilter/ResultsFilter';
import ResultsTable from '../ResultsTable/ResultsTable';

const ResultsPage = () => {
    return (
        <div className={classes.Page}>
            <div className={classes.Panel}>
                <div className={classes.Header}>
                    <h1>
                        <InsertChartIcon className={classes.Icon} />
                        Результати тестувань
                    </h1>
                </div>
                <ResultsFilter />
            </div>
            <div className={classes.Table}>
                <ResultsTable />
            </div>
        </div>
    );
};

export default ResultsPage;
