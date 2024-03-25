import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

export default function Welcome(props) {
    return (
        <div>
            <h1>Bienvenido a Painting Mexico</h1>
            {props.info && (
                <div>
                    <img src={props.info.banner} alt="Banner" />
                    <p>{props.info.email}</p>
                </div>
            )}
            <InertiaLink href="/login">Iniciar sesión</InertiaLink>
        </div>
    );
}
