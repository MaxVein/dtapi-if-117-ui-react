import React, { useContext, useEffect, useState } from 'react';
import { UseLanguage } from '../../../../lang/LanguagesContext';
import { ResultsServiceApi } from '../services/ResultsService';
import ResultsContext from '../ResultsPage/ResultsContext';
import PropTypes from 'prop-types';
import classes from './ResultsFilter.module.css';

import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import GroupIcon from '@material-ui/icons/Group';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

const ResultsFilter = ({ getTestInfoByGroup }) => {
    const { t } = UseLanguage();
    const { loading, setLoading, messageHandler, errorHandler } = useContext(ResultsContext);
    const [faculties, setFaculties] = useState([]);
    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState({ allTests: [], groupTests: [] });
    const [ids, setIds] = useState({ groupId: null, testId: null, subjectId: null });
    const [disabled, setDisabled] = useState({
        faculties: true,
        groups: true,
        tests: true,
        get: true,
    });
    const [faculty, setFaculty] = useState('');
    const [group, setGroup] = useState('');
    const [test, setTest] = useState('');

    useEffect(() => {
        (async function facultyList() {
            await getFacultyList();
        })();
        (async function testsList() {
            await getTestsList();
        })();
    }, []);

    const getFacultyList = async () => {
        const faculties = await ResultsServiceApi.fetchFaculties();
        if (faculties.length) {
            setFaculties(faculties);
            setDisabled({ faculties: false, groups: true, tests: true, get: true });
        } else if (!faculties.length) {
            facultyErrorHandler(false);
        } else if (faculties.error) {
            facultyErrorHandler(true);
        }
    };

    const getTestsList = async () => {
        const tests = await ResultsServiceApi.fetchTests();
        if (tests.length) {
            setTests({ allTests: tests, groupTests: [] });
            setLoading({
                filter: false,
                table: false,
                detailsModal: true,
                detailsByQuestionModal: true,
            });
        } else if (!tests.length) {
            allTestsErrorhandler(false);
        } else if (tests.error) {
            allTestsErrorhandler(true);
        }
    };

    const facultiesChangeHandler = async (event) => {
        const id = event.target.value;
        setFaculty(id);
        setGroup('');
        setGroups([]);
        setTest('');
        setTests((prevState) => {
            return {
                allTests: [...prevState.allTests],
                groupTests: [],
            };
        });
        messageHandler(t('results.filter.messages.selectFaculty'), 'success');
        id
            ? await getGroupList(id)
            : messageHandler(t('results.filter.messages.getDataError'), 'error');
    };

    const getGroupList = async (id) => {
        const groups = await ResultsServiceApi.fetchGroupsByFaculty(id);
        if (groups.length) {
            setGroups(groups);
            setDisabled({ faculties: false, groups: false, tests: true, get: true });
        } else if (!groups.length) {
            groupsErrorHandler(false);
        } else if (groups.error) {
            groupsErrorHandler(true);
        }
    };

    const groupsChangeHandler = (event) => {
        const id = event.target.value;
        setGroup(id);
        setTest('');
        setTests((prevState) => {
            return {
                allTests: [...prevState.allTests],
                groupTests: [],
            };
        });
        id ? selectedGroup(id) : messageHandler(t('results.filter.messages.getDataError'), 'error');
    };

    const selectedGroup = async (id) => {
        messageHandler(t('results.filter.messages.selectGroup'), 'success');
        setIds((prevState) => {
            prevState.groupId = id;
            return prevState;
        });
        const arr = groups.filter((g) => g.group_id === id.toString());
        localStorage.setItem('group_name', JSON.stringify(arr[0].group_name));
        await getGroupTests(id);
    };

    const getGroupTests = async (id) => {
        const response = await ResultsServiceApi.fetchResultTestIdsByGroup(id);
        if (response.length) {
            setTests((prevState) => {
                prevState.groupTests = prevState.allTests.filter((t) =>
                    response.some((i) => i.test_id === t.test_id),
                );
                return {
                    allTests: [...prevState.allTests],
                    groupTests: [...prevState.groupTests],
                };
            });
            setDisabled({ faculties: false, groups: false, tests: false, get: true });
        } else if (!response.length) {
            testsErrorHandler(false);
        } else if (response.error) {
            testsErrorHandler(true);
        }
    };

    const testsChangeHandler = (event) => {
        setTest(event.target.value);
        const arr = tests.groupTests.filter((t) => t.test_id === event.target.value.toString());
        setIds((prevState) => {
            return {
                groupId: prevState.groupId,
                testId: +event.target.value,
                subjectId: arr[0].subject_id,
            };
        });
        localStorage.setItem('test_name', JSON.stringify(arr[0].test_name));
        messageHandler(t('results.filter.messages.selectTest'), 'success');
        setDisabled({ faculties: false, groups: false, tests: false, get: false });
    };

    const facultyErrorHandler = (error) => {
        setFaculties([]);
        setDisabled({ faculties: true, groups: true, tests: true, get: true });
        setLoading({
            filter: false,
            table: false,
            detailsModal: true,
            detailsByQuestionModal: true,
        });
        error
            ? errorHandler(
                  t('results.filter.errors.getFacultiesError'),
                  t('results.filter.errors.typeError'),
              )
            : messageHandler(t('results.filter.messages.noFaculties'), 'warning');
    };

    const allTestsErrorhandler = (error) => {
        setTests({ allTests: [], groupTests: [] });
        setLoading({
            filter: false,
            table: false,
            detailsModal: true,
            detailsByQuestionModal: true,
        });
        error
            ? errorHandler(
                  t('results.filter.errors.getTestsError'),
                  t('results.filter.errors.typeError'),
              )
            : messageHandler(t('results.filter.messages.noTests'), 'warning');
    };

    const groupsErrorHandler = (error) => {
        setGroup('');
        setDisabled({ faculties: false, groups: true, tests: true, get: true });
        setGroups([]);
        error
            ? errorHandler(
                  t('results.filter.errors.getGroupsError'),
                  t('results.filter.errors.typeError'),
              )
            : messageHandler(t('results.filter.messages.noGroups'), 'warning');
    };

    const testsErrorHandler = (error) => {
        setTest('');
        setDisabled({ faculties: false, groups: false, tests: true, get: true });
        setTests((prevState) => {
            return {
                allTests: [...prevState.allTests],
                groupTests: [],
            };
        });
        error
            ? errorHandler(
                  t('results.filter.errors.getGroupTestsError'),
                  t('results.filter.errors.typeError'),
              )
            : messageHandler(t('results.filter.messages.noGroupTests'), 'warning');
    };

    return (
        <>
            {loading.filter ? (
                <CircularProgress
                    className={classes.Spinner}
                    color={'primary'}
                    size={80}
                    variant="indeterminate"
                />
            ) : (
                <Card className={classes.Filter}>
                    <CardContent className={classes.CardContent}>
                        <div className={classes.Faculties}>
                            <div className={classes.Selector}>
                                <FormControl fullWidth={true} className={classes.FormControl}>
                                    <InputLabel
                                        classes={{ shrink: 'right: unset;' }}
                                        className={classes.Label}
                                    >
                                        <SchoolIcon className={classes.SelectorIcon} />
                                        {t('results.filter.labels.faculty')}
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder={t('results.filter.placeholders.faculty')}
                                        required
                                        value={faculty}
                                        className={classes.Select}
                                        onChange={facultiesChangeHandler}
                                        disabled={disabled.faculties}
                                    >
                                        {faculties.map(({ faculty_id, faculty_name }) => (
                                            <MenuItem
                                                key={faculty_id + Math.random()}
                                                value={+faculty_id}
                                            >
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
                                        {t('results.filter.labels.group')}
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder={t('results.filter.placeholders.group')}
                                        required
                                        value={group}
                                        className={classes.Select}
                                        onChange={groupsChangeHandler}
                                        disabled={disabled.groups}
                                    >
                                        {groups.map(({ group_id, group_name }) => (
                                            <MenuItem
                                                key={group_id + Math.random()}
                                                value={+group_id}
                                            >
                                                {group_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={classes.Tests}>
                            <div className={classes.Selector}>
                                <FormControl fullWidth={true} className={classes.FormControl}>
                                    <InputLabel className={classes.Label}>
                                        <PlaylistAddCheckIcon className={classes.SelectorIcon} />
                                        {t('results.filter.labels.test')}
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder={t('results.filter.placeholders.test')}
                                        required
                                        value={test}
                                        className={classes.Select}
                                        onChange={testsChangeHandler}
                                        disabled={disabled.tests}
                                    >
                                        {tests.groupTests.map(({ test_id, test_name }) => (
                                            <MenuItem
                                                key={test_id + Math.random()}
                                                value={+test_id}
                                            >
                                                {test_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={classes.Actions}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                className={classes.Button}
                                type="submit"
                                disabled={test === '' && disabled.get}
                                onClick={() => {
                                    setLoading({
                                        filter: false,
                                        table: true,
                                        detailsModal: true,
                                        detailsByQuestionModal: true,
                                    });
                                    getTestInfoByGroup(ids.testId, ids.groupId, ids.subjectId);
                                }}
                            >
                                {t('results.filter.buttons.get')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default ResultsFilter;

ResultsFilter.propTypes = {
    getTestInfoByGroup: PropTypes.func,
};
