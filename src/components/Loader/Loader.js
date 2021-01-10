import React from 'react';
import classes from './Loader.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => (
    <div className={classes.Loader}>
        <CircularProgress color={'primary'} size={70} />
    </div>
);

export default Loader;
