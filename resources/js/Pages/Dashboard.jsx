import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            {/* Contenido del Dashboard */}
            <InertiaLink href="/logout" method="post" as="button">Cerrar Sesión</InertiaLink>
        </div>
    );
}

