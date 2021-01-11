import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditOutlined from '@material-ui/icons/EditOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { Link, useRouteMatch } from 'react-router-dom';

import ConfirmDelete from '../confirm';

export default function TableList({ test, setDeleteEntity, handleEditTest, subjectName }) {
    let { url } = useRouteMatch();
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {test.test_id}
            </TableCell>
            <TableCell align="left">{test.test_name}</TableCell>
            <TableCell align="left">{subjectName}</TableCell>
            <TableCell align="left">{test.tasks}</TableCell>
            <TableCell align="left">{test.time_for_test}</TableCell>
            <TableCell id={test.test_id} align="left">
                <div className="action-btn-container">
                    <Link
                        className="test-link"
                        to={{
                            pathname: `${url}/test-detail`,
                            state: { id: test.test_id, name: test.test_name },
                        }}
                    >
                        <Tooltip title="Параметри тесту">
                            <ListAltIcon />
                        </Tooltip>
                    </Link>
                    <Link
                        className="test-link"
                        to={{
                            pathname: `${url}/questions`,
                            state: { id: test.test_id, name: test.test_name },
                        }}
                    >
                        <Tooltip title="Питання тесту">
                            <ListAltIcon />
                        </Tooltip>
                    </Link>
                    <Tooltip title="Редагувати">
                        <EditOutlined onClick={() => handleEditTest(test)} />
                    </Tooltip>
                    <ConfirmDelete
                        id={test.test_id}
                        setDeleteEntity={setDeleteEntity}
                        message="Ви впевнені що бажаєте видалити тест?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
