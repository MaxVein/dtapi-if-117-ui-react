import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classes from './table.module.scss';

export default function TableHeadComponent({ handleSorting, titleRow, sort }) {
    return (
        <TableHead>
            <TableRow>
                {titleRow.map((elem) => {
                    return (
                        <TableCell
                            key={elem.sortingName}
                            align="left"
                            onClick={() => handleSorting(elem.sortingName)}
                        >
                            <div className={classes.tableHeadTitle}>
                                <span className={classes.sortingArrows}>
                                    {sort[elem.sortingName] ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </span>
                                {elem.name}
                            </div>
                        </TableCell>
                    );
                })}
                <TableCell align="left">Дії</TableCell>
            </TableRow>
        </TableHead>
    );
}
