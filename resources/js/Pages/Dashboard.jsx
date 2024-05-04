import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

export default function Dashboard() {
    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    return (
        <div className="flex h-screen">
            {/* Barra lateral */}
            <DashboardLayout />

            {/* Contenido principal */}
            <div className="flex-1 p-5">
                <h2 className="text-2xl">{translations.welcome}</h2>
                {/* Aquí se renderizarán los componentes seleccionados desde la barra lateral */}
            </div>
        </div>
    );
}