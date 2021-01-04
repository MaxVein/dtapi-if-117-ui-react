import React, { useEffect, useState } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import { getEntityData } from '../../../common/utils';
import GroupRow from './GroupRow';

import GroupAddDialog from './GroupAddDialog';

import '../../../styles/app.scss';

const Groups = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupsData, setGroupsData] = useState([]);
    useEffect(() => {
        const source = axios.CancelToken.source();
        (async function fetchData() {
            const requests = [
                getEntityData('Group', source),
                getEntityData('speciality', source),
                getEntityData('faculty', source),
            ];
            const response = await Promise.all(requests);
            const newData = genereteTableData(response);
            setGroupsData(newData);
        })();
        return () => {
            source.cancel();
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const genereteTableData = (data) => {
        const newData = data[0].data;
        newData.map((item) => {
            data[1].data.map((elem) => {
                if (item.speciality_id === elem.speciality_id) {
                    item.speciality_name = elem.speciality_name;
                }
            });
            data[2].data.map((elem) => {
                if (item.faculty_id === elem.faculty_id) {
                    item.faculty_name = elem.faculty_name;
                }
            });
        });
        return newData;
    };

    const fieldsName = ['№', 'Шифр групи', 'Спеціальність', 'Факультет', 'Дії'];
    return (
        <div
            className="groups"
            style={{
                width: '90%',
                margin: 'auto',
            }}
        >
            <div className="header">
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Групи і студенти
                </Typography>
                <Button color="primary">Додати групу</Button>
            </div>
            <div style={{ boxShadow: '0.5rem 1rem 2rem gray' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {fieldsName.map((elem) => (
                                <TableCell key={elem}>{elem}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupsData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((groupData) => (
                                <GroupRow groupData={groupData} key={groupData.group_id} />
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={groupsData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default Groups;
