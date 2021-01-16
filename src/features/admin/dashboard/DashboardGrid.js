import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import DashboardCard from './DashboardCard';
import styles from './Dashboard.module.css';
import { getNumberOfRecords, createCardsArray } from './DashboardService';
import { UseLanguage } from '../../../lang/LanguagesContext';

function DashboardGrid() {
    const { t, language } = UseLanguage();
    const [loaded, setLoad] = useState(false);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getNumberOfRecords().then((res) => {
            setCards((prevVal) => (prevVal = createCardsArray(res, t)));
            if (!res) {
                return null;
            } else {
                setLoad(true);
            }
        });
    }, [language]);

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
