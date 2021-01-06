import React, { useState, useEffect } from "react";
import { StudentsServiceAPI } from "../services/StudentsService";
import StudentsTable from "../StudentsTable/StudentsTable";
import Loader from "../../../components/Loader/Loader";
import classes from "./StudentsPage.module.css";

import { Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HowToRegIcon from "@material-ui/icons/HowToReg";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function getStudentsByGroup() {
      const students = await StudentsServiceAPI.fetchStudentsByGroup(494, true);
      console.log(students);
      setStudents(students);
      setLoading(false);
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
        >
          Додати студента
        </Button>
      </div>
      {loading ? <Loader /> : <StudentsTable students={students} />}
    </div>
  );
};

export default StudentsPage;
