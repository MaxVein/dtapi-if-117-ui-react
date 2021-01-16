import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import { Group } from '@material-ui/icons';
import AddCircle from '@material-ui/icons/AddCircle';

import { getGroupsData, updateGroupsData, addGroupsData, delGroupsData } from './GroupsService';
import SnackbarHandler from '../../../common/components/Snackbar/snackbar';
import GroupRow from './GroupRow';
import GroupAddDialog from './GroupAddDialog';
import GroupFilter from './GroupFilter';
import styles from './Groups.module.css';
import { UseLanguage } from '../../../lang/LanguagesContext';

const Groups = () => {
    const { t } = UseLanguage();

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupsData, setGroupsData] = useState([]);
    const [allGroupsData, setAllGroupsData] = useState([]);
    const [snack, setSnack] = useState({ open: false, message: '', type: 'success' });

    const [facultyData, setFacultyData] = useState([]);
    const [specialityData, setSpecialityData] = useState([]);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [isFacFilter, setIsFacFilter] = useState(false);
    const [editGroup, setEditGroup] = useState({
        edit: false,
        data: {},
        editId: 0,
        isChanged: false,
    });
    const [addGroup, setAddGroup] = useState({
        add: false,
        data: {},
    });
    const [deleteGroup, setDeleteGroup] = useState({
        delete: false,
        id: 0,
    });
    useEffect(async () => {
        const response = await getGroupsData();
        if (Array.isArray(response)) {
            setSpecialityData(response[1]);
            setFacultyData(response[2]);
            setGroupsData(response[0]);
            setAllGroupsData(response[0]);
            setLoading(false);
            setSnack({
                open: true,
                message: 'Групи успішно завантажені',
                type: 'success',
            });
        } else {
            setLoading(false);
            setSnack({
                open: true,
                message: response.err,
                type: 'success',
            });
        }
    }, []);

    useEffect(async () => {
        if (!editGroup.isChanged && editGroup.edit) {
            setSnack({
                open: true,
                message: 'Нічого не змінено',
                type: 'info',
            });
        } else {
            if (editGroup.edit) {
                const response = await updateGroupsData(
                    groupsData,
                    editGroup,
                    facultyData,
                    specialityData,
                );
                if (Array.isArray(response)) {
                    setGroupsData(response);
                    setOpen(false);
                    setSnack({
                        open: true,
                        message: 'Групу редаговано',
                        type: 'success',
                    });
                } else {
                    setSnack({
                        open: true,
                        message: response.err,
                        type: 'error',
                    });
                    setOpen(false);
                }
            }
        }
    }, [editGroup]);

    useEffect(async () => {
        if (addGroup.add) {
            const response = await addGroupsData(addGroup, facultyData, specialityData);
            console.log(response);
            if (!response.err) {
                setGroupsData([...groupsData, response]);
                setAllGroupsData([...groupsData, response]);
                setOpen(false);
                setPage(Math.floor((groupsData.length - 1) / rowsPerPage));
                setSnackMes('Групу додано');
                setOpenSnack(true);
                setSnack({
                    open: true,
                    message: 'Групу додано',
                    type: 'success',
                });
            } else {
                setOpen(false);
                setSnack({
                    open: true,
                    message: response.err,
                    type: 'error',
                });
            }
        }
    }, [addGroup]);

    useEffect(async () => {
        if (deleteGroup.delete) {
            const response = await delGroupsData(deleteGroup.id, groupsData);
            console.log(response);
            if (Array.isArray(response)) {
                setGroupsData(response);
                setPage(Math.ceil((groupsData.length - 1) / rowsPerPage) - 1);
                setSnack({
                    open: true,
                    message: 'Групу видалено',
                    type: 'success',
                });
            } else {
                setOpen(false);
                setSnack({
                    open: true,
                    message: response.err,
                    type: 'error',
                });
            }
        }
    }, [deleteGroup]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const dialogOpenHandler = () => {
        setOpen(true);
    };
    const setAllGroupData = () => {
        setGroupsData(allGroupsData);
    };
    const filterByFaculty = () => {
        setFilter(true);
        setIsFacFilter(true);
        const newData = [];
        facultyData.forEach((item) => {
            newData.push(item.faculty_name);
        });
        setFilterData(newData);
    };

    const filterBySpec = () => {
        setFilter(true);
        const newData = [];
        specialityData.forEach((item) => {
            newData.push(item.speciality_name);
        });
        setFilterData(newData);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const fieldsName = [
        t('groups.table.id'),
        t('groups.table.groupCode'),
        t('groups.table.speciality'),
        t('groups.table.faculty'),
        t('groups.table.actions'),
    ];
    return loading ? (
        <div className={styles.loader}>
            <CircularProgress />
        </div>
    ) : (
        <div>
            <div className={styles.entityHeader}>
                <Typography
                    component="h2"
                    variant="h4"
                    color="textPrimary"
                    className={styles.entityHeaderTitle}
                >
                    <Group fontSize="large" />
                    {t('groups.title')}
                </Typography>
                <Button
                    onClick={dialogOpenHandler}
                    disableElevation
                    variant="contained"
                    color="primary"
                    className={styles.entityHeaderButton}
                >
                    <AddCircle />
                    {t('groups.addButton')}
                </Button>
            </div>
            <div>
                <Button variant="outlined" startIcon={<SearchIcon />} onClick={filterBySpec}>
                    {t('groups.filters.speciality')}
                </Button>
                <Button variant="outlined" startIcon={<SearchIcon />} onClick={filterByFaculty}>
                    {t('groups.filters.faculty')}
                </Button>
                <Button variant="outlined" startIcon={<SearchIcon />} onClick={setAllGroupData}>
                    {t('groups.filters.allGroup')}
                </Button>
            </div>
            <div style={{ boxShadow: '0.5rem 1rem 2rem gray' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {fieldsName.map((elem) => (
                                <TableCell key={uuidv4()}>{elem}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupsData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((groupData) => (
                                <GroupRow
                                    groupData={groupData}
                                    key={uuidv4()}
                                    specialityData={specialityData}
                                    facultyData={facultyData}
                                    setGroupsData={setGroupsData}
                                    groupsData={groupsData}
                                    setEditGroup={setEditGroup}
                                    setDeleteGroup={setDeleteGroup}
                                    setOpen={setOpen}
                                    open={open}
                                />
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage={t('labelRowsPerPage')}
                    component="div"
                    count={groupsData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
            <GroupAddDialog
                setOpen={setOpen}
                open={open}
                specialityData={specialityData}
                facultyData={facultyData}
                setGroupsData={setGroupsData}
                groupsData={groupsData}
                setAllGroupsData={setAllGroupsData}
                setAddGroup={setAddGroup}
            />
            <GroupFilter
                setFilter={setFilter}
                open={filter}
                data={filterData}
                setGroupsData={setGroupsData}
                groupsData={groupsData}
                isFacFilter={isFacFilter}
                allGroupsData={allGroupsData}
                setIsFacFilter={setIsFacFilter}
                setSnack={setSnack}
            />
            <SnackbarHandler snack={snack} setSnack={setSnack} />
        </div>
    );
};

export default Groups;
