import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import "./Admins.css";
import AdminCreationForm from "./AdminsCreationForm";
import AdminsDeleteForm from "./AdminsDeleteForm";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "0.5rem .5rem",
    cursor: "pointer",
    minWidth: "1rem",
    marginRight: "0.5rem",
  },
}));

export default function AdminsTableRow({ admin }) {
  const [edit, setEditOpen] = React.useState(false);
  const [del, setDelOpen] = React.useState(false);
  const classes = useStyles();

  const openModal = (mode) => {
    mode === "Update" ? setEditOpen(true) : setDelOpen(true);
  };

  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1} key={admin.id}>
        <TableCell>{admin.id}</TableCell>
        <TableCell>{admin.username}</TableCell>
        <TableCell>{admin.email}</TableCell>
        <TableCell align="center">
          <Button
            disableElevation
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={() => openModal("Update")}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => openModal("Delete")}
            disableElevation
            variant="contained"
            className={classes.button}
            color="primary"
          >
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
      <AdminCreationForm
        admin={admin}
        open={edit}
        setOpen={setEditOpen}
        mode={"Update"}
      />
      <AdminsDeleteForm
        id={admin.id}
        open={del}
        setOpen={setDelOpen}
        mode={"Delete"}
      />
    </React.Fragment>
  );
}
