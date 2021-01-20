import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { findIndex } from 'lodash';

import classes from './index.module.css';
import FormDialog from './formDialog/formDialog';
import TableComponent from '../../../common/components/Table';
import TableList from './table/tableList';
import {
    getTimetableRecords,
    getRecords,
    concatArrays,
    createEntities,
    deleteEntities,
    converTimetablesData,
    updateEntities,
} from '../subjects/apiService';
import SnackbarHandler from '../../../common/components/Snackbar/snackbar';

export default function Timetable() {
    let location = useLocation();
    const { id, name } = location.state;
    const titleRow = [
        'ID',
        'Група',
        'Дата початку',
        'Час початку',
        'Дата закінчення',
        'Час закінчення',
        'Дії',
    ];
    const messages = {
        error: 'Виникли проблеми на сервері спробуйте пізніше',
        duplicate: 'Розклад для цієї групи уже існує',
        create: 'Розклад додано',
        edit: 'Розклад оновлено',
        delete: 'Розклад видалено',
    };

    const [openForm, setOpenForm] = useState(false);
    const [renderData, setRenderData] = useState([]);
    const [editEntity, setEditEntity] = useState({});
    const [deleteEntity, setDeleteEntity] = useState({ delete: false });
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [createEntity, setCreateEntity] = useState({ create: false });
    const [snack, setSnack] = useState({ open: false });

    const errorSnack = (message) => {
        setSnack({
            open: true,
            type: 'error',
            message: message,
        });
    };
    const successSnack = (message) => {
        setSnack({ open: true, type: 'success', message: message });
    };
    useEffect(() => {
        getGroupsAndSubjects();
    }, []);
    useEffect(() => {
        if (groups.length) {
            getTimetableData();
        }
    }, [groups]);
    const getTimetableData = () => {
        getTimetableRecords(id)
            .then((res) => {
                if (res.data.response === 'no records') {
                    return;
                } else {
                    addGroupName(res.data);
                }
            })
            .catch(() => {
                errorSnack(messages.error);
            });
    };
    const getGroupsAndSubjects = () => {
        getRecords('Group')
            .then((res) => {
                setGroups(res.data);
            })
            .catch(() => {
                errorSnack(messages.error);
            });
        getRecords('Subject')
            .then((res) => {
                setSubjects(res.data);
            })
            .catch(() => {
                errorSnack(messages.error);
            });
    };
    const addGroupName = (data) => {
        const groupsId = data.map((elem) => {
            return elem.group_id;
        });
        let newTableData = data.sort((a, b) => {
            return +a.group_id > +b.group_id ? 1 : +b.group_id > +a.group_id ? -1 : 0;
        });
        if (groupsId.length) {
            setRenderData(concatArrays(groups, newTableData, groupsId));
        }
    };
    //Edit
    const handleEditEntity = (item) => {
        setEditEntity({ edit: true, data: item, first: true });
        setOpenForm(true);
    };
    useEffect(() => {
        if (editEntity.edit && !editEntity.equal && !editEntity.first) {
            converTimetablesData(editEntity.data);
            delete editEntity.data.timetable_id;
            const group = groups.filter((elem) => {
                return elem.group_id === editEntity.data.group_id;
            });
            delete editEntity.data.group_name;
            updateEntities('TimeTable', editEntity.id, editEntity.data)
                .then((res) => {
                    setRenderData((prevVal) => {
                        res.data[0].group_name = group[0].group_name;
                        const updateIndex = findIndex(prevVal, (o) => {
                            return o.timetable_id === res.data[0].timetable_id;
                        });
                        prevVal[updateIndex] = res.data[0];
                        return [...prevVal];
                    });
                    successSnack(messages.edit);
                })
                .catch(() => {
                    errorSnack(messages.error);
                });
        }
    }, [editEntity]);
    // Delete
    useEffect(() => {
        if (deleteEntity.delete) {
            deleteEntities('TimeTable', deleteEntity.id)
                .then((res) => {
                    if (res.data.response === 'ok') {
                        setRenderData((prevVal) => {
                            return prevVal.filter((elem) => {
                                return elem.timetable_id !== deleteEntity.id;
                            });
                        });
                        successSnack(messages.delete);
                    }
                })
                .catch(() => {
                    errorSnack(messages.error);
                });
        }
    }, [deleteEntity]);
    //create
    const handleClickCreate = () => {
        setOpenForm(true);
        setEditEntity({});
    };
    useEffect(() => {
        if (createEntity.create) {
            converTimetablesData(createEntity.data);
            delete createEntity.data.timetable_id;
            delete createEntity.data.group_name;
            createEntities('TimeTable', createEntity.data)
                .then((res) => {
                    setRenderData((prevVal) => {
                        const group = groups.filter(
                            (elem) => elem.group_id === res.data[0].group_id,
                        );
                        res.data[0].group_name = group[0].group_name;
                        return [...res.data, ...prevVal];
                    });
                    successSnack(messages.create);
                })
                .catch(() => {
                    errorSnack(messages.duplicate);
                });
        }
    }, [createEntity]);

    return (
        <>
            <div className={classes.timetableContainer}>
                <div className={classes.timetableTitle}>
                    Розклад тестів для предмету:
                    <b>
                        <em> {name}</em>
                    </b>
                </div>
                <Button variant="contained" color="primary" onClick={handleClickCreate}>
                    <AddCircleIcon /> Додати новий розклад
                </Button>
            </div>
            {openForm && (
                <FormDialog
                    groups={groups}
                    editEntity={editEntity}
                    openForm={openForm}
                    setSnack={setSnack}
                    setOpenForm={setOpenForm}
                    setEditEntity={setEditEntity}
                    subject_id={id}
                    subjects={subjects}
                    setCreateEntity={setCreateEntity}
                />
            )}
            <TableComponent
                entity={renderData}
                handleEditEntity={handleEditEntity}
                setDeleteEntity={setDeleteEntity}
                titleRow={titleRow}
                TableList={TableList}
                entityNameId={'timetable_id'}
                noData={'Немає розкладу для заданого предмету'}
            />
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </>
    );
}
