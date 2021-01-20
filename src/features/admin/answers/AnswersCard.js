import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
    button: {
        padding: '0.5rem .5rem',
        cursor: 'pointer',
        minWidth: '1rem',
        marginRight: '0.5rem',
    },
}));

export default function AnswersCard({ answer }) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {answer.answer_text}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {answer.answer_id}
                    </Typography>
                </CardContent>
            </div>
        </Card>
    );
}
