import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import QuestionDeleteConfirm from '../DeleteConfirm/QuestionsDeleteConfirm';
import { Delete, Edit, QuestionAnswer } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    button: {
        padding: '0.5rem .5rem',
        cursor: 'pointer',
        minWidth: '1rem',
        marginRight: '0.5rem',
    },
}));

export default function QuestionsTableRow({ question }) {
    const [edit, setUpdateOpen] = React.useState(false);
    const [del, setDelOpen] = React.useState(false);
    let { url } = useRouteMatch();

    const classes = useStyles();
    const openModal = (mode) => {
        mode === 'Update' ? setUpdateOpen(true) : setDelOpen(true);
    };

    return (
        <React.Fragment>
            <TableRow hover role="checkbox" tabIndex={-1} key={question.question_id}>
                <TableCell>{question.question_id}</TableCell>
                <TableCell>{question.question_text}</TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>{question.level}</TableCell>
                <TableCell align="center">
                    <Button
                        disableElevation
                        variant="contained"
                        className={classes.button}
                        color="primary"
                        onClick={() => openModal('Update')}
                    >
                        <Edit />
                    </Button>
                    <Button
                        onClick={() => openModal('Delete')}
                        disableElevation
                        variant="contained"
                        className={classes.button}
                        color="primary"
                    >
                        <Delete />
                    </Button>
                    <Button
                        disableElevation
                        variant="contained"
                        className={classes.button}
                        color="primary"
                    >
                        <Link
                            style={{
                                color: 'white',
                                maxHeight: '100%',
                                fontSize: '0',
                            }}
                            to={{
                                pathname: '/admin/subjects/tests/answers',
                                state: {
                                    id: question.question_id,
                                    name: question.question_text,
                                    mode: 'Edit',
                                },
                            }}
                        >
                            <QuestionAnswer />
                        </Link>
                    </Button>
                </TableCell>
            </TableRow>
            <QuestionDeleteConfirm
                question={question}
                open={del}
                setOpen={setDelOpen}
                mode={'Delete'}
            />
        </React.Fragment>
    );
}
