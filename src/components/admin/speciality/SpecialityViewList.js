import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import SpecialityAddDialig from './SpecialityAddDialog';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import { deleteEntity } from '../../../common/utils';

const SpecialityViewList = ({ speciality, setOpen, setSpecialityDate, specialityDates }) => {
    const { speciality_name, speciality_code, speciality_id } = speciality;
    const [edit, setEdit] = useState(false);
    const editSpecialityHandler = () => {
        setEdit(true);
    };
    const deleteSpecialityHandler = () => {
        deleteEntity('Speciality', speciality_id).then((res) => {
            if (res.data.response === 'ok') {
                const newArray = specialityDates.filter(
                    (item) => item.speciality_id !== speciality_id,
                );
                setSpecialityDate(newArray);
            }
        });
    };
    return (
        <TableRow>
            <TableCell>{speciality_id}</TableCell>
            <TableCell>{speciality_name}</TableCell>
            <TableCell>{speciality_code}</TableCell>
            <TableCell>
                <div>
                    <Button color="primary" onClick={editSpecialityHandler}>
                        <EditIcon />
                    </Button>
                    <Button color="primary" onClick={deleteSpecialityHandler}>
                        <DeleteIcon />
                    </Button>
                </div>
            </TableCell>

            <SpecialityAddDialig
                open={edit}
                setSpecialityDate={setSpecialityDate}
                setOpen={setOpen}
                specialityDates={specialityDates}
                speciality={speciality}
                setEdit={setEdit}
            />
        </TableRow>
    );
};
export default SpecialityViewList;
