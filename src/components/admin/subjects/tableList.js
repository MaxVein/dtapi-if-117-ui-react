import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditOutlined from '@material-ui/icons/EditOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, useRouteMatch } from 'react-router-dom';

import ConfirmDelete from './confirm';

export default function TableList(props) {
    let { url } = useRouteMatch();
    const { subject, handleEditSubject, setDeleteEntity } = props;
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {subject.subject_id}
            </TableCell>
            <TableCell align="left">{subject.subject_name}</TableCell>
            <TableCell align="left">{subject.subject_description}</TableCell>
            <TableCell id={subject.subject_id} align="left">
                <div className="action-btn-container">
                    <Link
                        className="subject-link"
                        to={{
                            pathname: `${url}/tests`,
                            state: { id: subject.subject_id, name: subject.subject_name },
                        }}
                    >
                        <Tooltip title="Тести предмета">
                            <SpeakerNotesIcon />
                        </Tooltip>
                    </Link>
                    <Link
                        className="subject-link"
                        to={{
                            pathname: `${url}/timetable`,
                            state: { id: subject.subject_id, name: subject.subject_name },
                        }}
                    >
                        <Tooltip title="Розклад тестування">
                            <ScheduleIcon />
                        </Tooltip>
                    </Link>
                    <Tooltip title="Редагувати">
                        <EditOutlined onClick={() => handleEditSubject(subject)} />
                    </Tooltip>
                    <ConfirmDelete
                        id={subject.subject_id}
                        setDeleteEntity={setDeleteEntity}
                        message="Ви впевнені що бажаєте видалити предмет?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
