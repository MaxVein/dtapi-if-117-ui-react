import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditOutlined from '@material-ui/icons/EditOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import ConfirmDelete from '../../subjects/confirm';

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
                <div className="action-btn-container">
                    <Tooltip title="Редагувати">
                        <EditOutlined onClick={() => handleEditEntity(entity)} />
                    </Tooltip>
                    <ConfirmDelete
                        id={entity.timetable_id}
                        setDeleteEntity={setDeleteEntity}
                        message="Ви впевнені що бажаєте видалити тест?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
