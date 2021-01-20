import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import classes from './table.module.scss';
import ConfirmDelete from '../../../../common/components/ComfirmDelete';

export default function TableList({ entity, setDeleteEntity, handleEditEntity }) {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {entity.timetable_id}
            </TableCell>
            <TableCell align="left">{entity.group_name}</TableCell>
            <TableCell align="left">{entity.start_date}</TableCell>
            <TableCell align="left">{entity.start_time}</TableCell>
            <TableCell align="left">{entity.end_date}</TableCell>
            <TableCell align="left">{entity.end_time}</TableCell>
            <TableCell align="left">
                <div className={classes.actionBtnContainer}>
                    <Tooltip title="Редагувати">
                        <Button
                            className={classes.iconBtn}
                            disableElevation
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditEntity(entity)}
                        >
                            <EditIcon />
                        </Button>
                    </Tooltip>
                    <ConfirmDelete
                        id={entity.timetable_id}
                        setDeleteEntity={setDeleteEntity}
                        message="Ви впевнені що бажаєте видалити розклад для тесту?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
