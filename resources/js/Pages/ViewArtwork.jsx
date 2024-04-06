import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewArtwork({ artworkId, onEdit }) {
    const [artworkData, setArtworkData] = useState({
        front: '',
        background_color: '',
        translations: {
            en: { title: '', description: '' },
            es: { title: '', description: '' },
        },
        images: [],
        videos: [],
    });

    useEffect(() => {
        console.log("Artwork ID in ViewArtwork:", artworkId);

        const fetchArtworkData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/artworks/${artworkId}`);
                const artwork = response.data;
                setArtworkData({
                    front: artwork.front,
                    background_color: artwork.background_color,
                    translations: artwork.translations.reduce((acc, translation) => {
                        acc[translation.locale] = { title: translation.title, description: translation.description };
                        return acc;
                    }, {}),
                    images: artwork.images.map(img => img.url),
                    videos: artwork.videos.map(video => video.url),
                });
            } catch (error) {
                console.error('Error fetching artwork data:', error);
            }
        };

        fetchArtworkData();
    }, [artworkId]);

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2 flex justify-center">
                    <img src={artworkData.front} alt="Front" className="mb-4 h-40 w-auto object-cover" />
                </div>

                {Object.entries(artworkData.translations).map(([lang, { title, description }]) => (
                    <div key={lang}>
                        {/* <h2 className="text-primary font-bold mb-2">{`${lang.toUpperCase()} Title`}</h2> */}
                        <p>{title}</p>

                        {/* <h2 className="text-primary font-bold mb-2">{`${lang.toUpperCase()} Description`}</h2> */}
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                ))}

                <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
                    {artworkData.images.map((image, index) => (
                        <div key={index} className="w-full">
                            <img src={image} alt={`Image ${index}`} className="h-32 w-full object-cover" />
                        </div>
                    ))}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-primary font-bold mb-2">Videos (URLs)</h2>
                    <ul>
                        {artworkData.videos.map((video, index) => (
                            <li key={index}><a href={video} target="_blank" rel="noopener noreferrer">{video}</a></li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-primary font-bold mb-2">Background Color ({artworkData.background_color})</h2>
                    <div style={{ backgroundColor: artworkData.background_color, height: '100px', width: '100%' }} />
                </div>
                
            </div>
        </div>
    );
}

export default ViewArtwork;
