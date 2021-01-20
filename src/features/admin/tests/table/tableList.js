import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { Link, useRouteMatch } from 'react-router-dom';

import classes from './table.module.scss';
import ConfirmDelete from '../../../../common/components/ComfirmDelete';

export default function TableList({ test, setDeleteEntity, handleEditTest }) {
    let { url } = useRouteMatch();

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {test.test_id}
            </TableCell>
            <TableCell align="left">{test.test_name}</TableCell>
            <TableCell align="left">{test.tasks}</TableCell>
            <TableCell align="left">{test.time_for_test}</TableCell>
            <TableCell align="left">{test.attempts}</TableCell>
            <TableCell id={test.test_id} align="left">
                <div className={classes.actionContainer}>
                    <Tooltip title="Редагувати">
                        <Button
                            className={classes.iconBtn}
                            disableElevation
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditTest(test)}
                        >
                            <EditIcon />
                        </Button>
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
                            <Button
                                className={classes.iconBtn}
                                disableElevation
                                variant="contained"
                                color="primary"
                            >
                                <DescriptionIcon />
                            </Button>
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
                            <Button
                                className={classes.iconBtn}
                                disableElevation
                                variant="contained"
                                color="primary"
                            >
                                <FormatListNumberedIcon />
                            </Button>
                        </Tooltip>
                    </Link>
                </div>
            </TableCell>
        </TableRow>
    );
}
