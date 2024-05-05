import React, { useEffect, useState, useCallback  } from 'react';
import config from '@/config';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NewPostForm from './NewPostForm';
import EditPostForm from './EditPostForm';
import ViewPost from './ViewPost';
import config from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    const changeLanguage = (lang) => {
        document.cookie = `lang=${lang};path=/;max-age=31536000`;
        setLanguage(lang);
        window.location.reload();
        console.log(translations);
    };

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${config.API_URL}/posts?lang=${language}`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error al cargar los posts:", error);
        }
    }, [language]); 

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDeletePost = async () => {
        if (selectedPost && selectedPost.id) {
            try {
                const response = await axios.delete(`/api/posts/${selectedPost.id}`);
                console.log('Post eliminado:', response.data);
                // Actualiza el estado para reflejar la eliminación en la UI
                setPosts(currentPosts => currentPosts.filter(post => post.id !== selectedPost.id));
                setIsDeleteModalOpen(false);
                setSelectedPost(null); // Restablece el post seleccionado
            } catch (error) {
                console.error('Error al eliminar el post:', error);
            }
        }
    };

    const reloadPosts = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/posts?lang=${language}`);
            setPosts(response.data);
            closeModal(); // Cierra el modal después de recargar los datos
        } catch (error) {
            console.error("Error al cargar las posts:", error);
        }
    };


    const handleOpenNewPostModal = () => {
        setIsNewPostModalOpen(true);
    };

    const handleOpenViewModal = (post) => {
        setSelectedPost(post);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (post) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (post) => {
        setSelectedPost(post);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsNewPostModalOpen(false);
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    return (
        <DashboardLayout>
            {/* Button to add a new post */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{translations.posts}</h2>
                <button
                    onClick={handleOpenNewPostModal}
                    className="bg-primary hover:bg-secondary text-secondary font-bold py-2 px-4 rounded"
                >
                    {translations.nuevo}
                </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
                <h2 className="text-2xl text-primary">{translations.posts}</h2>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.snapshot}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.titulo}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.usuarios}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.acciones}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={post.cover} alt="Cover" className="h-10 w-10 object-cover" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {post.translations[0].title} {/* Accede directamente al título de la traducción */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {post.user.name} {/* Accede directamente al nombre del usuario */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                    <button onClick={() => handleOpenViewModal(post)} className="bg-secondary hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                        {/* Ícono de Ver */}
                                        <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                        Ver
                                    </button>
                                    <button onClick={() => handleOpenEditModal(post)} className="bg-success hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                        {/* Ícono de Editar */}
                                        <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.207V17.5H2.793l14.439-14.439z"></path>
                                        </svg>
                                        Editar
                                    </button>
                                    <button onClick={() => handleOpenDeleteModal(post)} className="bg-error hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                        {/* Ícono de Eliminar */}
                                        <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Eliminar
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Modales */}
                {isNewPostModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="relative bg-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg overflow-auto">
                                {/* Botón de cierre en la esquina superior derecha */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <NewPostForm closeModal={() => setIsNewPostModalOpen(false)} onPostCreated={fetchPosts} />
                            </div>
                        </div>
                    </div>
                )}
                {isViewModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="relative bg-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg overflow-auto">
                                {/* Botón de cierre en la esquina superior derecha */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <ViewPost postId={selectedPost?.id}/>
                                <button onClick={() => setIsViewModalOpen(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="relative bg-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg overflow-auto">
                                {/* Botón de cierre en la esquina superior derecha */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <EditPostForm postId={selectedPost?.id} closeModal={reloadPosts} />

                            </div>
                        </div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="relative bg-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg overflow-auto">
                                {/* Botón de cierre en la esquina superior derecha */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button><h2 className="text-xl font-bold text-center text-error mb-4">{translations.confirmDelete}</h2>
                                <p className="text-center mb-8">{translations.confirmDeleteText}</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleDeletePost}
                                        className="bg-error hover:bg-tertiary text-white font-bold py-2 px-4 rounded"
                                    >
                                        {translations.btnAceptar}
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="bg-secondary hover:bg-tertiary text-white font-bold py-2 px-4 rounded"
                                    >
                                        {translations.btnCancelar}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Posts;
