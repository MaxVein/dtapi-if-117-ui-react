import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditOutlined from '@material-ui/icons/EditOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, useRouteMatch } from 'react-router-dom';

import ConfirmDelete from '../../../../common/components/ComfirmDelete';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import classes from './tableList.module.scss';

export default function TableList({ entity, handleEditEntity, setDeleteEntity }) {
    const { t } = UseLanguage();
    let { url } = useRouteMatch();
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {entity.subject_id}
            </TableCell>
            <TableCell align="left">{entity.subject_name}</TableCell>
            <TableCell align="left">{entity.subject_description}</TableCell>
            <TableCell id={entity.subject_id} align="left">
                <div className={classes.actionBtnContainer}>
                    <Link
                        className={classes.subjectLink}
                        to={{
                            pathname: `${url}/tests`,
                            state: { id: entity.subject_id, name: entity.subject_name },
                        }}
                    >
                        <Tooltip title={t('subjects.tableList.tooltipTest')}>
                            <SpeakerNotesIcon />
                        </Tooltip>
                    </Link>
                    <Link
                        className={classes.subjectLink}
                        to={{
                            pathname: `${url}/timetable`,
                            state: { id: entity.subject_id, name: entity.subject_name },
                        }}
                    >
                        <Tooltip title={t('subjects.tableList.tooltipTimetable')}>
                            <ScheduleIcon />
                        </Tooltip>
                    </Link>
                    <Tooltip title={t('subjects.tableList.tooltipEdit')}>
                        <EditOutlined onClick={() => handleEditEntity(entity)} />
                    </Tooltip>
                    <ConfirmDelete
                        id={entity.subject_id}
                        setDeleteEntity={setDeleteEntity}
                        message={t('subjects.tableList.confirmMessage')}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
