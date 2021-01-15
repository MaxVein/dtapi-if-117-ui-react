import React, { useState, useContext } from 'react';
import './languages';
import { useTranslation } from 'react-i18next';

const LanguagesContext = React.createContext();

export const UseLanguage = () => {
    return useContext(LanguagesContext);
};

const languages = [{ name: 'ua' }, { name: 'en' }];

function LangToggle(name) {
    switch (name) {
        case 'ua':
            return languages[0].name;
        case 'en':
            return languages[1].name;
        default:
            return languages[0].name;
    }
}

export function LanguagesProvider({ children }) {
    const savedLanguage = localStorage.getItem('langName');
    const [language, setLanguage] = React.useState(LangToggle(savedLanguage));
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };
    return (
        <LanguagesContext.Provider
            value={{ langlist: languages, changeLanguage, t: t, language: language, setLanguage }}
        >
            {children}
        </LanguagesContext.Provider>
    );
}
