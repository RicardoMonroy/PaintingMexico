import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de ReactQuill
import { BeatLoader } from 'react-spinners'; // Importa BeatLoader

function EditSaleForm({ saleId, closeModal }) {
    const [saleData, setSaleData] = useState({
        cover: null,
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' },
        },
        urls: [],
        existingGalleries: [],
        newGalleries: []
    });
    const [loading, setLoading] = useState(false); // Estado de carga
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSaleData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/sales/${saleId}`);
                const data = response.data;
    
                const translations = data.sale_translates.reduce((acc, translation) => {
                    acc[translation.locale] = { title: translation.title, description: translation.description };
                    return acc;
                }, {});
    
                const urls = data.sale_u_r_ls.map(url => ({ url: url.url, store: url.store }));
    
                const existingGalleries = data.sale_galleries.map(gallery => ({ id: gallery.id, url: gallery.url, description: gallery.description }));
    
                setSaleData({
                    cover: data.cover,
                    translations,
                    urls,
                    existingGalleries,
                    newGalleries: []
                });
            } catch (error) {
                console.error('Error fetching sale data', error);
            }
        };
    
        fetchSaleData();
    }, [saleId]);

    const handleFileChange = (e) => {
        setSaleData({ ...saleData, cover: e.target.files[0] });
    };

    const handleAddGallery = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const fileArray = Array.from(event.target.files);
            setSaleData({ ...saleData, newGalleries: [...saleData.newGalleries, ...fileArray] });
        } else {
            console.error("No files selected or files are not accessible");
        }
    };

    const handleRemoveGallery = (index) => {
        const updatedExistingGalleries = saleData.existingGalleries.filter((_, idx) => idx !== index);
        setSaleData({ ...saleData, existingGalleries: updatedExistingGalleries });
    };

    const handleGalleryDescriptionChange = (index, value) => {
        const updatedExistingGalleries = [...saleData.existingGalleries];
        updatedExistingGalleries[index].description = value;
        setSaleData({ ...saleData, existingGalleries: updatedExistingGalleries });
    };

    const handleTranslationChange = (language, field, value) => {
        setSaleData({
            ...saleData,
            translations: {
                ...saleData.translations,
                [language]: {
                    ...saleData.translations[language],
                    [field]: value,
                },
            },
        });
    };

    const handleUrlChange = (index, field, value) => {
        setSaleData((prevState) => {
            const newUrls = prevState.urls.map((url, idx) => {
                if (idx === index) {
                    return { ...url, [field]: value };
                }
                return url;
            });
            return { ...prevState, urls: newUrls };
        });
    };

    const addUrlField = () => {
        setSaleData((prevState) => ({
            ...prevState,
            urls: [...prevState.urls, { url: '', store: '' }]
        }));
    };

    const removeUrlField = (index) => {
        setSaleData((prevState) => ({
            ...prevState,
            urls: prevState.urls.filter((_, idx) => idx !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        if (!saleId) {
            console.error("No hay información del ID");
            setLoading(false);
            return;
        }
        console.log("el ID a actualizar es:", saleId);
    
        const formData = new FormData();
        formData.append('translations', JSON.stringify(saleData.translations));
    
        if (saleData.cover instanceof File) {
            formData.append('cover', saleData.cover);
            console.log("Cover:", saleData.cover);
        }
    
        // Agregar imágenes existentes que se mantienen
        if (saleData.existingGalleries && saleData.existingGalleries.length > 0) {
            saleData.existingGalleries.forEach((gallery, index) => {
                if (gallery.id) { // Verifica que la galería tiene un id
                    formData.append(`existingGalleries[${index}][id]`, gallery.id.toString()); // Asegúrate de usar gallery.id
                    console.log('Se añaden al FormData los IDs de las galerías:', gallery.id);
                } else {
                    console.error('La galería no tiene un id:', gallery);
                }
            });
        }
    
        // Agregar nuevas galerías
        if (saleData.newGalleries && saleData.newGalleries.length > 0) {
            saleData.newGalleries.forEach((image, index) => {
                formData.append(`newGalleries[${index}]`, image);
                console.log('New Galleries:', saleData.newGalleries);
            });
        }
    
        saleData.urls.forEach((url, index) => {
            formData.append(`urls[${index}][url]`, url.url);
            formData.append(`urls[${index}][store]`, url.store);
        });
    
        formData.append('_method', 'PUT');
    
        try {
            await axios.post(`${config.API_URL}/sales/${saleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Información actualizada con éxito");
            closeModal();
            setLoading(false);
        } catch (error) {
            console.error("Error al actualizar la información:", error);
            setError('Error al actualizar la información. Por favor, intenta de nuevo.');
            setLoading(false);
        }
    };
    
    

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            {loading && <BeatLoader color="#36D7B7" />}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Cover Image
                    </label>
                    <div className="mb-4">
                        <img src={saleData.cover} alt="Cover" className="w-full h-auto object-cover rounded-lg shadow-md" />
                    </div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />

                    <label className="block text-primary font-bold mb-2">Gallery Images</label>
                    <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {saleData.existingGalleries.map((gallery, index) => (
                                <div key={gallery.id || `image-${index}`} className="inline-block relative">
                                    <img src={gallery.url} alt={`Gallery ${index}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
                                    <button type="button" onClick={() => handleRemoveGallery(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <br />
                        <input
                            type="file"
                            multiple
                            onChange={handleAddGallery}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                    </div>
                </div>

                {Object.keys(saleData.translations).map((locale, index) => (
                    <div key={index}>
                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English Title' : 'Spanish Title'}
                        </label>
                        <input
                            type="text"
                            value={saleData.translations[locale].title}
                            onChange={(e) => handleTranslationChange(locale, 'title', e.target.value)}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English Description' : 'Spanish Description'}
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={saleData.translations[locale].description}
                            onChange={(value) => handleTranslationChange(locale, 'description', value)}
                        />
                    </div>
                ))}

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">URLs</label>
                    {saleData.urls.map((urlObj, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={urlObj.url}
                                onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                                className="w-full p-2 border rounded shadow-sm"
                                placeholder="URL"
                            />
                            <input
                                type="text"
                                value={urlObj.store}
                                onChange={(e) => handleUrlChange(index, 'store', e.target.value)}
                                className="w-full p-2 border rounded shadow-sm"
                                placeholder="Store"
                            />
                            <button type="button" onClick={() => removeUrlField(index)} className="ml-2 text-red-500">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addUrlField} className="mt-2 text-primary">Add URL</button>
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-primary text-tertiary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded float-right"
                        disabled={loading}
                    >
                        {loading ? <BeatLoader size={8} color="#fff" /> : "Update Sale"}
                    </button>
                </div>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </div>
    );
}

export default EditSaleForm;
