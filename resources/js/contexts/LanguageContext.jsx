import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Intenta leer el idioma de la cookie al inicializar el estado
        return document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/, "$1") || 'es';
    });

    useEffect(() => {
        // Actualiza la cookie cuando el idioma cambia
        document.cookie = `lang=${language};path=/;max-age=31536000`;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};


