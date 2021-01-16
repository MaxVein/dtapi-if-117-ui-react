import React, { useEffect, useState } from 'react';
import { StudentsServiceAPI } from '../../services/StudentsService';
import PropTypes from 'prop-types';
import classes from './TransferSelects.module.css';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import GroupIcon from '@material-ui/icons/Group';
import { UseLanguage } from '../../../../lang/LanguagesContext';

const TransferSelects = ({
    setSubmitted,
    setStudentData,
    oldGroupId,
    setSnackBar,
    errorHandler,
}) => {
    const { t } = UseLanguage();

    const [faculties, setFaculties] = useState([]);
    const [groups, setGroups] = useState([]);
    const [faculty, setFaculty] = useState('');
    const [group, setGroup] = useState('');

    useEffect(() => {
        (async function getFacultyList() {
            try {
                const faculties = await StudentsServiceAPI.fetchFaculties();
                if (faculties.data.length) {
                    setFaculties(faculties.data);
                }
            } catch (e) {
                errorHandler('Сталася помилка при списку факультетів. Спробуйте знову');
            }
        })();
    }, [errorHandler]);

    const getGroupsList = async (id) => {
        if (id) {
            try {
                const groups = await StudentsServiceAPI.fetchGroupsByFaculty(id);
                if (groups.data.length) {
                    setGroups(groups.data);
                }
            } catch (e) {
                errorHandler('Сталася помилка при списку груп. Спробуйте знову');
            }
        } else {
            setSnackBar({
                open: true,
                message: 'Сталася помилка при отриманні даних! Спробуйте знову',
            });
        }
    };

    const getGroup = (id) => {
        if (id) {
            if (id !== oldGroupId) {
                setSnackBar({
                    open: true,
                    message: 'Групу вибрано',
                });
                setSubmitted(true);
                setStudentData((prevState) => {
                    prevState.group_id = id.toString();
                    return { ...prevState };
                });
            } else {
                setSnackBar({
                    open: true,
                    message: 'Ви вибрали поточну групу студента! Змініть групу!',
                });
            }
        } else {
            setSubmitted(false);
            setSnackBar({
                open: true,
                message: 'Сталася помилка при отриманні даних! Спробуйте знову',
            });
        }
    };

    return (
        <div className={classes.Container}>
            <div className={classes.Faculties}>
                <div className={classes.Selector}>
                    <FormControl fullWidth={true} className={classes.FormControl}>
                        <InputLabel classes={{ shrink: 'right: unset;' }} className={classes.Label}>
                            <SchoolIcon className={classes.SelectorIcon} />
                            {t('students.transfer.chooseFaculty')}
                        </InputLabel>
                        <Select
                            placeholder={t('students.transfer.chooseFaculty')}
                            required
                            value={faculty}
                            className={classes.Select}
                            onChange={async (event) => {
                                setFaculty(event.target.value);
                                setSnackBar({ open: true, message: 'Факультет вибрано' });
                                await getGroupsList(+event.target.value);
                            }}
                            disabled={!faculties.length}
                        >
                            {faculties.map(({ faculty_id, faculty_name }) => (
                                <MenuItem key={faculty_id} value={+faculty_id}>
                                    {faculty_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={classes.Groups}>
                <div className={classes.Selector}>
                    <FormControl fullWidth={true} className={classes.FormControl}>
                        <InputLabel className={classes.Label}>
                            <GroupIcon className={classes.SelectorIcon} />
                            {t('students.transfer.chooseGroup')}
                        </InputLabel>
                        <Select
                            placeholder={t('students.transfer.chooseGroup')}
                            required
                            value={group}
                            className={classes.Select}
                            onChange={(event) => {
                                setGroup(event.target.value);
                                getGroup(+event.target.value);
                            }}
                            disabled={(!faculties.length && !groups.length) || faculty === ''}
                        >
                            {groups.map(({ group_id, group_name }) => (
                                <MenuItem key={group_id} value={+group_id}>
                                    {group_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

export default TransferSelects;

TransferSelects.propTypes = {
    setSubmitted: PropTypes.func,
    setStudentData: PropTypes.func,
    errorHandler: PropTypes.func,
    setSnackBar: PropTypes.func,
    oldGroupId: PropTypes.number,
};
