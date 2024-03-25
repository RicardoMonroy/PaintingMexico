import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        axios.get('/sanctum/csrf-cookie').then(() => {
            axios.post('/login', { email, password })
                .then(response => {
                    // Redirige al usuario al dashboard o maneja la respuesta exitosa aquí
                    console.log("Inicio de sesión exitoso", response);
                    window.location.href = '/dashboard';
                })
                .catch(error => {
                    setError("Error en el inicio de sesión, verifica tus credenciales.");
                    console.error("Error en el inicio de sesión:", error);
                });
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl font-bold mb-5 text-center">Painting México</h2>
                    <h3 className="text-2xl font-bold mb-5 text-center">Log in</h3>
                    {error && <div className="bg-red-100 text-red-700 p-2 text-center rounded">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
