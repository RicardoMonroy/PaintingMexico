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
            <div className="sticky top-0 w-64 bg-primary text-secondary p-5">
                <InertiaLink href="/dashboard" className="block py-2">
                    <h1 className="text-xl mb-4">{translations.dashboard}</h1>
                </InertiaLink>
                <ul>
                    {/* <li>
                        <InertiaLink href="/configuracion" className="block py-2 text-button hover:bg-tertiary">
                            {translations.configuracion}
                        </InertiaLink>
                    </li> */}
                    <li>
                        <InertiaLink href="/usuarios" className="block py-2 text-button hover:bg-tertiary">
                            {translations.usuarios}
                        </InertiaLink>
                    </li>
                    <li>
                        <InertiaLink href="/posts" className="block py-2 text-button hover:bg-tertiary">
                            {translations.posts}
                        </InertiaLink>
                    </li>
                    <li>
                        <InertiaLink href="/artworks" className="block py-2 text-button hover:bg-tertiary">
                            {translations.artwork}
                        </InertiaLink>
                    </li>
                    <li>
                        <InertiaLink href="/sales" className="block py-2 text-button hover:bg-tertiary">
                            {translations.ventas}
                        </InertiaLink>
                    </li>
                    <li>
                        <InertiaLink href="/info" className="block py-2 text-button hover:bg-tertiary">
                            {translations.informacion}
                        </InertiaLink>
                    </li>
                    <li>
                        <InertiaLink href="/logout" className="block py-2 text-button hover:bg-tertiary" method="post" as="button">
                            {translations.cerrarSesion}
                        </InertiaLink>
                    </li>
                </ul>
                <div className="absolute bottom-0 w-full text-center pb-5">
                    <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={language}>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>


            
            
            {/* Contenido principal */}
            <div className="flex-1 p-5">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
