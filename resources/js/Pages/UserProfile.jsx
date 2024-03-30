import React, { useEffect, useState } from 'react';
import config from '@/config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

const UserProfile = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        avatar: '',
        description_en: '',
        description_es: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profiles/${userId}`);
                if (response.status === 404) {
                    setIsEditing(true); // Perfil no encontrado, activa la edición para crear uno nuevo
                } else {
                    setProfile(response.data);
                    setFormData({
                        avatar: response.data.avatar || '',
                        description_en: response.data.translates.find(t => t.locale === 'en')?.description || '',
                        description_es: response.data.translates.find(t => t.locale === 'es')?.description || ''
                    });
                }
            } catch (error) {
                if (error.response.status === 404) {
                    // Manejo de perfil no encontrado
                    setIsEditing(true);
                } else {
                    console.error("Error al cargar el perfil:", error);
                }
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.description_en || !formData.description_es) {
            console.error('Error: Both descriptions are required.');
            return;
        }

        console.log('userId:', userId);
        console.log('Descripción EN:', formData.description_en);
        console.log('Descripción ES:', formData.description_es);
    
        const uploadData = new FormData();
        uploadData.append('userId', userId);

        if (e.target.avatar.files[0]) {
            uploadData.append('avatar', e.target.avatar.files[0]);
        }
        uploadData.append('description_en', formData.description_en);
        uploadData.append('description_es', formData.description_es);   
        

        // Para depuración: Verifica los valores de FormData
        for (let [key, value] of uploadData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            let response;
            if (profile && profile.id) {
                response = await axios.put(`/api/profiles/${profile.id}`, uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post('/api/profiles', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setProfile(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar el perfil:", error.response.data);
        }
    };
    
    const handleDescriptionChange = (content, name) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: content
        }), () => {
            console.log(`New ${name}:`, formData[name]);
        });
    };
    
    
    const handleAvatarChange = (e) => {
        if (e.target.files.length) {
            setFormData({ ...formData, avatar: e.target.files[0] });
        }
    };

    if (!profile && !isEditing) {
        return <button onClick={() => setIsEditing(true)}>{}</button>;
    }

    return (
        <div className="profile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {isEditing ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '20px' }}>
                    <div className="flex">
                        <div className="w-1/4 p-4">
                            <img 
                                src={profile && profile.avatar ? `${config.API_URL}/storage/${profile.avatar}` : '/storage/avatars/AvatarDefault.png'}
                                alt="Avatar" 
                                className="w-full h-auto rounded-lg"
                            />
                            <input
                                type="file"
                                name="avatar"
                                onChange={handleAvatarChange}
                                accept="image/*"
                            />

                        </div>
                        <div className="w-3/4 p-4 flex flex-col justify-between">
                            <div>
                                <label className="text-primary block mb-2">{translations.descripcionEspanol}</label>
                                <ReactQuill 
                                    theme="snow"
                                    value={formData.description_es}
                                    onChange={content => handleDescriptionChange(content, 'description_es')}
                                    placeholder={translations.descripcionEspanol}
                                />
                                <label className="text-primary block mb-2">{translations.descripcionIngles}</label>
                                <ReactQuill 
                                    theme="snow"
                                    value={formData.description_en}
                                    onChange={content => handleDescriptionChange(content, 'description_en')}
                                    placeholder={translations.descripcionIngles}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-primary text-button-text hover:bg-hover px-4 py-2 mr-2">Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-secondary text-button-text px-4 py-2">Cerrar</button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center items-start w-full">
                        <div className="w-1/4 p-4">
                        <img 
                            src={profile && profile.avatar ? `${config.API_URL}/storage/${profile.avatar}` : '/storage/avatars/AvatarDefault.png'}
                            alt="Avatar" 
                            className="w-full h-auto rounded-lg"
                        />
                            
                        </div>
                        <div className="w-3/4 p-4 flex flex-col justify-between">
                            <div>
                                <label className="text-secondary">{translations.descripcionEspanol}:</label>
                                <div className="text-primary bg-background p-3 rounded-lg" 
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(profile.translates.find(t => t.locale === 'es')?.description) }}>
                                </div>
                                <br />
                                <label className="text-secondary">{translations.descripcionIngles}:</label>
                                <div className="text-primary bg-background p-3 rounded-lg" 
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(profile.translates.find(t => t.locale === 'en')?.description) }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button onClick={() => setIsEditing(true)} className="bg-primary text-button-text hover:bg-hover px-4 py-2">Editar</button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default UserProfile;
