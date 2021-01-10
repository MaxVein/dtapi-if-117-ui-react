import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';

import './Dashboard.css';
function DashboardCard({ card }) {
    return (
        <Card className="card">
            <Link to={card.path} className="card-link"></Link>
            {card.hasCount ? <span className="card-count">{card.count}</span> : null}
            <CardMedia
                component="img"
                alt={card.title}
                image={card.image}
                title={card.title}
                className="card-image"
            />
            <h2 className="card-title">{card.title}</h2>
            <div className="card_hover">
                <h3>Перейти</h3>
            </div>
        </Card>
    );
}

export default DashboardCard;
