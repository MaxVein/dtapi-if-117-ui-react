import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
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
                            <Button
                                disableElevation
                                className={classes.iconBtn}
                                variant="contained"
                                color="primary"
                            >
                                <SpeakerNotesIcon />
                            </Button>
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
                            <Button
                                className={classes.iconBtn}
                                disableElevation
                                variant="contained"
                                color="primary"
                            >
                                <ScheduleIcon />
                            </Button>
                        </Tooltip>
                    </Link>
                    <Tooltip title={t('subjects.tableList.tooltipEdit')}>
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
                        id={entity.subject_id}
                        setDeleteEntity={setDeleteEntity}
                        message={t('subjects.tableList.confirmMessage')}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
