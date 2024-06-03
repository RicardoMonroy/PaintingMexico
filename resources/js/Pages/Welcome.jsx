import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Plx from 'react-plx';
import 'animate.css';
import AOS from 'aos';
import '../../css/effects.css';
import 'aos/dist/aos.css';
import { InertiaLink } from '@inertiajs/inertia-react';
import { useLanguage } from '@/contexts/LanguageContext';
import config from '@/config';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import en from '../translations/en.json';
import es from '../translations/es.json';
import enFlag from '../../assets/en.png';
import esFlag from '../../assets/es.png';
import loginIcon from '../../assets/login.png';

export default function Welcome(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isSaleModal, setIsSaleModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('INAH');
    const [filteredArtworks, setFilteredArtworks] = useState(props.artworks);

    const { language, setLanguage } = useLanguage();
    const translations = language === 'en' ? en : es;

    const plxData = [
        {
          start: 0,          // Cuando el elemento está en la parte superior de la ventana
          end: 800,          // Finaliza la animación 500px después
          properties: [
            {
              startValue: 0, // Comienza con una opacidad de 0 (completamente invisible)
              endValue: 1,   // Termina con una opacidad de 1 (completamente visible)
              property: "opacity"
            },
            {
              startValue: 100, // Empieza 100px abajo
              endValue: 0,     // Mueve el elemento a su posición original
              property: "translateY"
            }
          ]
        }
    ];
      
    useEffect(() => {
        AOS.init({
            duration: 1200, // Duración de la animación
            once: false, // Para que la animación se ejecute solo una vez por elemento
        });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Muestra 3 slides a la vez
        slidesToScroll: 1, // Desplaza 3 slides a la vez
        centerMode: true, // Añade esto para centrar slides y mostrar espacio a los lados
        centerPadding: '20px', // Añade esto para más espacio alrededor de los slides
        responsive: [
            {
                breakpoint: 1024, // En dispositivos de menos de 1024px
                settings: {
                    slidesToShow: 2, // Muestra 2 slides
                    slidesToScroll: 2, // Desplaza 2 slides
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600, // En dispositivos de menos de 600px
                settings: {
                    slidesToShow: 1, // Muestra 1 slide
                    slidesToScroll: 1 // Desplaza 1 slide
                }
            }
        ]
    };

    const openArtworkModal = (artwork) => {
        setSelectedArtwork(artwork);
    };

    const closeArtworkModal = () => {
        setSelectedArtwork(null);
    };

    const openPostModal = (post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    const closePostModal = () => {
        setSelectedPost(null);
        setIsPostModalOpen(false);
    };

    const openSaleProfileModal = (sale) => {
        setSelectedSale(sale);
        console.log(sale);
        setIsSaleModal(true);
    };

    const closeSaleModal = () => {
        setSelectedSale(null);
        setIsSaleModal(false);
    };

    const changeLanguage = (lang) => {
        document.cookie = `lang=${lang};path=/;max-age=31536000`;
        setLanguage(lang);
        window.location.reload();
        console.log(translations);
    };

    const openProfileModal = (user) => {
        setSelectedUser(user);
        console.log(user.profile);
        setIsProfileModalOpen(true);
    };
    
    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
        setSelectedUser(null);
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const filterArtworksBySection = (section) => {
        if (section === 'none') {
            setFilteredArtworks(props.artworks.filter(artwork => !artwork.section));
        } else {
            setFilteredArtworks(props.artworks.filter(artwork => artwork.section === section));
        }
    };

    return (
        <div id="home" >
            {/* Navbar */}
            <nav className="bg-transparent p-4 fixed top-0 left-0 w-full z-50 flex justify-between items-center">
                <div></div>
                <div className="flex space-x-4">
                    <InertiaLink href="/login" className="cursor-pointer h-8">
                        <img src={loginIcon} alt="Login" className="w-8 h-8" />
                    </InertiaLink>
                    <div className="flex space-x-2">
                        <img src={enFlag} alt="English" onClick={() => changeLanguage('en')} className="cursor-pointer h-8"/>
                        <img src={esFlag} alt="Español" onClick={() => changeLanguage('es')} className="cursor-pointer h-8"/>
                    </div>
                </div>
            </nav>
            {/* <nav className="bg-gray-200 p-4 fixed top-0 left-0 w-full z-50">
                <div className="flex justify-between items-center w-full px-2 lg:px-4">
                    <div className="text-lg font-bold">
                        <button onClick={() => scrollToSection('home')} className="text-2xl font-semibold text-primary">Painting México</button>
                    </div>
                    <button
                        className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-secondary lg:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d={!isMenuOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                    </button>
                    <div className={`absolute lg:relative top-16 lg:top-0 right-0 lg:right-0 w-full lg:w-auto bg-gray-200 lg:bg-transparent z-20 transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col lg:flex-row items-center lg:space-x-6`}>
                        {isMenuOpen && (
                            <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-4 lg:hidden absolute top-4 right-4"
                            >
                            </button>
                        )}
                        <button onClick={() => scrollToSection('gallery')} className="text-primary hover:text-secondary py-2 lg:py-0">{translations.galeria}</button>
                        <button onClick={() => scrollToSection('blog')} className="text-primary hover:text-secondary py-2 lg:py-0">{translations.blog}</button>
                        <button onClick={() => scrollToSection('artists')} className="text-primary hover:text-secondary py-2 lg:py-0">{translations.artistas}</button>
                        <button onClick={() => scrollToSection('sales')} className="text-primary hover:text-secondary py-2 lg:py-0">{translations.sales}</button>
                        <button onClick={() => scrollToSection('contact')} className="text-primary hover:text-secondary py-2 lg:py-0">{translations.contacto}</button>
                        <InertiaLink href="/login" className="bg-gray-100 text-primary border border-gray-300 rounded hover:border-secondary focus:outline-none focus:border-secondary px-4 py-2 lg:py-0">
                            {translations.iniciarSesion}
                        </InertiaLink>
                        <select 
                            onChange={(e) => changeLanguage(e.target.value)} 
                            defaultValue={language}
                            className="bg-gray-100 text-primary border border-gray-300 rounded hover:border-secondary focus:outline-none focus:border-secondary px-8 py-2 lg:py-0"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                </div>
            </nav> */}

            {/* Sección de Bienvenida */}
            <div className="relative text-center animate__animated animate__zoomIn">
                {props.info ? (
                    <div className="relative">
                        <img src={props.info.banner} alt="Banner" className="w-full h-auto mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold" style={{ marginTop: 'calc(3vh / 3)' }}>
                                Painting México
                            </h1>
                        </div>
                    </div>
                ) : (
                    <p className="mb-4 text font-primary">{translations.noInfoAvailable}:</p>
                )}
            </div>
            

            {/* Nav Items as Buttons */}
            <div className="text-center space-y-4 mt-10 mb-10">
                <button onClick={() => scrollToSection('gallery')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                    {translations.artwork}
                </button>
                <button onClick={() => scrollToSection('sales')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                    {translations.sales}
                </button>
                <button onClick={() => scrollToSection('blog')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                    {translations.blog}
                </button>
                <button onClick={() => scrollToSection('artists')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                    {translations.artistas}
                </button>                
                <button onClick={() => scrollToSection('contact')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                    {translations.contacto}
                </button>
            </div>

            
            {/* Galería */}
            <div className="Your-custom-class" parallaxData={plxData}>
                <div id="gallery" className="py-20 bg-gray-100" data-aos="fade-up">
                    <div className="text-center mb-10">
                        <button onClick={() => filterArtworksBySection('INAH')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                            INAH
                        </button>
                        <button onClick={() => filterArtworksBySection('Camino Real')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                            Camino Real
                        </button>
                        <button onClick={() => filterArtworksBySection('none')} className="bg-tertiary text-button-text font-bold py-4 px-8 rounded-md text-lg hover:bg-button-hover transition duration-300">
                            Sin sección
                        </button>
                    </div>
                    <div className="container mx-auto px-4">
                        {filteredArtworks.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredArtworks.map((artwork, index) => {
                                    const spanClass = index % 5 === 0 ? 'row-span-2 col-span-2' : '';
                                    return (
                                        <div key={artwork.id} className={`relative overflow-hidden ${spanClass}`} data-aos="zoom-in" onClick={() => openArtworkModal(artwork)}>
                                            <img
                                                className="w-full h-full object-cover rounded cursor-pointer"
                                                src={`${artwork.front}`}
                                                alt={artwork.translations[0]?.id || "Art image"}
                                                onClick={() => openArtworkModal(artwork)}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                                                <span className="text-white text-center px-4">{artwork.translations.find(t => t.locale === language)?.title || 'Título no disponible'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center">{translations.noInfoAvailable}</p>
                        )}
                    </div>                                        
                </div>
            </div>
            {selectedArtwork && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative bg-white p-5 rounded overflow-auto" style={{ width: '100vw', height: '100vh', backgroundColor: `${selectedArtwork.background_color}` }}>
                        {/* Botón para cerrar el modal en la esquina superior derecha */}
                        <button
                            className="absolute top-0 right-0 m-4 text-black flex items-center"
                            onClick={closeArtworkModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium ml-2">{translations.regresar}</span>
                        </button>

                        {/* Título Centrado */}
                        <h3 className="text-2xl font-bold text-center">
                            {selectedArtwork.translations.find(t => t.locale === language)?.title || 'Título no disponible'}
                        </h3>

                        {/* Foto de la portada y descripción */}
                        <div className="flex flex-col md:flex-row justify-between items-center my-4">
                            <div className="w-full md:w-1/2 p-2">
                                <img src={selectedArtwork.front} alt="Portada" className="rounded w-full h-auto" />
                            </div>
                            <div className="w-full md:w-1/2 p-2 text-justify break-words">
                                <div dangerouslySetInnerHTML={{ __html: selectedArtwork.translations.find(t => t.locale === language)?.description || 'Descripción no disponible' }}></div>
                            </div>
                        </div>

                        {/* Carrusel de Imágenes con pie de imagen */}
                        <Slider {...settings}>
                            {selectedArtwork.images.map((image, index) => (
                                <div key={index} className="text-center">
                                    <img src={`${image.url}`} alt={`Imagen ${index + 1}`} className="rounded mb-2 w-full h-auto cursor-pointer" />
                                    <p className="cursor-pointer" onClick={() => { setSelectedImage(image); setIsImageModalOpen(true); }}>
                                        {image.description || 'Sin descripción'}
                                    </p>
                                </div>
                            ))}
                        </Slider>

                        {isImageModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
                                <div className="bg-white p-5 rounded-lg">
                                    <img src={selectedImage.url} alt="Imagen ampliada" className="rounded mb-4 w-auto max-h-[80vh] max-w-[90vw]" />
                                    <button className="px-4 py-2 bg-secondary text-white rounded" onClick={() => setIsImageModalOpen(false)}>
                                        {translations.btnCerrar}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Carrusel de Videos */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {selectedArtwork.videos.map((video, index) => {
                                const videoId = video.url.split('v=')[1].split('&')[0];
                                return (
                                    <div key={index}>
                                        <iframe
                                            width="100%"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded mb-2"
                                        ></iframe>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}


            {/* Ventas */}
            <div id="sales" className="py-20 bg-gray-100" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-center">{translations.sales}</h2><br />
                <div className="container mx-auto px-4">
                    {props.sales.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {props.sales.map((sale, index) => {
                                // Asegúrate de que 'translates' es un array antes de llamar a 'find'
                                const saleTranslation = sale.sale_translates.find(t => t.locale === language);
                                return (
                                    <div key={index} className="overflow-hidden rounded-lg shadow-lg cursor-pointer" data-aos="zoom-in" onClick={() => openSaleProfileModal(sale)}>
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={sale.cover ? `${sale.cover}` : '/storage/avatars/AvatarDefault.png'}
                                            alt={saleTranslation?.title || 'Avatar'}
                                        />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{sale.name}</div>
                                            <p className="text-gray-700 text-base">
                                                {saleTranslation?.title || 'Descripción no disponible'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center">{translations.noInfoAvailable}</p>
                    )}

                    {isSaleModal && selectedSale && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                            <div className="bg-white p-5 rounded-lg max-w-3xl w-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                <img
                                    src={`${selectedSale.cover}`}
                                    alt="Sale Image"
                                    className="mx-auto w-48 h-48 mb-4"
                                    style={{ maxWidth: '80%', height: 'auto' }}
                                />
                                <h2 className="text-2xl font-bold">
                                    {selectedSale.sale_translates.find(t => t.locale === language)?.title || 'No title available'}
                                </h2>
                                <p
                                    className="mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html: selectedSale.sale_translates.find(t => t.locale === language)?.description || 'No description available'
                                    }}
                                ></p>
                                {/* Muestra las imágenes de la galería */}
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedSale.sale_galleries.map((galleryItem) => (
                                        <img
                                            key={galleryItem.idsaleGallery}
                                            src={`${galleryItem.url}`}   
                                            alt="Gallery Image"
                                            className="w-full h-auto rounded"
                                        />
                                    ))}
                                </div>
                                {/* Muestra las URLs asociadas a la venta */}
                                <ul className="list-disc ml-4 mt-4">
                                    {selectedSale.sale_u_r_ls.map((urlItem) => (
                                        <li key={urlItem.idsaleURLs}>
                                            <a href={urlItem.url} target="_blank" rel="noopener noreferrer">
                                                {urlItem.store || 'Store'}: {urlItem.url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={closeSaleModal} className="mt-4 px-4 py-2 bg-secondary text-white rounded">
                                    {translations.btnCerrar}
                                </button>
                            </div>
                        </div>
                    )}
                    {/* TODO: terminar galerias */}

                </div>                
            </div>

            {/* Blog */}
            <div id="blog" className="py-20 bg-gray-100" data-aos="fade-up" >
                <h2 className="text-3xl font-bold text-center">{translations.blog}</h2><br />
                <div className="container mx-auto px-4 " style={{ width: '100vw', height: '80vh'}}>
                    <iframe src="https://jackhannula.blogspot.com" width="80%" height="500px">
                        <p>Tu navegador no soporta iFrame.</p>
                    </iframe>
                </div>

                {/* <div className="container mx-auto px-4">
                    {props.posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {props.posts.map((post) => {
                                const postTranslation = post.translations.find(t => t.locale === language);
                                return (
                                    <div key={post.id} className="overflow-hidden rounded-lg shadow-lg" data-aos="zoom-in" onClick={() => openPostModal(post)}>
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={post.cover}
                                            alt={postTranslation?.title || 'Cover image'}
                                        />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{postTranslation?.title || 'Título no disponible'}</div>
                                            <p className="text-gray-700 text-base">
                                                {post.user?.name || 'Autor no disponible'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center">{translations.noInfoAvailable}</p>
                    )}
                </div>
                {isPostModalOpen && selectedPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                        <div className="bg-white p-5 rounded-lg max-w-3xl w-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
                            {selectedPost.cover && (
                                <img 
                                    src={selectedPost.cover} 
                                    alt="Cover Image" 
                                    className="mx-auto w-70% rounded mb-4"
                                    style={{ maxWidth: '70%', height: 'auto' }}
                                />
                            )}
                            <h2 className="text-2xl font-bold">
                                {selectedPost.translations.find(t => t.locale === language)?.title || 'Título no disponible'}
                            </h2>
                            <div className="mt-2" dangerouslySetInnerHTML={{
                                __html: selectedPost.translations.find(t => t.locale === language)?.content || 'Descripción no disponible'
                            }}>
                            </div>
                            <p className="mt-4">Publicado por: {selectedPost.user.name}</p>
                            <p className="mt-1">Fecha de publicación: {new Date(selectedPost.created_at).toLocaleDateString(language)}</p>
                            <button onClick={closePostModal} className="mt-4 px-4 py-2 bg-secondary text-white rounded">
                                {translations.btnCerrar}
                            </button>
                        </div>
                    </div>
                )} */}
            </div>            

            {/* Artistas */}
            <div id="artists" className="py-20 bg-gray-100" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-center">{translations.artistas}</h2><br />
                <div className="container mx-auto px-4">
                    {props.users.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {props.users.filter(user => user.profile).map((user) => {
                                // Asegúrate de que 'translates' es un array antes de llamar a 'find'
                                const profileTranslation = user.profile.translates?.find(t => t.locale === language);
                                return (
                                    <div key={user.id} className="overflow-hidden rounded-lg shadow-lg cursor-pointer" data-aos="zoom-in" onClick={() => openProfileModal(user)}>
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={user.profile.avatar ? `${user.profile.avatar}` : '/storage/avatars/AvatarDefault.png'}
                                            alt={profileTranslation?.title || 'Avatar'}
                                        />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{user.name}</div>
                                            {/* Aquí utilizamos dangerouslySetInnerHTML para renderizar el HTML */}
                                            <p className="text-gray-700 text-base" dangerouslySetInnerHTML={{ __html: profileTranslation?.description || 'Descripción no disponible' }}></p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center">{translations.noInfoAvailable}</p>
                    )}

                    {isProfileModalOpen && selectedUser?.profile && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                            <div className="bg-white p-5 rounded-lg max-w-3xl w-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                {selectedUser.profile.avatar && (
                                    <img
                                        src={selectedUser.profile.avatar ? `${selectedUser.profile.avatar}` : '/storage/avatars/AvatarDefault.png'}
                                        alt="Avatar"
                                        className="mx-auto w-48 h-48 rounded-full mb-4"
                                        style={{ maxWidth: '70%', height: 'auto' }}
                                    />
                                )}
                                <h2 className="text-2xl font-bold">
                                    {selectedUser.name}
                                </h2>
                                <p className="mt-2"
                                    dangerouslySetInnerHTML={{ 
                                        __html: selectedUser.profile.translates?.find(t => t.locale === language)?.description || 'Descripción no disponible' 
                                    }}
                                >
                                </p>
                                <button onClick={closeProfileModal} className="mt-4 px-4 py-2 bg-secondary text-white rounded">
                                    {translations.btnCerrar}
                                </button>
                            </div>
                        </div>
                    )}
                </div>                
            </div>

            {/* Contacto */}
            <div id="contact" className="py-20 bg-gray-100" data-aos="fade-up">
                <h2 className="text-3xl font-bold text-center">{translations.contacto}</h2>
                <div className="mt-8 text-center">
                    {props.info ? (                            
                        <>
                            <p className="mb-4 text font-primary">{translations.mensajeContacto}:</p><a href={`mailto:${props.info.email}`} className="inline-block bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                                {translations.enviarCorreoA} {props.info.email}
                            </a>
                        </>                    
                    ) : (
                        <p className="mb-4 text font-primary">{translations.noInfoAvailable}:</p>
                    )}
                </div>                
            </div>

            

        </div>
    );
}