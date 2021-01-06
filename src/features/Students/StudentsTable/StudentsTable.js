import React, { useState } from "react";
import StudentsCreateUpdateModal from "../StudentsCreateUpdateModal/StudentsCreateUpdateModal";
import PropTypes from "prop-types";
import classes from "./StudentsTable.module.css";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import ReportIcon from "@material-ui/icons/Report";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import EditIcon from "@material-ui/icons/Edit";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import DeleteIcon from "@material-ui/icons/Delete";

const StudentsTable = ({ students }) => {
  const [dataSource] = useState(students || []);
  const displayedColumns = ["No.", "Номер залікової книжки", "ПІБ", "Дії"];
  const [open, setOpen] = useState({
    open: false,
    isUpdate: true,
    student: {},
  });

  return (
    <div className={classes.Table}>
      {students.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {displayedColumns.map((column, index) => (
                  <TableCell key={column + index}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSource.map((student, index) => (
                <TableRow key={student.user_id + index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.gradebook_id}</TableCell>
                  <TableCell>
                    {student.student_surname}&nbsp;
                    {student.student_name}&nbsp;
                    {student.student_fname}
                  </TableCell>
                  <TableCell>
                    <div className={classes.Actions}>
                      <Tooltip title="Переглянути дані студента">
                        <Button color="primary" variant="contained">
                          <AssignmentIndIcon className={classes.ActionIcon} />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Редагувати дані студента">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() =>
                            setOpen({
                              open: true,
                              isUpdate: true,
                              student: student,
                            })
                          }
                        >
                          <EditIcon className={classes.ActionIcon} />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Перевести студента до іншої групи">
                        <Button color="primary" variant="contained">
                          <CompareArrowsIcon className={classes.ActionIcon} />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Видалити студента">
                        <Button color="primary" variant="contained">
                          <DeleteIcon className={classes.ActionIcon} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className={classes.Empty}>
          <ReportIcon className={classes.EmptyIcon} />
          <h1>Студенти відсутні</h1>
        </div>
      )}
      <StudentsCreateUpdateModal
        open={open.open}
        setOpen={setOpen}
        isUpdate={open.isUpdate}
        student={open.student}
      />
    </div>
  );
};

export default StudentsTable;

StudentsTable.propTypes = {
  students: PropTypes.array,
};
