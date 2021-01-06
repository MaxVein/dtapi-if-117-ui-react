import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { StudentsServiceAPI } from "../services/StudentsService";
import StudentsTable from "../StudentsTable/StudentsTable";
import StudentsCreateUpdateModal from "../StudentsCreateUpdateModal/StudentsCreateUpdateModal";
import Loader from "../../../components/Loader/Loader";
import SnackBar from "../../../components/SnackBar/SnackBar";
import Alert from "../../../components/Alert/Alert";
import classes from "./StudentsPage.module.css";

import { Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HowToRegIcon from "@material-ui/icons/HowToReg";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState({ open: false, isUpdate: false });
  const [loading, setLoading] = useState(true);
  const [snackBar, setSnackBar] = useState({ open: false, message: "" });
  const [error, setError] = useState({ error: false, message: "", type: "" });
  const history = useHistory();

  useEffect(() => {
    (async function getStudentsByGroup() {
      try {
        const students = await StudentsServiceAPI.fetchStudentsByGroup(
          494,
          true
        );
        if (students.data.length) {
          setSnackBar({ open: true, message: "Студентів завантажено" });
          setStudents(students.data);
          setLoading(false);
        } else {
          setSnackBar({ open: true, message: "Студенти відсутні" });
          setStudents([]);
          setLoading(false);
        }
      } catch (e) {
        setError({
          error: true,
          message:
            "Сталася помилка! Не вдалося завантажити студентів даної групи! Спробуйте знову",
          type: "Помилка",
        });
        history.push("/admin/group");
      }
    })();
  }, []);

  return (
    <div className={classes.Page}>
      <div className={classes.Header}>
        <h1>
          <HowToRegIcon className={classes.Icon} />
          Студенти групи ІПмз-20-1
        </h1>
        <Button
          className={classes.Button}
          startIcon={<AddCircleIcon />}
          size="large"
          color="primary"
          variant="contained"
          onClick={() => setOpen({ open: true, isUpdate: false })}
        >
          Додати студента
        </Button>
      </div>
      {loading ? <Loader /> : <StudentsTable students={students} />}
      <SnackBar
        show={snackBar.open}
        message={snackBar.message}
        hide={setSnackBar}
      />
      {error ? (
        <Alert
          show={error.error}
          message={error.message}
          type={error.type}
          hide={setError}
        />
      ) : null}
      <StudentsCreateUpdateModal
        open={open.open}
        setOpen={setOpen}
        isUpdate={open.isUpdate}
        groupID={494}
      />
    </div>
  );
};

export default StudentsPage;
