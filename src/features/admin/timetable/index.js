import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { findIndex } from 'lodash';

import classes from './index.module.css';
import FormDialog from './formDialog/formDialog';
import TableComponent from './table';
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
    const [openForm, setOpenForm] = useState(false);
    const [timetableData, setTimetableData] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [editEntity, setEditEntity] = useState({});
    const [deleteEntity, setDeleteEntity] = useState({ delete: false });
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [createEntity, setCreateEntity] = useState({ create: false });
    const [snack, setSnack] = useState({ open: false });

    useEffect(() => {
        getGroupsAndSubjects();
    }, []);
    useEffect(() => {
        if (groups.length) {
            getTimetableData();
        }
    }, [groups]);
    const getTimetableData = () => {
        getTimetableRecords(id).then((res) => {
            if (res.data.response === 'no records') {
                return;
            } else {
                addGroupName(res.data);
            }
        });
    };
    const getGroupsAndSubjects = () => {
        getRecords('Group').then((res) => {
            setGroups(res.data);
        });
        getRecords('Subject').then((res) => {
            setSubjects(res.data);
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
            updateEntities('TimeTable', editEntity.id, editEntity.data).then((res) => {
                setRenderData((prevVal) => {
                    res.data[0].group_name = group[0].group_name;
                    const updateIndex = findIndex(prevVal, (o) => {
                        return o.timetable_id === res.data[0].timetable_id;
                    });
                    prevVal[updateIndex] = res.data[0];
                    return [...prevVal];
                });
                console.log(renderData);
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
                    }
                })
                .catch(() => {
                    setSnack({
                        open: true,
                        type: 'error',
                        message: 'Не вдалось видалити спробуйте пізніше',
                    });
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
                })
                .catch(() => {
                    setSnack({
                        open: true,
                        type: 'error',
                        message: 'Розклад для цієї групи уже існує',
                    });
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
                    Додати новий розклад
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
            />
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </>
    );
}
