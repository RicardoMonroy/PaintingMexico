import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de ReactQuill

function NewPostForm({ closeModal, onPostCreated }) {
    const [cover, setCover] = useState('');
    const [postData, setPostData] = useState({
        cover: '',
        translations: {
            en: { title: '', content: '' },
            es: { title: '', content: '' }
        },
    });

    const handleCoverChange = (e) => {
        setCover(e.target.files[0]);
    };
    
    const handleTranslationChange = (language, field, value) => {
        setPostData(prevData => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (cover) {
            formData.append('cover', cover);
        }
        formData.append('translations', JSON.stringify(postData.translations));

        try {
            const response = await axios.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Post created successfully:', response.data);
            closeModal();
            onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cover image upload */}
                <div className="col-span-1 md:col-span-2 mb-4">
                    <label className="block text-primary font-bold mb-2">
                        Cover Image
                    </label>
                    <input
                        type="file"
                        onChange={handleCoverChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>

                {/* English translation inputs */}
                <div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            English Title
                        </label>
                        <input
                            type="text"
                            value={postData.translations.en.title}
                            onChange={(e) => handleTranslationChange('en', 'title', e.target.value)}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            English Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={postData.translations.en.content}
                            onChange={(value) => handleTranslationChange('en', 'content', value)}
                        />
                    </div>
                </div>

                {/* Spanish translation inputs */}
                <div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            Spanish Title
                        </label>
                        <input
                            type="text"
                            value={postData.translations.es.title}
                            onChange={(e) => handleTranslationChange('es', 'title', e.target.value)}
                            className="w-full p-2 border rounded shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            Spanish Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={postData.translations.es.content}
                            onChange={(value) => handleTranslationChange('es', 'content', value)}
                        />
                    </div>
                </div>

                <div className="col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-primary text-button.text hover:bg-button.hover font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewPostForm;
