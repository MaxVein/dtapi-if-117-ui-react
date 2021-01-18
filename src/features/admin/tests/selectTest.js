import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function SelectSubject(handleSubjectChange, subjects) {
    console.log(`subjects`, subjects);
    return (
        <div>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={() => handleSubjectChange(event)}
            >
                {subjects.map((subject) => {
                    return (
                        <MenuItem key={Select.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </div>
    );
}
