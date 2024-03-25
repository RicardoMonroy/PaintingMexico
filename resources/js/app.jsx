import './bootstrap';
import '../css/app.css';

import React from 'react'; // Asegúrate de importar React
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LanguageProvider } from './contexts/LanguageContext'; // Asegúrate de que la ruta sea correcta

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Envuelve el componente App con LanguageProvider
        root.render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
