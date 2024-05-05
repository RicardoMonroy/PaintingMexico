import React, { useState } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de ReactQuill

function NewSaleForm({ closeModal }) {
  const [cover, setCover] = useState(null);
  const [saleData, setSaleData] = useState({
      cover: '',
      translations: {
          en: { title: '', description: '' },
          es: { title: '', description: '' }
      },
      urls: [],
      galleries: []
  });

  const handleFileChange = (e) => {
    setCover(e.target.files[0]);
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

  const handleGalleryChange = (e) => {
      setSaleData({ ...saleData, galleries: [...e.target.files] });
  };

  const handleUrlChange = (index, field, value) => {
    const updatedUrls = saleData.urls.map((item, idx) => {
        if (idx === index) {
            return { ...item, [field]: value };
        }
        return item;
    });
    setSaleData({ ...saleData, urls: updatedUrls });
  };

  const addUrlField = () => {
    setSaleData({
        ...saleData,
        urls: [...saleData.urls, { url: '', store: '' }]
    });
  };

  const removeUrlField = (index) => {
      setSaleData(prevData => ({
          ...prevData,
          urls: prevData.urls.filter((_, idx) => idx !== index)
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('cover', cover);    
    
    saleData.galleries.forEach((image, index) => {
      formData.append(`galleries[${index}]`, image);
    });

    saleData.urls.forEach((urlObj, index) => {
        formData.append(`urls[${index}][url]`, urlObj.url);
        formData.append(`urls[${index}][store]`, urlObj.store);
    });
    
    formData.append('translations', JSON.stringify(saleData.translations));

    console.log('Sales data:', saleData);

    try {
        await axios.post(`${config.API_URL}/sales`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Sale creada exitosamente');
        closeModal();
    } catch (error) {
        console.error('Error al crear la sale:', error);
    }
  };
    

  return (
    <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carga de la imagen de portada */}
        <div className="mb-4 col-span-2">
          <label className="block text-primary font-bold mb-2">
            Cover Image
          </label>
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
          <input
            type="file"
            multiple
            onChange={handleGalleryChange}
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>

        {/* Campos de traducción */}
        <div className="mb-4">
          <label className="block text-primary font-bold mb-2">
            English Title
          </label>
          <input
            type="text"
            value={saleData.translations.en.title}
            onChange={e => handleTranslationChange('en', 'title', e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
          />
          <label className="block text-primary font-bold mb-2">
            English Description
          </label>
          <ReactQuill
            theme="snow"
            value={saleData.translations.en.description}
            onChange={value => handleTranslationChange('en', 'description', value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-primary font-bold mb-2">
            Spanish Title
          </label>
          <input
            type="text"
            value={saleData.translations.es.title}
            onChange={e => handleTranslationChange('es', 'title', e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
          />
          <label className="block text-primary font-bold mb-2">
            Spanish Description
          </label>
          <ReactQuill
            theme="snow"
            value={saleData.translations.es.description}
            onChange={value => handleTranslationChange('es', 'description', value)}
          />
        </div>

        {/* Campos dinámicos para URLs */}
        <div className="mb-4 col-span-2">
          <label className="block text-primary font-bold mb-2">
            URLs
          </label>
          {saleData.urls.map((urlObj, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                  type="text"
                  required
                  value={urlObj.url}
                  onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                  className="w-full p-2 border rounded shadow-sm"
                  placeholder="URL"
              />
              <input
                  type="text"
                  required
                  value={urlObj.store}
                  onChange={(e) => handleUrlChange(index, 'store', e.target.value)}
                  className="w-full p-2 border rounded shadow-sm"
                  placeholder="Store"
              />
              <button type="button" onClick={() => removeUrlField(index)} className="ml-2 text-red-500">
                  Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addUrlField} className="mt-2 text-primary">
            Add URL
          </button>
        </div>

        {/* Botón de envío */}
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

export default NewSaleForm;
