import React from "react";
import PropTypes from "prop-types";
import classes from "./StudentInfo.module.css";

import { Avatar, Divider } from "@material-ui/core";

const StudentInfo = ({ student }) => {
  return (
    <div className={classes.Container}>
      <div className={classes.Photo}>
        <Avatar className={classes.Avatar} src={student.photo} />
      </div>
      <div className={classes.Info}>
        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>ПІБ</h3>
          </div>
          <div className={classes.Content}>
            <h4>
              {student.student_surname}&nbsp;
              {student.student_name}&nbsp;
              {student.student_fname}
            </h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Факультет/Інститут</h3>
          </div>
          <div className={classes.Content}>
            <h4>{student.faculty_name}</h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Спеціальність</h3>
          </div>
          <div className={classes.Content}>
            <h4>
              {student.speciality_code} {student.speciality_name}
            </h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Група</h3>
          </div>
          <div className={classes.Content}>
            <h4>{student.group_name}</h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Номер залікової книжки</h3>
          </div>
          <div className={classes.Content}>
            <h4>{student.gradebook_id}</h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Електронна пошта</h3>
          </div>
          <div className={classes.Content}>
            <h4>{student.email}</h4>
          </div>
        </div>
        <Divider className={classes.Divider} />

        <div className={classes.Data}>
          <div className={classes.Title}>
            <h3>Унікальне ім'я користувача в системі</h3>
          </div>
          <div className={classes.Content}>
            <h4>{student.username}</h4>
          </div>
        </div>
        <Divider className={classes.Divider} />
      </div>
    </div>
  );
};

export default StudentInfo;

StudentInfo.propTypes = {
  student: PropTypes.object,
};
