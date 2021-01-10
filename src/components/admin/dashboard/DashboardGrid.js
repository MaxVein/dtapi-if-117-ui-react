import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import DashboardCard from './DashboardCard';
import './Dashboard.css';
import { getNumberOfRecords } from './DashboardService';
import { createCardsArray } from './DashboardService';

function DashboardGrid() {
    const [loaded, setLoad] = useState(false);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getNumberOfRecords().then((res) => {
            setCards(createCardsArray(res));
            if (!res) {
                return null;
            } else {
                setLoad(true);
            }
        });
    }, []);

    return loaded ? (
        <div className="cards-grid">
            {cards.map((item, index) => (
                <DashboardCard card={item} key={index} />
            ))}
        </div>
    ) : (
        <div className="loader">
            <CircularProgress />
        </div>
    );
}

export default DashboardGrid;
