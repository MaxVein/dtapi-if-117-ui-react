import React from "react";
import classes from "./Alert.module.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";

const Alert = ({ show, message, type, hide }) => {
  return (
    <Dialog
      modal={true}
      open={show}
      className={classes.Dialog}
      maxWidth={"xs"}
      fullWidth={false}
    >
      <div className={classes.Alert}>
        <DialogTitle className={classes.DialogTitle}>{type}</DialogTitle>
        <DialogContent className={classes.DialogContent}>
          {type === "Помилка" ? (
            <ErrorIcon className={classes.Icon} />
          ) : (
            <WarningIcon />
          )}
          <DialogContentText className={classes.Message}>
            {message}
          </DialogContentText>
        </DialogContent>
        <Divider className={classes.Divider} />
        <DialogActions className={classes.Actions}>
          <Button
            variant={"contained"}
            className={classes.Button}
            onClick={() => hide({ open: false })}
          >
            Закрити
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default Alert;
