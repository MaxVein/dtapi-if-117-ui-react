import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, Button, Tooltip } from '@material-ui/core';
import QuestionEditDialog from '../EditDialog/QuestionsEditDialog';
import QuestionDeleteConfirm from '../DeleteConfirm/QuestionsDeleteConfirm';
import { Delete, Edit, QuestionAnswer } from '@material-ui/icons';
import { UseLanguage } from '../../../../lang/LanguagesContext';

const useStyles = makeStyles(() => ({
    button: {
        padding: '0.5rem .5rem',
        cursor: 'pointer',
        minWidth: '1rem',
        marginRight: '0.5rem',
    },
}));

export default function QuestionsTableRow({ question }) {
    const { t } = UseLanguage();

    const [edit, setEditOpen] = React.useState(false);
    const [del, setDelOpen] = React.useState(false);

    const classes = useStyles();
    const openModal = (mode) => {
        mode === 'Update' ? setEditOpen(true) : setDelOpen(true);
    };

    const TypeChangeName = (type) => {
        let newType;
        switch (+type) {
            case 1:
                newType = 'Простий вибір';
                break;
            case 2:
                newType = 'Мульти вибір';
                break;
            case 3:
                newType = 'Текстове поле';
                break;
            case 4:
                newType = 'Числовий діапазон';
                break;
        }
        return newType;
    };
    return (
        <React.Fragment>
            <TableRow hover role="checkbox" tabIndex={-1} key={question.question_id}>
                <TableCell>{question.question_id}</TableCell>
                <TableCell>{question.question_text}</TableCell>
                <TableCell>{TypeChangeName(question.type)}</TableCell>
                <TableCell>{question.level}</TableCell>
                <TableCell align="center">
                    <Tooltip title={t('questions.messages.updateTooltip')} arrow>
                        <Button
                            disableElevation
                            variant="contained"
                            className={classes.button}
                            color="primary"
                            onClick={() => openModal('Update')}
                        >
                            <Edit />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t('questions.messages.deleteTooltip')} arrow>
                        <Button
                            onClick={() => openModal('Delete')}
                            disableElevation
                            variant="contained"
                            className={classes.button}
                            color="primary"
                        >
                            <Delete />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t('questions.messages.answersTooltip')} arrow>
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
                    </Tooltip>
                </TableCell>
            </TableRow>
            <QuestionEditDialog
                question={question}
                open={edit}
                setOpen={setEditOpen}
                mode={'Edit'}
            />
            <QuestionDeleteConfirm
                question={question}
                open={del}
                setOpen={setDelOpen}
                mode={'Delete'}
            />
        </React.Fragment>
    );
}
