import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import NotFoundImageComponent from './NotFoundImageComponent';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        position: 'relative',
        width: '100%',
        height: '100%',
        userSelect: 'none',
    },
}));

export default function NotFoundPage() {
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <div className={classes.content}>
                <NotFoundImageComponent />
            </div>
        </Container>
    );
}
