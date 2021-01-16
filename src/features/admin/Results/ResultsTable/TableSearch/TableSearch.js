import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './TableSearch.module.css';

import { FormControl, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const TableSearch = ({ onSearch }) => {
    const [search, setSearch] = useState('');

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(event.target.value);
        onSearch(value);
    };

    return (
        <div className={classes.Search}>
            <FormControl fullWidth={true} className={classes.FormControl}>
                <TextField
                    className={classes.TextField}
                    value={search}
                    onChange={handleSearch}
                    label="Пошук"
                    type="text"
                    id="search"
                    placeholder="Здійснюйте пошук по ПІБ студента"
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
