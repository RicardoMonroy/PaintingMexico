import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

const EditUserProfile = ({ userId, closeEditMode, profile }) => {
    const [formData, setFormData] = useState({
        avatar: null,
        description_en: '',
        description_es: ''
    });

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/profiles/${userId}`);
                const data = response.data;
    
                // Extraer descripciones en inglés y español
                const description_en = data.translates.find(t => t.locale === 'en')?.description || '';
                const description_es = data.translates.find(t => t.locale === 'es')?.description || '';
    
                // Actualizar el estado formData
                setFormData({
                    avatar: data.avatar || '',
                    description_en,
                    description_es
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        if (userId) {
            fetchUserData();
        }
    }, [userId]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.description_en || !formData.description_es) {
            console.error("Todos los campos son necesarios.");
            return;
        }
        console.log("Existen descripciones en ES y en EN.");

        const uploadData = new FormData();
        uploadData.append('userId', userId);
        if (formData.avatar instanceof File) {
            uploadData.append('avatar', formData.avatar);
        }
        uploadData.append('description_en', formData.description_en);
        uploadData.append('description_es', formData.description_es);
        uploadData.append('_method', 'PUT');

        console.log('Información que sube: ', Array.from(uploadData.entries()));

        try {
            await axios.post(`${config.API_URL}/profiles/${userId}`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Información actualizada con éxito");
            closeEditMode();
        } catch (error) {
            console.error("Error al actualizar la información:", error.response?.data || error.message);
        } 
        
    };
    

    const handleAvatarChange = (e) => {
        if (e.target.files.length) {
            setFormData({ ...formData, avatar: e.target.files[0] });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-4">
                <input
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                    accept="image/*"
                />
            </div>
            <div className="flex">
                <div className="w-1/2 p-4">
                    <label className="text-primary block mb-2">{translations.descripcionEspanol}</label>
                    <ReactQuill 
                        theme="snow"
                        value={formData.description_es}
                        onChange={content => setFormData({ ...formData, description_es: content })}
                        placeholder={translations.descripcionEspanol}
                    />
                </div>
                <div className="w-1/2 p-4">
                    <label className="text-primary block mb-2">{translations.descripcionIngles}</label>
                    <ReactQuill 
                        theme="snow"
                        value={formData.description_en}
                        onChange={content => setFormData({ ...formData, description_en: content })}
                        placeholder={translations.descripcionIngles}
                    />
                </div>
            </div>
            <div className="mt-4">
                <button type="submit" className="bg-primary text-button-text hover:bg-hover px-4 py-2 mr-2">Guardar</button>
                <button type="button" onClick={closeEditMode} className="bg-secondary text-button-text px-4 py-2">Cerrar</button>
            </div>
        </form>
    );
};

export default EditUserProfile;
