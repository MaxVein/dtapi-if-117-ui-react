import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const GroupRow = ({ groupData }) => {
    return (
        <React.Fragment>
            <TableRow key={groupData.group_id}>
                <TableCell>{groupData.group_id}</TableCell>
                <TableCell>{groupData.group_name}</TableCell>
                <TableCell>{groupData.speciality_name}</TableCell>
                <TableCell>{groupData.faculty_name}</TableCell>
                <TableCell>""</TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default GroupRow;
