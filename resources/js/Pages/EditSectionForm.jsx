import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';

function EditSectionForm({ sectionId, closeModal }) {
    const [translations, setTranslations] = useState({
        en: '',
        es: ''
    });

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/sections/${sectionId}`);
                const enTranslation = response.data.translations.find(t => t.locale === 'en');
                const esTranslation = response.data.translations.find(t => t.locale === 'es');
                setTranslations({
                    en: enTranslation ? enTranslation.name : '',
                    es: esTranslation ? esTranslation.name : ''
                });
            } catch (error) {
                console.error('Error al cargar la sección:', error);
            }
        };
        fetchSection();
    }, [sectionId]);

    const handleTranslationChange = (locale, value) => {
        setTranslations(prev => ({ ...prev, [locale]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${config.API_URL}/sections/${sectionId}`, {
                translations: [
                    { locale: 'en', name: translations.en },
                    { locale: 'es', name: translations.es }
                ]
            });
            closeModal();
        } catch (error) {
            console.error('Error al actualizar la sección:', error);
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
                    Guardar
                </button>
            </div>
        </form>
    );
}

export default EditSectionForm;
