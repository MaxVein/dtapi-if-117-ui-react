import React from 'react';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

export default function SearcComponent({ setSearchData }) {
    const handleOnchange = (event) => {
        setSearchData(event.target.value);
    };
    return (
        <div className="search-container">
            <SearchIcon />
            <TextField fullWidth onChange={handleOnchange} label="Пошук" />
        </div>
    );
}
