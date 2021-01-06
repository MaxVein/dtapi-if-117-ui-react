import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

const SnackBar = ({ show, message, hide }) => {
  const classes = useStyles();
  const actionBtn = () => {
    return (
      <React.Fragment>
        <IconButton
          aria-label="close"
          color="inherit"
          className={classes.close}
          onClick={() => hide({ open: false })}
        >
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    );
  };

  return (
    <Snackbar
      open={show}
      message={message}
      autoHideDuration={3000}
      onClose={() => hide({ open: false })}
      action={actionBtn()}
    />
  );
};

export default SnackBar;
