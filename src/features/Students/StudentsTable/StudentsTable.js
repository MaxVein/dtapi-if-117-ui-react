import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./StudentsTable.module.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ReportIcon from "@material-ui/icons/Report";

const StudentsTable = ({ students }) => {
  const [dataSource] = useState(students || []);
  const displayedColumns = ["No.", "Номер залікової книжки", "ПІБ", "Дії"];

  return (
    <div className={classes.Table}>
      {students.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              {displayedColumns.map((column, index) => (
                <TableCell key={column + index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource.map(
              (
                {
                  user_id,
                  gradebook_id,
                  student_surname,
                  student_name,
                  student_fname,
                },
                index
              ) => (
                <TableRow key={user_id + index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{gradebook_id}</TableCell>
                  <TableCell>
                    {student_surname}&nbsp;
                    {student_name}&nbsp;
                    {student_fname}
                  </TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      ) : (
        <div className={classes.Empty}>
          <ReportIcon className={classes.EmptyIcon} />
          <h1>Студенти відсутні</h1>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;

StudentsTable.propTypes = {
  students: PropTypes.array,
};
