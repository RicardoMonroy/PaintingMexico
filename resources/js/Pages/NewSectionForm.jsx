import React, { useState } from 'react';
import axios from 'axios';
import config from '@/config';

function NewSectionForm({ closeModal, onSectionCreated }) {
    const [translations, setTranslations] = useState({
        en: '',
        es: ''
    });

    const handleTranslationChange = (locale, value) => {
        setTranslations(prev => ({ ...prev, [locale]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL}/sections`, {
                translations: [
                    { locale: 'en', name: translations.en },
                    { locale: 'es', name: translations.es }
                ]
            });
            onSectionCreated();
            closeModal();
        } catch (error) {
            console.error('Error al crear la sección:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-primary font-bold mb-2">Nombre en Inglés</label>
                <input
                    type="text"
                    value={translations.en}
                    onChange={(e) => handleTranslationChange('en', e.target.value)}
                    className="w-full p-2 border rounded shadow-sm"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-primary font-bold mb-2">Nombre en Español</label>
                <input
                    type="text"
                    value={translations.es}
                    onChange={(e) => handleTranslationChange('es', e.target.value)}
                    className="w-full p-2 border rounded shadow-sm"
                    required
                />
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="bg-secondary text-white font-bold py-2 px-4 rounded mr-2">
                    Cancelar
                </button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded">
                    Crear
                </button>
            </div>
        </form>
    );
}

export default NewSectionForm;
