import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import { findIndex } from 'lodash';

import SnackbarHandler from '../../../common/components/Snackbar/snackbar';
import {
    getRecords,
    createEntities,
    deleteEntities,
    updateEntities,
    filterArr,
} from './apiService';
import FormDialog from './dialogs/dialog';
import SearchComponent from './searchComponent';
import TableComponent from '../../../common/components/Table';
import TableList from './table/tableList';
import { UseLanguage } from '../../../lang/LanguagesContext';

export default function Subjects() {
    const { t } = UseLanguage();
    const titleRow = [
        t('subjects.table.id'),
        t('subjects.table.name'),
        t('subjects.table.description'),
        t('subjects.table.actions'),
    ];
    const messages = {
        error: t('subjects.messages.error'),
        duplicate: t('subjects.messages.duplicate'),
        create: t('subjects.messages.create'),
        edit: t('subjects.messages.edit'),
        delete: t('subjects.messages.delete'),
        noEdit: t('subjects.messages.noEdit'),
    };
    const [initialSubjectData, setInitialSubjectData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [subjectCreate, setCreateSubject] = useState({ create: false, data: {} });
    const [snack, setSnack] = useState({ open: false });
    const [deleteEntity, setDeleteEntity] = useState({ delete: false, id: '' });
    const [openForm, setOpenForm] = useState(false);
    const [editSubject, setEditSubject] = useState({
        edit: false,
        data: {},
        equal: false,
    });
    const [searchData, setSearchData] = useState('');

    const showSnack = (type, message) => {
        setSnack({
            open: true,
            type: type,
            message: message,
        });
    };
    //Read
    useEffect(() => {
        getRecords('Subject').then((res) => {
            setInitialSubjectData(res.data);
            setSubjectData(res.data);
        });
    }, []);

    //Create
    const handleClickCreate = () => {
        setOpenForm(true);
        setEditSubject({});
    };
    useEffect(() => {
        if (subjectCreate.create) {
            createEntities('Subject', subjectCreate.data)
                .then((res) => {
                    setSubjectData((prevVal) => [...res.data, ...prevVal]);
                    setOpenForm(false);
                    showSnack('success', messages.create);
                })
                .catch(() => {
                    showSnack('error', messages.duplicate);
                });
        }
    }, [subjectCreate]);
    //Delete
    useEffect(() => {
        if (deleteEntity.delete) {
            deleteEntities('Subject', deleteEntity.id)
                .then((res) => {
                    if (res.data.response === 'ok') {
                        setSubjectData((prevVal) => {
                            return prevVal.filter((elem) => elem.subject_id !== deleteEntity.id);
                        });
                        showSnack('success', messages.delete);
                    }
                })
                .catch(() => {
                    showSnack('error', messages.error);
                });
        }
    }, [deleteEntity]);

    //Update
    const handleEditEntity = (item) => {
        setOpenForm(true);
        setEditSubject({ edit: true, data: item, equal: true, first: true });
    };
    useEffect(() => {
        if (editSubject.equal && !editSubject.first) {
            showSnack('warning', messages.noEdit);
        } else if (editSubject.edit && !editSubject.equal) {
            const body = {
                subject_description: editSubject.data.subject_description,
                subject_name: editSubject.data.subject_name,
            };
            updateEntities('Subject', editSubject.data.subject_id, body)
                .then((res) => {
                    setOpenForm(false);
                    setSubjectData((prevVal) => {
                        const updateIndex = findIndex(prevVal, (o) => {
                            return o.subject_id === res.data[0].subject_id;
                        });
                        prevVal[updateIndex] = res.data[0];
                        return [...prevVal];
                    });
                    showSnack('success', messages.edit);
                })
                .catch(() => {
                    showSnack('error', messages.error);
                });
        }
    }, [editSubject]);
    //search
    useEffect(() => {
        if (searchData !== '') {
            setSubjectData(() => {
                return filterArr(initialSubjectData, searchData);
            });
        } else {
            setSubjectData(initialSubjectData);
        }
    }, [searchData]);
    return (
        <div className="subjects-container">
            <div className="subject-btn">
                <Typography component="h2" variant="h4" color="textPrimary" gutterBottom>
                    {t('subjects.title')}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClickCreate}>
                    {t('subjects.addButton')}
                </Button>
            </div>
            {openForm && (
                <FormDialog
                    editSubject={editSubject}
                    openForm={openForm}
                    setCreateSubject={setCreateSubject}
                    setOpenForm={setOpenForm}
                    setEditSubject={setEditSubject}
                />
            )}
            <SearchComponent setSearchData={setSearchData} />
            <TableComponent
                entity={subjectData}
                handleEditEntity={handleEditEntity}
                setDeleteEntity={setDeleteEntity}
                titleRow={titleRow}
                TableList={TableList}
                entityNameId={'subject_id'}
            />
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </div>
    );
}
