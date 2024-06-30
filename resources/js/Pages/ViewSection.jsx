import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';

function ViewSection({ sectionId }) {
    const [section, setSection] = useState(null);

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/sections/${sectionId}`);
                setSection(response.data);
            } catch (error) {
                console.error('Error al cargar la sección:', error);
            }
        };
        fetchSection();
    }, [sectionId]);

    if (!section) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{section.translations.find(t => t.locale === 'en')?.name || 'Nombre no disponible'}</h2>
            <p>{section.translations.find(t => t.locale === 'es')?.name || 'Nombre no disponible'}</p>
        </div>
    );
}

export default ViewSection;
