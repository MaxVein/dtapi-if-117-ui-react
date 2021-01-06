import React from "react";
import classes from "./StudentsCreateUpdateModal.module.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const StudentsCreateUpdateModal = ({
  open,
  setOpen,
  isUpdate,
  groupID,
  student,
}) => {
  return (
    <div className={classes.StudentsCreateUpdateModal}>
      <Dialog open={open}>
        <DialogTitle>
          {isUpdate ? "Редагувати дані студента" : "Додати нового студента"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setOpen({ open: false, isUpdate })}
          >
            Cancel
          </Button>
          <Button color="primary">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentsCreateUpdateModal;
