import React, { useState } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';

import GroupAddDialog from './GroupAddDialog';
import ConfirmDelete from './ConfirmDelete';

const GroupRow = ({ groupData, specialityData, facultyData, setGroupsData, groupsData }) => {
    const [edit, setEdit] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [showDelDialog, setShowDelDialog] = useState(false);

    const dialogOpenHandler = () => {
        setEdit(true);
        setShowDialog(true);
    };

    const dialogOpenDelHandler = () => {
        setOpenDel(true);
        setShowDelDialog(true);
    };
    return (
        <TableRow key={uuidv4()}>
            <TableCell>{groupData.group_id}</TableCell>
            <TableCell>{groupData.group_name}</TableCell>
            <TableCell>{groupData.speciality_name}</TableCell>
            <TableCell>{groupData.faculty_name}</TableCell>
            <TableCell>
                <div>
                    <Button color="primary" onClick={dialogOpenHandler}>
                        <EditIcon />
                    </Button>
                    <Button color="primary" onClick={dialogOpenDelHandler}>
                        <DeleteIcon />
                    </Button>
                </div>
            </TableCell>
            {showDialog ? (
                <GroupAddDialog
                    setEdit={setEdit}
                    open={edit}
                    specialityData={specialityData}
                    facultyData={facultyData}
                    setGroupsData={setGroupsData}
                    group={groupData}
                    groupsData={groupsData}
                />
            ) : null}
            {showDelDialog ? (
                <ConfirmDelete
                    setEdit={setOpenDel}
                    open={openDel}
                    setGroupsData={setGroupsData}
                    group={groupData}
                    setShowDelDialog={setShowDelDialog}
                    groupsData={groupsData}
                />
            ) : null}
        </TableRow>
    );
};

export default GroupRow;
