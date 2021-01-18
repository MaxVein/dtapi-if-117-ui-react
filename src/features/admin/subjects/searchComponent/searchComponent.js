import React from 'react';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import classes from './searchComponent.module.css';

export default function SearcComponent({ setSearchData }) {
    const { t } = UseLanguage();
    const handleOnchange = (event) => {
        setSearchData(event.target.value);
    };
    return (
        <div className={classes.searchContainer}>
            <SearchIcon />
            <TextField fullWidth onChange={handleOnchange} label={t('subjects.search')} />
        </div>
    );
}
