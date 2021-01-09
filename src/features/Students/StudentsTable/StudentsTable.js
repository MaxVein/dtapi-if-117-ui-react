import React, { useEffect, useState } from "react";
import { StudentsServiceAPI } from "../services/StudentsService";
import StudentsCreateUpdateModal from "../StudentsCreateUpdateModal/StudentsCreateUpdateModal";
import StudentsConfirm from "../StudentsConfirm/StudentsConfirm";
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
  TablePagination,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import ReportIcon from "@material-ui/icons/Report";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import EditIcon from "@material-ui/icons/Edit";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import DeleteIcon from "@material-ui/icons/Delete";
import StudentsViewModal from "../StudentsViewModal/StudentsViewModal";

const StudentsTable = ({ students, setSnackBar, setError, errorHandler }) => {
  const [dataSource, setDataSource] = useState([]);
  const displayedColumns = ["No.", "Номер залікової книжки", "ПІБ", "Дії"];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState({
    open: false,
    isUpdate: true,
    type: "Update" | "Transfer" | "Delete" | "View",
    student: {},
  });

  useEffect(() => {
    setDataSource(students);
  }, [students]);

  const remove = async (id) => {
    try {
      const response = await StudentsServiceAPI.remove(id);
      if (response.data.response === "ok") {
        setDataSource((prevState) => {
          const arr = prevState.filter((s) => s.user_id !== id);
          return arr;
        });
        setSnackBar({ open: true, message: "Студента видалено" });
      }
    } catch (e) {
      errorHandler(
        "Сталася помилка! Не вдалося видалити вибраного студента! Спробуйте знову"
      );
    }
  };

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
              {dataSource
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student, index) => (
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
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() =>
                              setOpen({
                                open: true,
                                type: "View",
                                student: student,
                              })
                            }
                          >
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
                                type: "Update",
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
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() =>
                              setOpen({
                                open: true,
                                type: "Delete",
                                student: student,
                              })
                            }
                          >
                            <DeleteIcon className={classes.ActionIcon} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            labelRowsPerPage="Рядків у таблиці"
            className={classes.TablePaginator}
            rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 40, 50, 100]}
            count={dataSource.length}
            page={page}
            onChangePage={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />
        </TableContainer>
      ) : (
        <div className={classes.Empty}>
          <ReportIcon className={classes.EmptyIcon} />
          <h1>Студенти відсутні</h1>
        </div>
      )}
      {open.open && open.type === "Update" ? (
        <StudentsCreateUpdateModal
          open={open.open}
          setOpen={setOpen}
          isUpdate={open.isUpdate}
          student={open.student}
          setSnackBar={setSnackBar}
          setDataSource={setDataSource}
          setError={setError}
        />
      ) : null}
      {open.open && open.type === "View" ? (
        <StudentsViewModal
          open={open.open}
          setOpen={setOpen}
          groupID={open.student.group_id}
          studentID={open.student.user_id}
          setSnackBar={setSnackBar}
          setError={setError}
        />
      ) : null}
      {open.open && open.type === "Delete" ? (
        <StudentsConfirm
          show={open.open}
          hide={setOpen}
          student={open.student}
          remove={remove}
          setSnackBar={setSnackBar}
        />
      ) : null}
    </div>
  );
};

export default StudentsTable;

StudentsTable.propTypes = {
  students: PropTypes.array,
  setSnackBar: PropTypes.func,
  setError: PropTypes.func,
  errorHandler: PropTypes.func,
};
