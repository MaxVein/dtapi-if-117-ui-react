import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import TableComponent from './table';
import { getTimetableRecords } from '../subjects/apiService';

export default function Timetable() {
    let location = useLocation();
    const { id, name } = location.state;
    console.log(`location.state`, location.state);
    const [timetableData, setTimetableData] = useState([]);

    useEffect(() => {
        getTimetableRecords(id).then((res) => {
            setTimetableData(res.data);
            console.log(`timetableData`, timetableData);
        });
    }, []);

    const handleEditEntity = () => {};
    const setDeleteEntity = () => {};
    return (
        <TableComponent
            entity={timetableData}
            handleEditEntity={handleEditEntity}
            setDeleteEntity={setDeleteEntity}
        />
    );
}
