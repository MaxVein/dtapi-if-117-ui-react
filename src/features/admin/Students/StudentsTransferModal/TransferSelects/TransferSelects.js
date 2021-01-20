import React, { useEffect, useState } from 'react';
import { UseLanguage } from '../../../../../lang/LanguagesContext';
import { StudentsServiceApi } from '../../services/StudentsService';
import PropTypes from 'prop-types';
import classes from './TransferSelects.module.css';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import GroupIcon from '@material-ui/icons/Group';

const TransferSelects = ({
    setOpen,
    setSubmitted,
    setStudentData,
    oldGroupId,
    messageHandler,
    errorHandler,
}) => {
    const { t } = UseLanguage();
    const [faculties, setFaculties] = useState([]);
    const [groups, setGroups] = useState([]);
    const [faculty, setFaculty] = useState('');
    const [group, setGroup] = useState('');
    const [disabled, setDisabled] = useState({ faculties: true, groups: true });

    useEffect(() => {
        (async function facultyList() {
            await getFacultyList();
            return () => {
                setFaculty('');
                setFaculties([]);
                setGroup('');
                setGroups([]);
            };
        })();
    }, []);

    const getFacultyList = async () => {
        const faculties = await StudentsServiceApi.fetchFaculties();
        if (faculties.length) {
            setFaculties(faculties);
            setDisabled({ faculties: false, groups: true });
        } else if (!faculties.length) {
            setOpen({ open: false });
            messageHandler(t('students.transfer.messages.noFaculties'), 'warning');
        } else if (faculties.error) {
            errorHandler(t('students.transfer.errors.facultyError'));
        }
    };

    const facultiesChangeHandler = async (event) => {
        const id = event.target.value;
        setFaculty(id);
        messageHandler(t('students.transfer.messages.selectedFaculty'), 'success');
        id
            ? await getGroupList(id)
            : messageHandler(t('students.transfer.messages.notData'), 'error');
    };

    const getGroupList = async (id) => {
        const groups = await StudentsServiceApi.fetchGroupsByFaculty(id);
        if (groups.length) {
            setGroups(groups);
            setDisabled({ faculties: false, groups: false });
        } else if (!groups.length) {
            setOpen({ open: false });
            messageHandler(t('students.transfer.messages.notGroups'), 'warning');
        } else if (groups.error) {
            errorHandler(t('students.transfer.errors.groupError'));
        }
    };

    const groupsChangeHandler = (event) => {
        const id = event.target.value;
        setGroup(id);
        id ? start(+id) : messageHandler(t('students.transfer.messages.notData'), 'error');
    };

    const start = (id) => {
        if (id !== oldGroupId) {
            messageHandler(t('students.transfer.messages.selectedGroup'), 'success');
            setStudentData((prevState) => {
                prevState.group_id = id.toString();
                return { ...prevState };
            });
            setSubmitted(true);
        } else {
            messageHandler(t('students.transfer.messages.sameGroup'), 'warning');
        }
    };

    return (
        <div className={classes.Container}>
            <div className={classes.Faculties}>
                <div className={classes.Selector}>
                    <FormControl fullWidth={true} className={classes.FormControl}>
                        <InputLabel classes={{ shrink: 'right: unset;' }} className={classes.Label}>
                            <SchoolIcon className={classes.SelectorIcon} />
                            {t('students.transfer.placeholders.chooseFaculty')}
                        </InputLabel>
                        <Select
                            defaultValue={''}
                            placeholder={t('students.transfer.placeholders.chooseFaculty')}
                            required
                            value={faculty}
                            className={classes.Select}
                            onChange={facultiesChangeHandler}
                            disabled={disabled.faculties}
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
                            {t('students.transfer.placeholders.chooseGroup')}
                        </InputLabel>
                        <Select
                            defaultValue={''}
                            placeholder={t('students.transfer.placeholders.chooseGroup')}
                            required
                            value={group}
                            className={classes.Select}
                            onChange={groupsChangeHandler}
                            disabled={disabled.groups}
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
    setOpen: PropTypes.func,
    setSubmitted: PropTypes.func,
    setStudentData: PropTypes.func,
    errorHandler: PropTypes.func,
    messageHandler: PropTypes.func,
    oldGroupId: PropTypes.number,
};
