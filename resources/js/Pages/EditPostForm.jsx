import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditPostForm({ postId, closeModal }) {
    const [postData, setPostData] = useState({
        cover: '',
        translations: {
            en: { title: '', content: '' },
            es: { title: '', content: '' },
        }
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/posts/${postId}`);
                const post = response.data;
                console.log(response.data);

                setPostData({
                    cover: post.cover,
                    translations: post.translations.reduce((acc, translation) => {
                        acc[translation.locale] = {
                            title: translation.title,
                            content: translation.content
                        };
                        return acc;
                    }, {})
                });
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const handleFileChange = (e) => {
        setPostData({ ...postData, cover: e.target.files[0] });
    };

    const handleTranslationChange = (locale, field, value) => {
        setPostData({
            ...postData,
            translations: {
                ...postData.translations,
                [locale]: {
                    ...postData.translations[locale],
                    [field]: value
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postId) {
            console.error("No hay información del ID");
            return;
        }

        const formData = new FormData();
        if (postData.cover instanceof File) {
            formData.append('cover', postData.cover);
        }

        Object.keys(postData.translations).forEach(locale => {
            formData.append(`translations[${locale}][title]`, postData.translations[locale].title);
            formData.append(`translations[${locale}][content]`, postData.translations[locale].content);
        });

        formData.append('_method', 'PUT');

        try {
            const response = await axios.post(`/api/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Se supone que envió el response: ', response.data);
            console.log("Información actualizada con éxito");
            closeModal();
        } catch (error) {
            console.error("Error al actualizar la información del post:", error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Cover Image
                    </label>
                    {postData.cover && (
                        <div className="mb-4">
                            <img src={postData.cover} alt="Cover" className="h-10 w-10 object-cover" />
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded shadow-sm"
                    />
                </div>

                {['en', 'es'].map((locale) => (
                    <div key={locale}>
                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English' : 'Spanish'} Title
                        </label>
                        <input
                            type="text"
                            value={postData.translations[locale]?.title || ''}
                            onChange={(e) => handleTranslationChange(locale, 'title', e.target.value)}
                            className="w-full p-2 border rounded shadow-sm"
                        />

                        <label className="block text-primary font-bold mb-2">
                            {locale === 'en' ? 'English' : 'Spanish'} Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={postData.translations[locale]?.content || ''}
                            onChange={(value) => handleTranslationChange(locale, 'content', value)}
                        />
                    </div>
                ))}


                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-primary text-white hover:bg-primary-dark font-bold py-2 px-4 rounded float-right"
                    >
                        Update Post
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPostForm;
