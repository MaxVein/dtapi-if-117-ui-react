import React, { useEffect, useState } from "react";
import { StudentsServiceAPI } from "../services/StudentsService";
import CreateUpdateForm from "./CreateUpdateForm/CreateUpdateForm";
import PropTypes from "prop-types";
import classes from "./StudentsCreateUpdateModal.module.css";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const StudentsCreateUpdateModal = ({
  open,
  isUpdate,
  groupID,
  student,
  setStudents,
  setDataSource,
  setOpen,
  setError,
  setSnackBar,
}) => {
  const [studentData, setStudentData] = useState(
    isUpdate && student ? { ...student } : { group_id: groupID }
  );
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(!!isUpdate);

  useEffect(() => {
    if (isUpdate && student) {
      (async function getStudentInfo(id) {
        try {
          const student = await StudentsServiceAPI.fetchStudentDataForUpdate(
            id
          );
          setStudentData((prevState) => ({
            ...prevState,
            ...student[0],
          }));
          setLoading(false);
        } catch (e) {
          errorHandler(
            "Помилка",
            "Сталася помилка при отриманні даних студента. Спробуйте знову",
            "Закрито через помилку"
          );
        }
      })(student.user_id);
    }
  }, [isUpdate, student, setOpen, setError, setSnackBar]);

  useEffect(() => {
    if (submit && studentData) {
      setLoading(true);
      if (isUpdate) {
        (async function update() {
          try {
            const res = await StudentsServiceAPI.update(
              studentData.user_id,
              studentData
            );
            if (res.data.response === "ok") {
              setDataSource((prevState) => {
                const index = prevState.findIndex(
                  (s) => s.user_id === studentData.user_id
                );
                prevState[index] = studentData;
                return [...prevState];
              });
              setLoading(false);
              setOpen(false);
              setSnackBar({ open: true, message: "Дані студента змінено" });
            }
          } catch (e) {
            if (e.response.data.response === "Error when update") {
              errorHandler(
                "Попередження",
                "Сталася помилка під час оновлення даних студента. Щоб оновити дані студента слід здійснити зміни у поточних даних",
                "Зміни не було внесено!"
              );
            } else {
              errorHandler(
                "Помилка",
                "Сталася помилка під час оновлення даних студента. Спробуйте знову",
                "Закрито через помилку"
              );
            }
          }
        })();
      } else {
        (async function create() {
          try {
            const res = await StudentsServiceAPI.create(studentData);
            const { id, response } = res.data;
            if (id && response === "ok") {
              studentData.user_id = id.toString();
              setStudents((prevState) => [...prevState, studentData]);
              setLoading(false);
              setOpen(false);
              setSnackBar({ open: true, message: "Студента додано" });
            }
          } catch (e) {
            errorHandler(
              "Помилка",
              "Сталася помилка під час створення студента. Спробуйте знову",
              "Закрито через помилку"
            );
          }
        })();
      }
    }
  }, [
    submit,
    studentData,
    setStudents,
    isUpdate,
    setSnackBar,
    setOpen,
    setError,
    setLoading,
    setDataSource,
  ]);

  const errorHandler = (type, errorMessage, snackMessage) => {
    setLoading(false);
    setOpen({ open: false });
    setSnackBar({ open: true, message: snackMessage });
    setError({
      error: true,
      message: errorMessage,
      type: type,
    });
  };

  return (
    <Paper className={classes.Dialog} elevation={0} variant={"outlined"}>
      <Dialog
        autoScrollBodyContent={false}
        fullWidth={false}
        maxWidth={false}
        className={classes.Dialog}
        open={open}
      >
        {loading ? (
          <CircularProgress
            className={classes.Spinner}
            color={"primary"}
            size={80}
            variant="indeterminate"
          />
        ) : (
          <div className={classes.StudentsDialog}>
            <DialogTitle
              disableTypography={true}
              className={classes.DialogTitle}
            >
              <h1>
                {isUpdate ? (
                  <EditIcon className={classes.TitleIcon} />
                ) : (
                  <PersonAddIcon className={classes.TitleIcon} />
                )}
                {isUpdate
                  ? "Редагувати дані студента"
                  : "Додати нового студента"}
              </h1>
            </DialogTitle>
            <DialogContent className={classes.DialogContent}>
              <CreateUpdateForm
                isUpdate={isUpdate}
                updateData={studentData}
                setSnackBar={setSnackBar}
                setOpen={setOpen}
                setStudentData={setStudentData}
                setSubmit={setSubmit}
              />
            </DialogContent>
          </div>
        )}
      </Dialog>
    </Paper>
  );
};

export default StudentsCreateUpdateModal;

StudentsCreateUpdateModal.propTypes = {
  open: PropTypes.bool,
  isUpdate: PropTypes.bool,
  groupID: PropTypes.string,
  student: PropTypes.object,
  setStudents: PropTypes.func,
  setDataSource: PropTypes.func,
  setOpen: PropTypes.func,
  setError: PropTypes.func,
  setSnackBar: PropTypes.func,
};
