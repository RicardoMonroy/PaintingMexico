import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';

function ViewSale({ viewId }) {
    const [saleData, setSaleData] = useState(null);

    useEffect(() => {
        if (viewId) {
            const fetchSaleData = async () => {
                try {
                    const response = await axios.get(`/api/sales/${viewId}`);
                    setSaleData(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching sale data:', error);
                }
            };

            fetchSaleData();
        }
    }, [viewId]);

    if (!saleData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-card rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Imagen de portada */}
                <div className="mb-4 col-span-2 flex justify-center">
                    <img
                        src={`${config.API_URL}${saleData.cover}`}
                        alt="Cover"
                        className="w-3/5 object-cover"
                    />
                </div>

                {/* Galería de imágenes */}
                <div className="mb-4 col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        Gallery Images
                    </label>
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {saleData.sale_galleries.map((gallery, index) => (
                            <img key={index} src={`${config.API_URL}${gallery.url}`} alt={`Gallery ${index}`} className="w-32 h-32 object-cover" />
                        ))}
                    </div>
                </div>

                {/* Campos de traducción */}
                {saleData.sale_translates.map((translation, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-primary font-bold mb-2">
                            {translation.locale === 'en' ? 'English' : 'Spanish'} Title
                        </label>
                        <p>{translation.title}</p>
                        <label className="block text-primary font-bold mb-2">
                            {translation.locale === 'en' ? 'English' : 'Spanish'} Description
                        </label>
                        <p dangerouslySetInnerHTML={{ __html: translation.description }} />
                    </div>
                ))}

                {/* URLs */}
                <div className="mb-4 col-span-2">
                    <label className="block text-primary font-bold mb-2">
                        URLs
                    </label>
                    {saleData.sale_u_r_ls.map((urlObj, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
                        <div>
                            <label className="block text-primary font-bold">
                                URL
                            </label>
                            <a href={urlObj.url} className="text-blue-600 hover:underline">
                                {urlObj.url}
                            </a>
                        </div>
                        <div>
                            <label className="block text-primary font-bold">
                                Store
                            </label>
                            <p className="text-gray-700">{urlObj.store}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default ViewSale;
