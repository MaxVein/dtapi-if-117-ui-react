import React from "react";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import EditOutlined from "@material-ui/icons/EditOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";
import Tooltip from "@material-ui/core/Tooltip";
import { Link, useRouteMatch } from "react-router-dom";

import ConfirmDelete from "../confirm";

export default function TableList({
  test,
  setDeleteEntity,
  handleEditTest,
  subjectName,
}) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {test.test_id}
      </TableCell>
      <TableCell align="left">{test.test_name}</TableCell>
      <TableCell align="left">{subjectName}</TableCell>
      <TableCell align="left">{test.tasks}</TableCell>
      <TableCell align="left">{test.time_for_test}</TableCell>
      <TableCell id={test.test_id} align="left">
        <div className="action-btn-container">
          {/* <Link
              className="test-link"
              to={{
                pathname: `${url}/${test.test_id}/tests`,
                state: { id: test.test_id, name: test.test_name },
              }}>
              <Tooltip title="Тести предмета">
                <SpeakerNotesIcon />
              </Tooltip>
            </Link>
            <Link
              className="test-link"
              to={{
                pathname: `${url}/${test.test_id}/timetable`,
                state: { id: test.test_id, name: test.test_name },
              }}>
              <Tooltip title="Розклад тестування">
                <ScheduleIcon />
              </Tooltip>
            </Link> */}
          <Tooltip title="Редагувати">
            <EditOutlined onClick={() => handleEditTest(test)} />
          </Tooltip>
          <ConfirmDelete
            id={test.test_id}
            setDeleteEntity={setDeleteEntity}
            message="Ви впевнені що бажаєте видалити тест?"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
