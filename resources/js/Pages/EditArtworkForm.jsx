import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BeatLoader } from 'react-spinners';

function EditArtworkForm({ artworkId, closeModal }) {
    const [artworkData, setArtworkData] = useState({
        front: '',
        background_color: '',
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' },
        },
        images: [],
        existingImages: [], // Imágenes cargadas inicialmente del servidor
        newImages: [], // Nuevas imágenes añadidas por el usuario
        videos: [],
        section: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    

    useEffect(() => {
        const fetchArtworkData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/artworks/${artworkId}`);
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
                    existingImages: artwork.images || [], // Asegúrate de que siempre asignes un arreglo
                    section: artwork.section || ''
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

    const handleAddImage = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const fileArray = Array.from(event.target.files);
            const updatedNewImages = artworkData.newImages ? [...artworkData.newImages, ...fileArray] : [...fileArray];
            setArtworkData({ ...artworkData, newImages: updatedNewImages });
        } else {
            console.error("No files selected or files are not accessible");
        }
    };    

    const handleRemoveImage = (index) => {
        console.log('Index to remove:', index);
        // console.log('Current images:', artworkData.existingImages);    
        const updatedExistingImages = artworkData.existingImages.filter((_, idx) => idx !== index);    
        // console.log('Updated images:', updatedExistingImages);
        setArtworkData({ ...artworkData, existingImages: updatedExistingImages });
    };    

    const handleImageDescriptionChange = (index, value) => {
        const updatedExistingImages = [...artworkData.existingImages];
        updatedExistingImages[index].description = value;
        setArtworkData({ ...artworkData, existingImages: updatedExistingImages });
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

    const handleSectionChange = (e) => {
        setArtworkData({ ...artworkData, section: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!artworkId) {
            console.error("No hay información del ID");
            return;
        }
        console.log("el ID a actualizar es:", artworkId);
        
        const formData = new FormData();
        formData.append('background_color', artworkData.background_color);
        formData.append('section', artworkData.section);
        
        // Si estás actualizando una imagen o un archivo, asegúrate de añadirlo solo si el usuario seleccionó un nuevo archivo
        if (artworkData.front instanceof File) {
            formData.append('front', artworkData.front);
            console.log("Las imágenes son:", artworkData.front);
        }

        // Agregar imágenes existentes que se mantienen
        if (artworkData.existingImages && artworkData.existingImages.length > 0) {
            artworkData.existingImages.forEach((image, index) => {
                if (image.id) { // Verifica que la imagen tiene un id
                    formData.append(`existingImages[${index}][id]`, image.id.toString()); // Asegúrate de usar image.id
                    formData.append(`existingImages[${index}][description]`, image.description || '');
                    console.log('Se añaden al FormData los IDs de las imágenes:', image.id);
                } else {
                    console.error('La imagen no tiene un id:', image);
                }
            });
        }
        

        // Agregar nuevas imágenes
        if (artworkData.newImages && artworkData.newImages.length > 0) {
            artworkData.newImages.forEach((image, index) => {
                formData.append(`newImages[${index}]`, image);
            });
            console.log('New Images:', artworkData.newImages);
        }        
        
        // Para los videos
        artworkData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
            console.log("Los videos son:", video);
        });
        
        Object.keys(artworkData.translations).forEach(locale => {
            formData.append(`translations[${locale}][title]`, artworkData.translations[locale].title);
            formData.append(`translations[${locale}][description]`, artworkData.translations[locale].description);
        });

        formData.append('_method', 'PUT');

    
        try {
            await axios.post(`${config.API_URL}/artworks/${artworkId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            closeModal();
            setLoading(false);
        } catch (error) {
            setError('Error al actualizar el artwork. Por favor, intenta de nuevo.');
            setLoading(false);
            console.error('Error updating artwork:', error);
        } 
        
    };
    

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            {loading && <BeatLoader color="#36D7B7" />}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Front Image
                    </label>
                    <div className="mb-4">
                        <img src={artworkData.front} alt="Front" className="-full h-auto object-cover rounded-lg shadow-md" />
                    </div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />

                    <label className="block text-primary font-bold mb-2">Images</label>
                    <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {artworkData.existingImages.map((img, index) => (
                                <div key={img.id || `image-${index}`} className="inline-block relative">
                                    <img src={img.url} alt={`Image ${index}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
                                    <textarea
                                        value={img.description || ''}
                                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                                        placeholder="Enter image description"
                                        className="w-full mt-2 p-2 border rounded shadow-sm"
                                    />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <br />
                        <input
                            type="file"
                            multiple
                            onChange={handleAddImage}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                    </div>
                    {/* <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {artworkData.existingImages.map((img, index) => (
                                <div key={img.id || `image-${index}`} className="inline-block relative">
                                    <img src={img.url} alt={`Image ${index}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <br />
                        <input
                            type="file"
                            multiple
                            onChange={handleAddImage}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                    </div> */}
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
                <label className="block text-primary font-bold mb-2">Section</label>
                    <select
                        value={artworkData.section}
                        onChange={handleSectionChange}
                        className="w-full p-2 border rounded shadow-sm"
                    >
                        <option value="">None</option>
                        <option value="INAH">INAH</option>
                        <option value="Camino Real">Camino Real</option>
                    </select>

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
                        className="bg-primary text-tertiary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded float-right"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </div>
    );
}

export default EditArtworkForm;
