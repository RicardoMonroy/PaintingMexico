import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditArtworkForm({ artworkId, closeModal }) {
    const [artworkData, setArtworkData] = useState({
        front: '',
        background_color: '',
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' },
        },
        images: [],
        videos: [],
    });
    

    useEffect(() => {
        const fetchArtworkData = async () => {
            try {
                const response = await axios.get(`/api/artworks/${artworkId}`);
                const artwork = response.data;
                console.log(artwork);
                
                setArtworkData({
                    front: artwork.front,
                    background_color: artwork.background_color,
                    translations: artwork.translations.reduce((acc, translation) => {
                        acc[translation.locale] = { title: translation.title, description: translation.description };
                        return acc;
                    }, {}),
                    images: artwork.images.map(img => img.url), // Asegúrate de usar el campo correcto
                    videos: artwork.videos.map(video => video.url), // Asegúrate de usar el campo correcto
                });
            } catch (error) {
                console.error('Error fetching artwork data:', error);
            }
        };
    
        fetchArtworkData();
    }, [artworkId]);

    const handleFileChange = (e) => {
        setArtworkData({ ...artworkData, front: e.target.files[0] });
    };

    const handleTranslationChange = (language, field, value) => {
        setArtworkData({
            ...artworkData,
            translations: {
                ...artworkData.translations,
                [language]: {
                    ...artworkData.translations[language],
                    [field]: value,
                },
            },
        });
    };

    const handleVideoChange = (index, value) => {
        let videos = [...artworkData.videos];
        videos[index] = value;
        setArtworkData({ ...artworkData, videos });
    };

    const addVideoField = () => {
        setArtworkData(prevData => ({
            ...prevData,
            videos: [...prevData.videos, ''],
        }));
    };

    const removeVideoField = (index) => {
        setArtworkData(prevData => ({
            ...prevData,
            videos: prevData.videos.filter((_, idx) => idx !== index),
        }));
    };

    const handleColorChange = (e) => {
        setArtworkData({ ...artworkData, background_color: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!artworkId) {
            console.error("No hay información del ID");
            return;
        }
        console.log("el ID a actualizar es:", artworkId);
        
        const formData = new FormData();
        formData.append('background_color', artworkData.background_color);
        
        // Si estás actualizando una imagen o un archivo, asegúrate de añadirlo solo si el usuario seleccionó un nuevo archivo
        if (artworkData.front instanceof File) {
            formData.append('front', artworkData.front);
        }
        
        artworkData.images.forEach((image, index) => {
            if (image instanceof File) {
                formData.append(`images[${index}]`, image);
            }
        });
        
        artworkData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
        });
        
        Object.keys(artworkData.translations).forEach(locale => {
            formData.append(`translations[${locale}][title]`, artworkData.translations[locale].title);
            formData.append(`translations[${locale}][description]`, artworkData.translations[locale].description);
        });

        formData.append('_method', 'PUT');

    
        axios.post(`/api/artworks/${artworkId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('Se supone que envió el response: ', response.data);
            console.log("Información actualizada con éxito");
            closeModal();
        })
        .catch(error => {
            console.error("Error al actualizar la información:", error);
        });  
        
    };
    

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Front Image
                    </label>
                    <div className="mb-4">
                        <img src={artworkData.front} alt="Front" className="h-10 w-10 object-cover" />
                    </div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />

                    <label className="block text-primary font-bold mb-2">Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, 'images')}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-primary font-bold mb-2">
                        English Title
                    </label>
                    <input
                        type="text"
                        value={artworkData.translations.en.title}
                        onChange={e => handleTranslationChange('en', 'title', e.target.value)}
                        className="w-full p-2 border rounded shadow-sm"
                    />

                    <label className="block text-primary font-bold mb-2">
                        English Description
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={artworkData.translations.en.description}
                        onChange={value => handleTranslationChange('en', 'description', value)}
                    />
                </div>

                <div>
                    <label className="block text-primary font-bold mb-2">
                        Spanish Title
                    </label>
                    <input
                        type="text"
                        value={artworkData.translations.es.title}
                        onChange={e => handleTranslationChange('es', 'title', e.target.value)}
                        className="w-full p-2 border rounded shadow-sm"
                    />

                    <label className="block text-primary font-bold mb-2">
                        Spanish Description
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={artworkData.translations.es.description}
                        onChange={value => handleTranslationChange('es', 'description', value)}
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">Videos</label>
                    {artworkData.videos.map((video, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={video}
                                onChange={(e) => handleVideoChange(index, e.target.value)}
                                className="w-full p-2 border rounded shadow-sm"
                                placeholder="Video URL"
                            />
                            <button type="button" onClick={() => removeVideoField(index)} className="ml-2 text-red-500">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addVideoField} className="mt-2 text-primary">Add Video URL</button>

                    <label className="block text-primary font-bold mb-2">Background Color: (<span>{artworkData.background_color}</span>)</label>
                    <input
                        type="color"
                        value={artworkData.background_color}
                        onChange={handleColorChange}
                        className="w-full h-12 p-2 border rounded shadow-sm"
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-primary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded float-right"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditArtworkForm;
