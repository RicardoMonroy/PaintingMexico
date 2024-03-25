import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Avenir', ...defaultTheme.fontFamily.sans],
            },
            colors: { // Aquí se añade la sección de colores personalizados
                primary: '#161311',
                secondary: '#2C3E50', // Un azul oscuro/gris para complementar
                tertiary: '#95A5A6', // Un gris claro para contrastes suaves
                success: '#27AE60', // Verde para mensajes de éxito
                warning: '#F39C12', // Amarillo para advertencias
                error: '#C0392B', // Rojo para errores
                background: '#F2F2F2', // Un fondo claro general
                card: '#FFFFFF', // Fondo para tarjetas o secciones
                text: {
                    primary: '#161311', // Principalmente para texto sobre fondo claro
                    secondary: '#f5f4f1', // Para texto sobre fondos oscuros
                    tertiary: '#7F8C8D', // Para texto menos prominente o detalles
                },
                button: {
                    primary: '#161311',
                    text: '#FFFFFF',
                    hover: '#34495E', // Oscuro para hover de botones primarios
                },
            },
        },
    },

    plugins: [forms],
};
