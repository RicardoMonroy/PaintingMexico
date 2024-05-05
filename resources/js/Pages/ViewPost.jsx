import React, { useState, useEffect } from 'react';
import config from '@/config';
import axios from 'axios';

function ViewPost({ postId, onEdit }) {
    const [postData, setPostData] = useState({
        cover: '',
        translations: {
            en: { title: '', content: '' },
            es: { title: '', content: '' },
        }
    });

    useEffect(() => {
        console.log("Post ID in ViewPost:", postId);

        const fetchPostData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/posts/${postId}`);
                const post = response.data;
                setPostData({
                    cover: post.cover,
                    translations: post.translations.reduce((acc, translation) => {
                        acc[translation.locale] = { title: translation.title, content: translation.content };
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

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 flex justify-center">
                    {postData.cover && (
                        <img src={postData.cover} alt="Cover" className="mb-4 h-40 w-auto object-cover" />
                    )}
                </div>

                {Object.entries(postData.translations).map(([locale, { title, content }]) => (
                    <div key={locale}>
                        <h2 className="text-primary font-bold mb-2">
                            {locale.toUpperCase()} Title
                        </h2>
                        <p className="font-bold">{title}</p>

                        <h2 className="text-primary font-bold mb-2">
                            {locale.toUpperCase()} Content
                        </h2>
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewPost;

