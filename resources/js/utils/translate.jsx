// src/utils/translate.js
import es from '../translations/es.json';
import en from '../translations/en.json';

const translations = { es, en };

export const translate = (key, language = 'es') => {
    return translations[language][key] || key;
};
