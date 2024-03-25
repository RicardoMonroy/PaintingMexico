// UserProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profiles/${userId}`);
                setProfile(response.data);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                console.log('El id del perfil que se iba a cargar es: ', userId);
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    if (!profile) return <div>Cargando perfil...</div>;

    return (
        <div className="profile-container">
            <img src={profile.avatar} alt="Avatar" />
            <p>{profile.translates.find(t => t.locale === 'es')?.description}</p>
            {/* Agrega más detalles del perfil según necesites */}
        </div>
    );
};

export default UserProfile;

