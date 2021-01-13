import React, { useCallback, useEffect, useState } from 'react';
import { ResultsServiceApi } from '../services/ResultsService';
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

const ResultsFilter = ({ getTestInfoByGroup, loading, setLoading, setSnackBar, errorHandler }) => {
    const [faculties, setFaculties] = useState([]);
    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState({ allTests: [], groupTests: [] });
    const [ids, setIds] = useState({ groupId: null, testId: null });
    const [disabled, setDisabled] = useState({ faculties: true, groups: true, tests: true });
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

    const messageHandler = useCallback(
        (message, type) => {
            setSnackBar({
                open: true,
                message,
                type,
            });
        },
        [setSnackBar],
    );

    const getFacultyList = async () => {
        const faculties = await ResultsServiceApi.fetchFaculties();
        if (faculties.length) {
            setFaculties(faculties);
            setDisabled({ faculties: false, groups: true, tests: true });
        } else if (!faculties.length) {
            setFaculties([]);
            messageHandler('Факультети відсутні', 'warning');
            setLoading({ filter: false, table: false });
        } else if (faculties.error) {
            setLoading({ filter: false, table: false });
            errorHandler('Сталася помилка під час отримання списку факультетів! Спробуйте знову');
        }
    };

    const getTestsList = async () => {
        const tests = await ResultsServiceApi.fetchTests();
        if (tests.length) {
            setTests({ allTests: tests, groupTests: [] });
            setLoading({ filter: false, table: false });
        } else if (!tests.length) {
            setTests({ allTests: [], groupTests: [] });
            messageHandler('Тести відсутні', 'warning');
            setLoading({ filter: false, table: false });
        } else if (tests.error) {
            setLoading({ filter: false, table: false });
            errorHandler('Сталася помилка під час отримання списку тестів! Спробуйте знову');
        }
    };

    const groupsList = async (id) => {
        if (id) {
            await getGroupList(id);
        } else {
            messageHandler('Сталася помилка при отриманні даних! Спробуйте знову', 'error');
        }
    };

    const getGroupList = async (id) => {
        const groups = await ResultsServiceApi.fetchGroupsByFaculty(id);
        if (groups.length) {
            setGroups(groups);
            setDisabled({ faculties: false, groups: false, tests: true });
        } else if (!groups.length) {
            setGroup('');
            setGroups([]);
            setDisabled({ faculties: false, groups: true, tests: true });
            messageHandler('Групи відсутні', 'warning');
        } else if (groups.error) {
            errorHandler('Сталася помилка під час отримання списку груп! Спробуйте знову');
        }
    };

    const getGroup = async (id) => {
        if (id) {
            messageHandler('Групу вибрано', 'success');
            setIds({ groupId: id, testId: null });
            await getGroupTests(id);
        } else {
            messageHandler('Сталася помилка при отриманні даних! Спробуйте знову', 'error');
        }
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
            setDisabled({ faculties: false, groups: false, tests: false });
        } else if (!response.length) {
            setTest('');
            setTests((prevState) => {
                return {
                    allTests: [...prevState.allTests],
                    groupTests: [],
                };
            });
            setDisabled({ faculties: false, groups: false, tests: true });
            messageHandler('Немає доступних тестів у вибраної групи', 'warning');
        } else if (response.error) {
            errorHandler('Сталася помилка під час отримання списку тестів групи! Спробуйте знову');
        }
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
                                        Виберіть Факультет/Інститут
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder="Факультет/Інститут"
                                        required
                                        value={faculty}
                                        className={classes.Select}
                                        onChange={async (event) => {
                                            setFaculty(event.target.value);
                                            messageHandler('Факультет вибрано', 'success');
                                            await groupsList(+event.target.value);
                                        }}
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
                                        Виберіть Групу
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder="Група"
                                        required
                                        value={group}
                                        className={classes.Select}
                                        onChange={async (event) => {
                                            setGroup(event.target.value);
                                            await getGroup(+event.target.value);
                                        }}
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
                        <div className={classes.Tests}>
                            <div className={classes.Selector}>
                                <FormControl fullWidth={true} className={classes.FormControl}>
                                    <InputLabel className={classes.Label}>
                                        <PlaylistAddCheckIcon className={classes.SelectorIcon} />
                                        Виберіть Тест
                                    </InputLabel>
                                    <Select
                                        defaultValue={''}
                                        placeholder="Тести групи"
                                        required
                                        value={test}
                                        className={classes.Select}
                                        onChange={(event) => {
                                            setTest(event.target.value);
                                            setIds((prevState) => {
                                                return {
                                                    groupId: prevState.groupId,
                                                    testId: +event.target.value,
                                                };
                                            });
                                            messageHandler('Тест вибрано', 'success');
                                        }}
                                        disabled={disabled.tests}
                                    >
                                        {tests.groupTests.map(({ test_id, test_name }) => (
                                            <MenuItem key={test_id} value={+test_id}>
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
                                disabled={test === ''}
                                onClick={() => {
                                    setLoading({ filter: false, table: true });
                                    getTestInfoByGroup(ids.testId, ids.groupId);
                                }}
                            >
                                Отримати результати тесту
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
    loading: PropTypes.object,
    setLoading: PropTypes.func,
    setSnackBar: PropTypes.func,
    errorHandler: PropTypes.func,
    getTestInfoByGroup: PropTypes.func,
};
