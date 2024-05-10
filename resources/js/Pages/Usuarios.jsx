import React, { useEffect, useState } from 'react';
import config from '@/config';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ViewUserProfile from './ViewUserProfile';
import EditUserProfile from './EditUserProfile';

import { useLanguage } from '@/contexts/LanguageContext';
import en from '../translations/en.json';
import es from '../translations/es.json';

const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Valor por defecto
    });
    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    useEffect(() => {
        console.log(`${config.API_URL}/usuarios`);
        axios.get(`${config.API_URL}/usuarios`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => setUsers(response.data))
            .catch(error => console.error("Error al obtener los usuarios:", error));
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleViewClick = (userId) => {
        setSelectedUserId(userId);
        setIsProfileModalOpen(true);
        setIsEditMode(false);
    };
    const handleEditClick = (userId) => {
        setSelectedUserId(userId);
        setIsProfileModalOpen(true);
        setIsEditMode(true);
    };
    const handleCloseEdit = () => {
        setIsProfileModalOpen(false);
        setIsEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log('Validación fallida');
            return; // Detiene la función si hay errores de validación
        }

        try {
            const response = await axios.post(`${config.API_URL}/api/usuarios`, formData);
            setIsModalOpen(false); // Cierra el modal después de la operación exitosa
            setUsers([...users, response.data]); // Añade el nuevo usuario a la lista
            // Restablece el estado del formulario o maneja la respuesta exitosa como prefieras
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Aquí puedes manejar los errores de validación
                // Por ejemplo, mostrando los mensajes de error en el formulario
                console.error('Errores de validación:', error.response.data.errors);
            } else {
                console.error('Error al crear el usuario:', error.message);
            }
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "El nombre es requerido.";
        tempErrors.email = formData.email ? (/\S+@\S+\.\S+/.test(formData.email) ? "" : "El email no es válido.") : "El email es requerido.";
        tempErrors.password = formData.password ? (formData.password.length >= 6 ? "" : "La contraseña debe tener al menos 6 caracteres.") : "La contraseña es requerida.";
        tempErrors.role = formData.role ? "" : "El rol es requerido.";
    
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };


    return (
        <DashboardLayout>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{translations.bienvenidaUsuarios}</h2>
                <button
                    onClick={handleOpenModal}
                    className="bg-primary hover:bg-secondary text-secondary font-bold py-2 px-4 rounded"
                >
                    {translations.nuevo}
                </button>
            </div>
            <div>
                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <thead className="bg-secondary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{translations.nombre}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{translations.email}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{translations.acciones}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-primary hover:text-secondary mr-3" onClick={() => handleViewClick(user.id)}>{translations.ver}</button>
                                        <button className="text-primary hover:text-secondary mr-3" onClick={() => handleEditClick(user.id)}>{translations.editar}</button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-primary">{translations.faltanUsuarios}</p>
                )}
            </div>

            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-primary">{translations.perfilUsuario}</h3>
                            <button onClick={handleCloseEdit} className="text-primary">
                                [Cerrar]
                            </button>
                        </div>
                        {isEditMode ? <EditUserProfile userId={selectedUserId} closeEditMode={handleCloseEdit} /> : <ViewUserProfile userId={selectedUserId} />}
                    </div>
                </div>
            )}
            
            {/* Modal para añadir nuevo usuario */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-primary">{translations.nuevo}</h3>
                            <form onSubmit={handleSubmit} className="mt-2">
                                {/* Campo Nombre */}
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={translations.nuevo}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`my-2 w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                                {/* Campo Email */}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={translations.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`my-2 w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                                {/* Campo Contraseña */}
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={translations.password}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`my-2 w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                                {/* Selector de Rol */}
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`my-2 w-full p-2 border rounded ${errors.role ? 'border-red-500' : ''}`}
                                >
                                    <option value="">{translations.elegirRol}</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="guest">Guest</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}

                                {/* Botones de Envío y Cancelar */}
                                <div className="flex items-center justify-end space-x-4 px-4 py-3">
                                    {/* Botón de Cancelar */}
                                    <button
                                        type="button" // Importante para evitar que se envíe el formulario
                                        onClick={handleCloseModal} // Asumiendo que tienes esta función para manejar el cierre del modal
                                        className="px-4 py-2 bg-white text-primary border border-primary rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                    >
                                        {translations.btnCancelar}
                                    </button>

                                    {/* Botón de Añadir */}
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-secondary text-base font-medium rounded-md shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-green-300"
                                    >
                                        {translations.btnAceptar}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>

    );
}

export default Usuarios;
