import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

const GroupRow = ({ groupData }) => {
    return (
        <TableRow key={groupData.group_id}>
            <TableCell>{groupData.group_id}</TableCell>
            <TableCell>{groupData.group_name}</TableCell>
            <TableCell>{groupData.speciality_name}</TableCell>
            <TableCell>{groupData.faculty_name}</TableCell>
            <TableCell>
                <div>
                    <Button color="primary">
                        <EditIcon />
                    </Button>
                    <Button color="primary">
                        <DeleteIcon />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default GroupRow;
