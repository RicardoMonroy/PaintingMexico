import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NewSaleForm from './NewSaleForm';
import EditSaleForm from './EditSaleForm';
import ViewSale from './ViewSale';
import config from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

function Sales() {
    const [sales, setSales] = useState([]);
    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
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

    const fetchSales = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/sales?lang=${language}`);
            setSales(response.data);
        } catch (error) {
            console.error("Error al cargar las ventas:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [language]); // Dependencias del useEffect


    const handleTranslationChange = (language, field, value) => {
        setSalesData(prevData => ({
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

    const reloadSales = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/sales?lang=${language}`);
            setSales(response.data);
            closeModal(); // Cierra el modal después de recargar los datos
        } catch (error) {
            console.error("Error al cargar las obras:", error);
        }
    };

    // Funciones para manejar los modales y acciones...
    const handleOpenNewSaleModal = () => {
        setIsNewSaleModalOpen(true);
    };

    const handleOpenViewModal = (sale) => {
        setSelectedSale(sale);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (sale) => {
        setSelectedSale(sale);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (sale) => {
        setSelectedSale(sale);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSale = async () => {
        if (!selectedSale) {
            console.error("No se ha seleccionado ninguna venta para eliminar");
            return;
        }
    
        try {
            const response = await axios.delete(`/api/sales/${selectedSale.idsales}`);
            console.log('Venta eliminada con éxito', response.data);
            closeModal();
            fetchSales(); // Recargar la lista de ventas después de la eliminación
        } catch (error) {
            console.error("Error al eliminar la venta:", error);
        }
    };

    const closeModal = () => {
        setIsNewSaleModalOpen(false);
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        fetchSales();
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        fetchSales(); // Suponiendo que fetchSales es la función que carga las ventas
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{translations.sales}</h2>
                <button
                    onClick={handleOpenNewSaleModal}
                    className="bg-primary hover:bg-secondary text-secondary font-bold py-2 px-4 rounded"
                >
                    {translations.nuevo}
                </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
                <h2 className="text-2xl text-primary">{/* Inserta tu texto de traducción aquí */}</h2>
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
                                    {translations.acciones}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((sale) => {
                            const cover = sale.sale_galleries.length > 0 ? sale.sale_galleries[0].url : 'default_cover_url';
                            const translation = sale.sale_translates.find(t => t.locale === language);

                            return (
                                <tr key={sale.idsales}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={`${config.API_URL}${sale.cover}`} alt="Cover" className="h-10 w-10 object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {translation ? translation.title : 'No title available'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                        <button onClick={() => handleOpenViewModal(sale)} className="bg-secondary hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            {/* Ícono de Ver */}
                                            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            {translations.ver}
                                        </button>
                                        <button onClick={() => handleOpenEditModal(sale)} className="bg-success hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            {/* Ícono de Editar */}
                                            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.207V17.5H2.793l14.439-14.439z"></path>
                                            </svg>
                                            {translations.editar}
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(sale)} className="bg-error hover:bg-tertiary text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            {/* Ícono de Eliminar */}
                                            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                            {translations.eliminar}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                {/* Modales */}
                {isNewSaleModalOpen && (
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
                                <NewSaleForm closeModal={closeModal} />
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
                                <ViewSale viewId={selectedSale?.idsales}/>
                                <button onClick={() => setIsViewModalOpen(false)}>{translations.btnCerrar}</button>
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
                                <EditSaleForm saleId={selectedSale?.idsales} closeModal={handleCloseModal} />

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
                                        onClick={handleDeleteSale}
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

export default Sales;
