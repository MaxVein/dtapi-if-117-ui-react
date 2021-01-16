import React, { useState, useEffect } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { v4 as uuidv4 } from 'uuid';

const ProtocolsRow = ({ log }) => {
    return (
        <TableRow key={uuidv4()}>
            <TableCell>{log.user_id}</TableCell>
            <TableCell>{log.student_name}</TableCell>
            <TableCell>{log.test_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
            <TableCell>{log.log_time}</TableCell>
            <TableCell>{log.remote_ip}</TableCell>
        </TableRow>
    );
};

export default ProtocolsRow;
