import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NewSectionForm from './NewSectionForm';
import EditSectionForm from './EditSectionForm';
import ViewSection from './ViewSection';
import config from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

function Sections() {
    const [sections, setSections] = useState([]);
    const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
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

    const fetchSections = useCallback(async () => {
        try {
            const response = await axios.get(`${config.API_URL}/sections?lang=${language}`);
            console.log(response.data); // Verifica la estructura de los datos aquí
            setSections(response.data);
        } catch (error) {
            console.error("Error al cargar las secciones:", error);
        }
    }, [language]); 

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    const handleDeleteSection = async () => {
        if (selectedSection && selectedSection.id) {
            try {
                const response = await axios.delete(`/api/sections/${selectedSection.id}`);
                console.log('Sección eliminada:', response.data);
                // Actualiza el estado para reflejar la eliminación en la UI
                setSections(currentSections => currentSections.filter(section => section.id !== selectedSection.id));
                setIsDeleteModalOpen(false);
                setSelectedSection(null); // Restablece la sección seleccionada
            } catch (error) {
                console.error('Error al eliminar la sección:', error);
            }
        }
    };

    const reloadSections = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/sections?lang=${language}`);
            setSections(response.data);
            closeModal(); // Cierra el modal después de recargar los datos
        } catch (error) {
            console.error("Error al cargar las secciones:", error);
        }
    };

    const handleOpenNewSectionModal = () => {
        setIsNewSectionModalOpen(true);
    };

    const handleOpenViewModal = (section) => {
        setSelectedSection(section);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (section) => {
        setSelectedSection(section);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (section) => {
        setSelectedSection(section);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsNewSectionModalOpen(false);
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    return (
        <DashboardLayout>
            {/* Button to add a new section */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{translations.sections}</h2>
                <button
                    onClick={handleOpenNewSectionModal}
                    className="bg-primary hover:bg-secondary text-secondary font-bold py-2 px-4 rounded"
                >
                    {translations.nuevo}
                </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
                <h2 className="text-2xl text-primary">{translations.sections}</h2>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.nombre}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    {translations.acciones}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sections.map((section) => (
                                <tr key={section.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {section.translations[0].name} {/* Accede directamente al nombre de la traducción */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                        {/* <button onClick={() => handleOpenViewModal(section)} className="bg-secondary hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            
                                            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            Ver
                                        </button> */}
                                        <button onClick={() => handleOpenEditModal(section)} className="bg-success hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            {/* Ícono de Editar */}
                                            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.207V17.5H2.793l14.439-14.439z"></path>
                                            </svg>
                                            Editar
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(section)} className="bg-error hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
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
                {isNewSectionModalOpen && (
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
                                <NewSectionForm closeModal={() => setIsNewSectionModalOpen(false)} onSectionCreated={fetchSections} />
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
                                <ViewSection sectionId={selectedSection?.id} />
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
                                <EditSectionForm sectionId={selectedSection?.id} closeModal={reloadSections} />

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
                                        onClick={handleDeleteSection}
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

export default Sections;
