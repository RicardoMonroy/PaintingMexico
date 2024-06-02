import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de ReactQuill

function EditSaleForm({ saleId, closeModal  }) {
    const [cover, setCover] = useState(null);
    const [saleData, setSaleData] = useState({
        cover: null,
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' }
        },
        urls: [],
        galleries: []
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCover(file);
            console.log(file); // Deberías ver los detalles del archivo aquí
        }
    };

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
    
                const galleries = data.sale_galleries.map(gallery => ({ url: gallery.url, file: null }));
    
                setSaleData({
                    cover: data.cover,
                    translations,
                    urls,
                    galleries
                });
            } catch (error) {
                console.error('Error fetching sale data', error);
            }
        };
    
        fetchSaleData();
    }, [saleId]);
    
    const handleGalleryChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setSaleData(prevData => ({
            ...prevData,
            galleries: prevData.galleries.concat(newFiles.map(file => ({ url: URL.createObjectURL(file), file })))
        }));
    };

    const handleTranslationChange = (language, field, value) => {
        setSaleData(prevData => ({
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

        if (!saleId) {
            console.error("No hay información del ID");
            return;
        }
        console.log("el ID a actualizar es:", saleId);
        
        const formData = new FormData();
        formData.append('cover', cover);
        formData.append('translations', JSON.stringify(saleData.translations));

        // Suponiendo que `galleries` contiene solo archivos nuevos para subir
        // Asegúrate de que accedes a las galleries desde saleData
        saleData.galleries.forEach((gallery, index) => {
            if (gallery.file instanceof File) {
                formData.append(`galleries[${index}]`, gallery.file);
            }
        });

        if (saleData.galleries.length > 0) {
            formData.append('updateGalleries', 'true');
        }

        // Añadir las URLs al formData
        saleData.urls.forEach((url, index) => {
            formData.append(`urls[${index}][url]`, url.url);
            formData.append(`urls[${index}][store]`, url.store);
        });

        saleData.urls.forEach((url, index) => {
            formData.append(`urls[${index}][url]`, url.url);
            formData.append(`urls[${index}][store]`, url.store);
        });
        
        formData.append('_method', 'PUT');
    
        axios.post(`/api/sales/${saleId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
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
                {/* Carga de la imagen de portada */}
                <div className="mb-4 col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Cover Image
                    </label>
                    {/* <img src={saleData.cover} alt="Cover" className="w-full mb-2" /> */}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>

                {/* Carga de múltiples imágenes para la galería */}
                <div className="mb-4 col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Gallery Images
                    </label>
                    {/* <div className="flex flex-wrap gap-4 mb-4">
                        {saleData.galleries.map((gallery, index) => (
                            <img key={index} src={gallery.url} alt={`Gallery ${index}`} className="w-32 h-32 object-cover" />
                        ))}
                    </div> */}
                    <input
                        type="file"
                        multiple
                        onChange={handleGalleryChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>

                {/* Campos de traducción */}
                {Object.keys(saleData.translations).map((locale, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English' : 'Spanish'} Title
                        </label>
                        <input
                            type="text"
                            value={saleData.translations[locale].title}
                            onChange={(e) => handleTranslationChange(locale, 'title', e.target.value)}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English' : 'Spanish'} Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={saleData.translations[locale].description}
                            onChange={(content) => handleTranslationChange(locale, 'description', content)}
                            className="w-full"
                        />
                    </div>
                ))}

                {/* Campos dinámicos para URLs */}
                <div className="mb-4 col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        URLs
                    </label>
                    {saleData.urls.map((urlObj, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <label className="block text-primary font-bold mb-2">
                                URL
                            </label>
                            <input
                                type="text"
                                value={urlObj.url}
                                onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                                className="w-full p-2 border rounded shadow-sm"
                                placeholder="URL"
                            />
                            <label className="block text-primary font-bold mb-2">
                                Store
                            </label>
                            <input
                                type="text"
                                value={urlObj.store}
                                onChange={(e) => handleUrlChange(index, 'store', e.target.value)}
                                className="w-full p-2 border rounded shadow-sm"
                                placeholder="Store"
                            />
                            {/* Button to remove the URL field */}
                            <button type="button" onClick={() => removeUrlField(index)} className="ml-2 text-red-500">
                                Remove
                            </button>
                        </div>
                    ))}
                    {/* Button to add a new URL field */}
                    <button type="button" onClick={addUrlField} className="mt-2 text-primary">
                        Add URL
                    </button>
                </div>

                {/* Botón de envío */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-primary text-tertiary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded float-right"
                    >
                        Update Sale
                    </button>
                </div>
            </form>
        </div>

    );
}

export default EditSaleForm;
