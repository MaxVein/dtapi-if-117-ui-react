import React, { useState, useEffect } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { v4 as uuidv4 } from 'uuid';
import { getEntityData } from '../../../common/utils';
import axios from 'axios';

const ProtocolsRow = ({ log }) => {
    const [userName, setUserName] = useState('');
    const [testName, setTestName] = useState('');

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async function fetchData() {
            const responseUser = await getEntityData('student', source, log.user_id);
            setUserName(
                `${responseUser.data[0].student_surname} ${responseUser.data[0].student_name} ${responseUser.data[0].student_fname}`,
            );
        })();
        return () => {
            source.cancel();
        };
    }, [log.user_id]);
    return (
        <TableRow key={uuidv4()}>
            <TableCell>{log.user_id}</TableCell>
            <TableCell>{userName}</TableCell>
            <TableCell>{log.test_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
            <TableCell>{log.log_time}</TableCell>
            <TableCell>{log.remote_ip}</TableCell>
        </TableRow>
    );
};

export default ProtocolsRow;
