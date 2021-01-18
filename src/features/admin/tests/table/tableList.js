import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditOutlined from '@material-ui/icons/EditOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import DescriptionIcon from '@material-ui/icons/Description';
import { Link, useRouteMatch } from 'react-router-dom';

import ConfirmDelete from '../../../../common/components/ComfirmDelete';

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
                    <Tooltip title="Редагувати">
                        <EditOutlined onClick={() => handleEditTest(test)} />
                    </Tooltip>
                    <ConfirmDelete
                        id={test.test_id}
                        setDeleteEntity={setDeleteEntity}
                        message="Ви впевнені що бажаєте видалити тест?"
                    />
                    <Link
                        className="subject-link"
                        to={{
                            pathname: `${url}/test-detail`,
                            state: { id: test.test_id, name: test.test_name },
                        }}
                    >
                        <Tooltip title="Параметри тесту">
                            <DescriptionIcon />
                        </Tooltip>
                    </Link>
                    <Link
                        className="subject-link"
                        to={{
                            pathname: `${url}/questions`,
                            state: { id: test.test_id, name: test.test_name },
                        }}
                    >
                        <Tooltip title="Питання тесту">
                            <FormatListNumberedIcon />
                        </Tooltip>
                    </Link>
                </div>
            </TableCell>
        </TableRow>
    );
}
