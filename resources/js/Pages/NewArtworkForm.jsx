import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BeatLoader } from 'react-spinners';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

function NewArtworkForm({ closeModal, fetchArtworks }) {
    const [front, setFront] = useState('');
    const [color, setColor] = useState('#F2F2F2');
    const [section, setSection] = useState('');
    const [sections, setSections] = useState([]);
    const [artworkData, setArtworkData] = useState({
        front: '',
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' }
        },
        images: [],
        videos: ['']
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/sections?lang=${language}`);
                console.log('Sections data:', response.data); // Verifica la estructura de los datos aquí
                setSections(response.data);
            } catch (error) {
                console.error('Error al cargar las secciones:', error);
            }
        };
        fetchSections();
    }, [language]);

    const handleFileChange = (e) => {
        setFront(e.target.files[0]);
    };

    const handleTranslationChange = (language, field, value) => {
        setArtworkData(prevData => ({
            ...prevData,
            translations: {
                ...prevData.translations,
                [language]: {
                    ...prevData.translations[language],
                    [field]: value
                }
            }
        }));
    };

    const handleImageChange = (e) => {
        setArtworkData({ ...artworkData, images: [...e.target.files] });
    };

    const handleVideoChange = (index, value) => {
        let videos = [...artworkData.videos];
        videos[index] = value;
        setArtworkData({ ...artworkData, videos });
    };

    const addVideoField = () => {
        setArtworkData(prevData => ({
            ...prevData,
            videos: [...prevData.videos, ''] // Añade un nuevo campo vacío para la URL del video
        }));
    };

    const removeVideoField = (index) => {
        setArtworkData(prevData => ({
            ...prevData,
            videos: prevData.videos.filter((_, idx) => idx !== index) // Remueve el campo del índice especificado
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Activar el indicador de carga
        setError(''); // Reiniciar mensajes de error

        const formData = new FormData();
        formData.append('front', front);
        formData.append('background_color', color);
        formData.append('section', section);
        artworkData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        artworkData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
        });
        formData.append('translations', JSON.stringify(artworkData.translations));

        try {
            await axios.post(`${config.API_URL}/artworks`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Artwork creado exitosamente');
            closeModal();
            fetchArtworks();
        } catch (error) {
            console.error('Error al crear artwork:', error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    {/* Carga de la imagen principal */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb=2">Front Image</label>
                        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded shadow-sm" required />
                    </div>
                    {/* Carga de múltiples imágenes */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">Images</label>
                        <input type="file" multiple onChange={handleImageChange} className="w-full p-2 border rounded shadow-sm" />
                    </div>
                </div>

                <div>
                    {/* English Title and Description */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">English Title</label>
                        <input type="text" value={artworkData.translations.en.title} onChange={e => handleTranslationChange('en', 'title', e.target.value)} className="w-full p-2 border rounded shadow-sm" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">English Description</label>
                        <ReactQuill theme="snow" value={artworkData.translations.en.description} onChange={value => handleTranslationChange('en', 'description', value)} />
                    </div>
                </div>

                <div>
                    {/* Spanish Title and Description */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">Spanish Title</label>
                        <input type="text" value={artworkData.translations.es.title} onChange={e => handleTranslationChange('es', 'title', e.target.value)} className="w-full p-2 border rounded shadow-sm" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">Spanish Description</label>
                        <ReactQuill theme="snow" value={artworkData.translations.es.description} onChange={value => handleTranslationChange('es', 'description', value)} />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    {/* Sección */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">{translations.sections}</label>
                        <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full p-2 border rounded shadow-sm" required>
                            <option value="" disabled>Select...</option>
                            {sections && sections.length > 0 && sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                    {sec.translations.find(t => t.locale === language)?.name || sec.translations[0]?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Videos and Background Color */}
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">Videos</label>
                        {artworkData.videos.map((video, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input type="text" value={video} onChange={(e) => handleVideoChange(index, e.target.value)} className="w-full p-2 border rounded shadow-sm" placeholder="Video URL" />
                                <button type="button" onClick={() => removeVideoField(index)} className="ml-2 text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addVideoField} className="mt-2 text-primary">Add Video URL</button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">Background Color</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-2 border rounded shadow-sm h-12" />
                    </div>
                </div>

                <div className="col-span-2">
                    {/* Botón de envío y Spinner */}
                    <button type="submit" className="bg-primary text-tertiary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded float-right" disabled={loading}>
                        {translations.submit}
                    </button>
                    {loading && <BeatLoader color="#36D7B7" />} 
                </div>
            </form>
        </div>
    );
}

export default NewArtworkForm;
