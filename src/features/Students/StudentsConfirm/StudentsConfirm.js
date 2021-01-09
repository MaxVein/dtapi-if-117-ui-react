import React from "react";
import PropTypes from "prop-types";
import classes from "./StudentsConfirm.module.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
} from "@material-ui/core";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";

const StudentsConfirm = ({ show, hide, student, remove, setSnackBar }) => {
  const cancel = () => {
    hide({ open: false });
    setSnackBar({ open: true, message: "Скасовано" });
  };

  const confirm = () => {
    hide({ open: false });
    remove(student.user_id);
  };

  return (
    <Paper className={classes.Dialog} elevation={0} variant={"outlined"}>
      <Dialog
        open={show}
        className={classes.Dialog}
        autoScrollBodyContent={false}
        fullWidth={false}
        maxWidth={false}
      >
        <div className={classes.StudentsConfirm}>
          <DialogTitle className={classes.Title}>Підтвердіть дію</DialogTitle>
          <DialogContent className={classes.Content}>
            <PersonAddDisabledIcon className={classes.Icon} />
            <DialogContentText className={classes.Message}>
              {`Видалити студента ${student.student_surname} ${student.student_name}?`}
            </DialogContentText>
          </DialogContent>
          <Divider className={classes.Divider} />
          <DialogActions className={classes.Actions}>
            <Button
              variant={"contained"}
              className={classes.Button}
              onClick={() => cancel()}
              type="reset"
            >
              Скасувати
            </Button>
            <Button
              className={classes.Button}
              onClick={() => confirm()}
              type="submit"
            >
              Підтвердити
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </Paper>
  );
};

export default StudentsConfirm;

StudentsConfirm.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  student: PropTypes.object,
  remove: PropTypes.func,
  setSnackBar: PropTypes.func,
};
