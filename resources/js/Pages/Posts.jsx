import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

function Posts() {
    const [posts, setPosts] = useState([]);
    const { language } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Error al cargar los posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (

        <DashboardLayout>

            <div className="flex-1 p-5">
                <h2 className="text-2xl">{translations.posts}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.title}
                                </th>
                                {/* Agrega más columnas según los datos que quieras mostrar */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {post.title} {/* Asegúrate de que 'title' exista en tu modelo Post */}
                                    </td>
                                    {/* Agrega más celdas según los datos que quieras mostrar */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Posts;
