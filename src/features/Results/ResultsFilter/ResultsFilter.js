import React, { useCallback, useEffect, useState } from 'react';
import { ResultsServiceAPI } from '../services/ResultsService';
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

    useEffect(() => {
        (async function getFacultyList() {
            try {
                const faculties = await ResultsServiceAPI.fetchFaculties();
                if (faculties.data.length) {
                    setFaculties(faculties.data);
                    setDisabled({ faculties: false, groups: true, tests: true });
                } else {
                    setLoading({ filter: false, table: false });
                    messageHandler('Факультети відсутні', 'warning');
                }
            } catch (e) {
                setLoading({ filter: false, table: false });
                errorHandler(
                    'Сталася помилка під час отримання списку факультетів! Спробуйте знову',
                );
            }
        })();
        (async function getTestsList() {
            try {
                const tests = await ResultsServiceAPI.fetchTests();
                if (tests.data.length) {
                    setTests({ allTests: tests.data, groupTests: [] });
                    setLoading({ filter: false, table: false });
                } else {
                    setLoading({ filter: false, table: false });
                    messageHandler('Тести відсутні', 'warning');
                }
            } catch (e) {
                setLoading({ filter: false, table: false });
                errorHandler('Сталася помилка під час отримання списку тестів! Спробуйте знову');
            }
        })();
    }, [messageHandler]);

    const getGroupsList = async (id) => {
        if (id) {
            try {
                const groups = await ResultsServiceAPI.fetchGroupsByFaculty(id);
                if (groups.data.length) {
                    setGroups(groups.data);
                    setDisabled({ faculties: false, groups: false, tests: true });
                } else {
                    setGroup('');
                    setDisabled({ faculties: false, groups: true, tests: true });
                    messageHandler('Групи відсутні', 'warning');
                }
            } catch (e) {
                errorHandler('Сталася помилка під час отримання списку груп! Спробуйте знову');
            }
        } else {
            messageHandler('Сталася помилка при отриманні даних! Спробуйте знову', 'error');
        }
    };

    const getGroup = async (id) => {
        if (id) {
            messageHandler('Групу вибрано', 'success');
            setIds({ groupId: id, testId: null });
            try {
                const response = await ResultsServiceAPI.fetchResultTestIdsByGroup(id);
                if (response.data.length) {
                    setTests((prevState) => {
                        prevState.groupTests = prevState.allTests.filter((t) =>
                            response.data.some((i) => i.test_id === t.test_id),
                        );
                        return {
                            allTests: [...prevState.allTests],
                            groupTests: [...prevState.groupTests],
                        };
                    });
                    setDisabled({ faculties: false, groups: false, tests: false });
                } else {
                    setTest('');
                    setDisabled({ faculties: false, groups: false, tests: true });
                    messageHandler('Немає доступних тестів у вибраної групи', 'warning');
                }
            } catch (e) {
                errorHandler(
                    'Сталася помилка під час отримання списку тестів групи! Спробуйте знову',
                );
            }
        } else {
            messageHandler('Сталася помилка при отриманні даних! Спробуйте знову', 'error');
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
                                            await getGroupsList(+event.target.value);
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
