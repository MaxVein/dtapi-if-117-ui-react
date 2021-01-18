import React, { useState } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

import GroupAddDialog from './GroupAddDialog';
import ConfirmDelete from './ConfirmDelete';

import styles from './Groups.module.css';

const GroupRow = ({
    groupData,
    specialityData,
    facultyData,
    setGroupsData,
    groupsData,
    setEditGroup,
    setDeleteGroup,
}) => {
    const [edit, setEdit] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const dialogOpenHandler = () => {
        setEdit(true);
    };

    const dialogOpenDelHandler = () => {
        setOpenDel(true);
    };
    return (
        <TableRow key={uuidv4()}>
            <TableCell>{groupData.group_id}</TableCell>
            <TableCell>{groupData.group_name}</TableCell>
            <TableCell>{groupData.speciality_name}</TableCell>
            <TableCell>{groupData.faculty_name}</TableCell>
            <TableCell>
                <div>
                    <Link
                        to={{
                            pathname: `/admin/students/${groupData.group_id}`,
                            query: { group_name: groupData.group_name },
                        }}
                    >
                        <Button
                            color="primary"
                            disableElevation
                            variant="contained"
                            className={styles.button}
                        >
                            <GroupIcon />
                        </Button>
                    </Link>
                    <Button
                        disableElevation
                        variant="contained"
                        className={styles.button}
                        color="primary"
                        onClick={dialogOpenHandler}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        onClick={dialogOpenDelHandler}
                        disableElevation
                        variant="contained"
                        className={styles.button}
                        color="primary"
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            </TableCell>
            {edit ? (
                <GroupAddDialog
                    setEdit={setEdit}
                    open={edit}
                    specialityData={specialityData}
                    facultyData={facultyData}
                    setGroupsData={setGroupsData}
                    group={groupData}
                    groupsData={groupsData}
                    setEditGroup={setEditGroup}
                />
            ) : null}
            {openDel ? (
                <ConfirmDelete
                    open={openDel}
                    setGroupsData={setGroupsData}
                    group={groupData}
                    setShowDelDialog={setOpenDel}
                    groupsData={groupsData}
                    setDeleteGroup={setDeleteGroup}
                />
            ) : null}
        </TableRow>
    );
};

export default GroupRow;
