import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import classes from './selectComponent.module.scss';

export default function SelectComponent({ setSubjectId, subjects, subjectId }) {
    const handleChange = (event) => {
        setSubjectId(event.target.value);
    };
    return (
        <div>
            <Select
                className={classes.selectContainer}
                labelId="select-label"
                id="select"
                value={subjectId}
                onChange={handleChange}
            >
                {subjects.map((subject) => {
                    return (
                        <MenuItem key={subject.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </div>
    );
}
