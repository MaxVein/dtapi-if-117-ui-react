import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TableRow, Table, TableCell } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    button: {
        padding: '0.5rem .5rem',
        cursor: 'pointer',
        minWidth: '1rem',
        marginRight: '0.5rem',
    },
}));

export default function AnswersCard({ answer }) {
    const classes = useStyles();

    return (
        <TableRow>
            <TableCell>{answer.answer_id}</TableCell>
            <TableCell>{answer.answer_text}</TableCell>
        </TableRow>
    );
}
