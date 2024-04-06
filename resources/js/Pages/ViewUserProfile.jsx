import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

const ViewUserProfile = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    const [profileTranslations, setProfileTranslations] = useState([]);

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        // Cargar los datos del perfil del usuario seleccionado
        axios.get(`${config.API_URL}/api/profiles/${userId}`)
            .then(response => {
                setProfile(response.data);
                setProfileTranslations(response.data.translates); // Asumiendo que el perfil incluye las traducciones
            })
            .catch(error => console.error("Error al obtener el perfil:", error));
    }, [userId]);

    if (!profile) {
        return <div>{translations.noPerfil}</div>;
    }

    return (
        <div>
            {/* Mostrar la imagen del avatar si está disponible */}
            {profile.avatar && (
                <div className="mb-4">
                    <img src={profile.avatar} alt="Avatar" className="w-32 h-32 object-cover rounded-full" />
                </div>
            )}

            {/* Mostrar las traducciones del perfil, si existen */}
            {profileTranslations.length > 0 && (
                profileTranslations.map((translation, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="font-bold text-lg">{translation.locale === 'en' ? 'English' : 'Spanish'} Profile</h2>
                        {/* Usando dangerouslySetInnerHTML para renderizar HTML */}
                        <div dangerouslySetInnerHTML={{ __html: translation.description }} />
                    </div>
                ))
            )}

            {/* Otros detalles del perfil pueden ir aquí */}
        </div>
    );
};

export default ViewUserProfile;
