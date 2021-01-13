import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function TableHeadComponent({ titleRow }) {
    return (
        <TableHead>
            <TableRow>
                {titleRow.map((name) => {
                    return (
                        <TableCell key={name} align="left">
                            <div className="table-head-title">{name}</div>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
}
