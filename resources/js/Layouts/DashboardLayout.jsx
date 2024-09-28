// resources/js/Layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';


const DashboardLayout = ({ children }) => {
    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    const changeLanguage = (lang) => {
        document.cookie = `lang=${lang};path=/;max-age=31536000`;
        setLanguage(lang);
        window.location.reload();
        console.log(translations);
    };    

    return (
        <div className="flex h-screen">
            {/* Barra lateral */}
            <div className="w-64 bg-primary text-tertiary p-5 h-screen flex flex-col justify-between flex-shrink-0">
                <div>
                    <InertiaLink href="/dashboard" className="block py-2">
                        <h1 className="text-xl mb-4">{translations.dashboard}</h1>
                    </InertiaLink>
                    <ul>
                        {/* ... elementos del menú ... */}
                        <li>
                            <InertiaLink href="/usuarios" className="block py-2 text-button hover:bg-tertiary text-tertiary">
                                {translations.usuarios}
                            </InertiaLink>
                        </li>
                        <li>
                            <InertiaLink href="/artworks" className="block py-2 text-button hover:bg-tertiary text-tertiary">
                                {translations.artwork}
                            </InertiaLink>
                        </li>
                        <li>
                            <InertiaLink href="/sections" className="block py-2 text-button hover:bg-tertiary text-tertiary">
                                {translations.sections}
                            </InertiaLink>
                        </li>
                        <li>
                            <InertiaLink href="/sales" className="block py-2 text-button hover:bg-tertiary text-tertiary">
                                {translations.ventas}
                            </InertiaLink>
                        </li>
                        <li>
                            <InertiaLink href="/info" className="block py-2 text-button hover:bg-tertiary text-tertiary">
                                {translations.informacion}
                            </InertiaLink>
                        </li>
                        <li>
                            <InertiaLink href="/logout" className="block py-2 bg-secondary text-button hover:bg-tertiary text-tertiary" method="post" as="button">
                                {translations.cerrarSesion}
                            </InertiaLink>
                        </li>
                    </ul>
                </div>
                <div className="w-full text-center pb-5 text-primary">
                    <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={language} className="bg-white text-primary p-2 rounded">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>
            {/* Contenido principal */}
            <div className="flex-1 p-5 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
