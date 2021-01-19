import React, { useState } from 'react';
import { UseLanguage } from '../../../../../lang/LanguagesContext';
import PropTypes from 'prop-types';
import classes from './TableSearch.module.css';

import { FormControl, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const TableSearch = ({ onSearch }) => {
    const { t } = UseLanguage();
    const [search, setSearch] = useState('');

    return (
        <div className={classes.Search}>
            <FormControl fullWidth={true} className={classes.FormControl}>
                <TextField
                    className={classes.TextField}
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        onSearch(event.target.value);
                    }}
                    label={t('results.table.search')}
                    type="text"
                    id="search"
                    placeholder={t('results.table.searchPlaceholder')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
        </div>
    );
};

export default TableSearch;

TableSearch.propTypes = {
    onSearch: PropTypes.func,
};
