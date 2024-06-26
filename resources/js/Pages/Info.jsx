import React, { useEffect, useState } from 'react';
import config from '@/config';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';

function Info() {
    const [info, setInfo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${config.API_URL}/info`)
            .then(response => {
                console.log(response.data);
                setInfo(response.data);
                setEmail(response.data.email); // Establece el email inicial
                setIsLoading(false); // Información cargada
            })
            .catch(error => {
                console.error("Error al cargar la información:", error);
                setIsLoading(false); // Información cargada
            });
    }, []);

    const handleUpdate = () => {
        if (!info) {
            console.error("Información no cargada completamente.");
            return;
        }
    
        console.log("Info ID:", info.idinfo); // Verifica que el ID esté presente
        setIsUpdating(true);
    
        const formData = new FormData();
        if (selectedFile) {
            formData.append('banner', selectedFile);
            console.log("Archivo seleccionado para el banner:", selectedFile.name); // Verifica el archivo seleccionado
        }
    
        formData.append('email', email);
        formData.append('_method', 'PUT'); // Agrega un campo oculto para simular la solicitud PUT
    
        // Solo para debug: Muestra lo que se enviará en formData
        for (let [key, value] of formData.entries()) { 
            console.log(key, value);
        }
    
        axios.post(`${config.API_URL}/info/${info.idinfo}`, formData) // Cambio a POST
        .then(response => {
            setInfo(response.data);
            console.log('Se supone que envió el response: ', response.data);
            setIsUpdating(false); // Finaliza el proceso de actualización
        })
        .catch(error => {
            console.error("Error al actualizar la información:", error);
            setIsUpdating(false); // Finaliza el proceso de actualización
        });
    };
    

    // Manejar el cambio de email y archivo separadamente
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    if (isLoading) return <p>Cargando información...</p>;

    return (
        <DashboardLayout>
            {info ? (
                <div className="flex-1 p-5 overflow-y-auto">
                    <h2 className="text-2xl text-primary">Información de la Empresa</h2>
                    <div className="mt-4">
                        {/* Mostrar el banner si existe */}
                        {info.banner && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={info.banner}
                                    alt="Banner de la empresa"
                                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/2" // Ajusta el tamaño según sea necesario
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="banner" className="block text-gray-700 text-sm font-bold mb-2">
                                Banner URL
                            </label>
                            <input
                                type="file"
                                id="banner"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email de Contacto
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleUpdate}
                            >
                                {isUpdating ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 5.523 4.477 10 10 10v-4.709z"></path>
                                    </svg>
                                    Actualizando...
                                </div>
                            ) : "Actualizar"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando información...</p>
            )}
        </DashboardLayout>
    );
}

export default Info;
