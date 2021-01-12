import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import DashboardCard from './DashboardCard';
import styles from './Dashboard.module.css';
import { getNumberOfRecords, createCardsArray } from './DashboardService';

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
        <div className={styles.cardsGrid}>
            {cards.map((item, index) => (
                <DashboardCard card={item} key={index} />
            ))}
        </div>
    ) : (
        <div className={styles.loader}>
            <CircularProgress />
        </div>
    );
}

export default DashboardGrid;
