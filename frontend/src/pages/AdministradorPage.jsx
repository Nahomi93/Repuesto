import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaTiktok, FaPeriscope } from 'react-icons/fa'; 
import "../styles/styles.css";

const images = [
  '../src/imagenes/Foto2.png',
  '../src/imagenes/Foto3.png',
  '../src/imagenes/Foto4.png',
  '../src/imagenes/Foto5.png',
];


export function AdministradorPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative">

      <div className="absolute top-7 left-1/3 ml-32">
        <h1 className="text-3xl font-bold">Bienvenido, especialista técnico</h1>
      </div>

      <div className="relative w-3/4 max-w-xl">
        <div className="absolute arrow-left-custom-margin">
          <FaChevronLeft 
            onClick={prevImage} 
            size={30} 
            className="cursor-pointer text-gray-400 hover:text-green-600 transition-colors duration-300"
          />
        </div>
        
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-auto object-cover rounded-lg shadow-md image-custom-margin"
        />

        <div className="absolute arrow-right-custom-margin">
          <FaChevronRight 
            onClick={nextImage} 
            size={30} 
            className="cursor-pointer text-gray-400 hover:text-green-600 transition-colors duration-300"
          />
        </div>
      </div>

      <div className="flex justify-between max-w-4xl mt-3 ml-72">
        <div style={{ backgroundColor: '#86b250' }} className="p-6 shadow-lg rounded-lg text-center w-1/3 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 1: Reservaciones</h2>
            <p style={{ color: 'white' }}>
            Como técnico, revisa las reservas en la sección de "Reservas". Aquí podrás aceptar o rechazar las solicitudes de los clientes.
            </p>
        </div>

        <div style={{ backgroundColor: '#677978' }} className="p-6 shadow-lg rounded-lg text-center w-1/3 mx-4 transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 2: Registrar Reparación</h2>
          <p style={{ color: 'white' }}>
          Podrás registrar los detalles de la reparación, documentar los problemas encontrados y las acciones que tomarás para resolverlos.</p>
        </div>

        <div style={{ backgroundColor: '#ecab0f' }} className="p-6 shadow-lg rounded-lg text-center w-1/3 transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 3: Actualizar Progreso</h2>
          <p style={{ color: 'white' }}>
          Mantén al cliente informado actualizando el estado de la reparación.</p>
        </div>
      </div>

      <div className="w-full bg-[#3b3b3b] text-center py-6 mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 ml-72">Contáctenos</h2>
        <div className="flex justify-center gap-6 ml-72">
          <a href="https://maps.app.goo.gl/wpDnjCRUvTik5uce6" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition-colors duration-300">
            <FaPeriscope size={28} />
          </a>
          <a href="https://www.facebook.com/Infobest.SRL" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors duration-300">
            <FaFacebook size={28} />
          </a>
          <a href="https://www.instagram.com/infobest_srl/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors duration-300">
            <FaInstagram size={28} />
          </a>
          <a href="https://www.tiktok.com/@infobest.srl" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-400 transition-colors duration-300">
            <FaTiktok size={28} />
          </a>
        </div>
      </div>
    </section>
  );
}