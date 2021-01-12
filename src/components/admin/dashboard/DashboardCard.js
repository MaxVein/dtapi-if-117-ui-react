import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import './Dashboard.css';

const useStyles = makeStyles((theme) => ({
    cardCount: {
        backgroundColor: theme.palette.primary.main,
    },
    cardHover: {
        backgroundColor: theme.palette.primary.main,
    },
}));
function DashboardCard({ card }) {
    const classes = useStyles();

    return (
        <Card className="card">
            <Link to={card.path} className="card-link"></Link>
            {card.hasCount ? (
                <span className={clsx(classes.cardCount, 'card-count')}>{card.count}</span>
            ) : null}
            <CardMedia
                component="img"
                alt={card.title}
                image={card.image}
                title={card.title}
                className="card-image"
            />
            <h2 className="card-title">{card.title}</h2>
            <Typography className={clsx(classes.cardHover, 'card_hover')} component="h3">
                Перейти
            </Typography>
        </Card>
    );
}

export default DashboardCard;
