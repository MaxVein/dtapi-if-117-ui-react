import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import styles from './Dashboard.module.css';

const useStyles = makeStyles((theme) => ({
    cardCount: {
        backgroundColor: theme.palette.primary.main,
    },
    cardHoverBG: {
        backgroundColor: theme.palette.primary.main,
    },
}));
function DashboardCard({ card }) {
    const classes = useStyles();

    return (
        <Card className={styles.card}>
            <Link to={card.path} className={styles.cardLink}></Link>
            {card.hasCount ? (
                <span className={clsx(classes.cardCount, styles.cardCount)}>{card.count}</span>
            ) : null}
            <CardMedia
                component="img"
                alt={card.title}
                image={card.image}
                title={card.title}
                className={styles.cardImage}
            />
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <Typography className={clsx(classes.cardHoverBG, styles.cardHover)} component="h3">
                Перейти
            </Typography>
        </Card>
    );
}

export default DashboardCard;
