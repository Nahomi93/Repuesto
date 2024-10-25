import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaTiktok, FaPeriscope } from 'react-icons/fa';
import "../styles/styles.css";
import { BasicNotifiacion } from '../components/ui/BasicNotification';

import { useTasks } from "../context/TaskContext";
import { useReparaciones } from '../context/ReparacionContext';
import { useAuth } from '../context/AuthContext';
const images = [
  '../src/imagenes/Foto1.png',
  '../src/imagenes/Foto2.png',
  '../src/imagenes/Foto3.png',
  '../src/imagenes/Foto4.png',
  '../src/imagenes/Foto5.png',
];

export function ClientehomePage() {
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const { tasks, getTask } = useTasks();
  const { reparaciones, getReparacionesclientes } = useReparaciones();

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const [notificacionReservaMostrada, setNotificacionReservaMostrada] = useState(false);
  const [notificacionCambiosMostrada, setNotificacionCambiosMostrada] = useState(false);
  const [notificacionDevolucionMostrada, setNotificacionDevolucionMostrada] = useState(false);


  useEffect(() => {

      getTask(user.id);
      getReparacionesclientes(user.id);
    
  }, []);


  useEffect(() => {
    const cincoDiasEnMilisegundos = 5 * 24 * 60 * 60 * 1000;
    const fechaActual = new Date();
    // Verifica si hay alguna tarea que cumpla con las condiciones para la reserva
    const hayReservaAceptada = tasks.some(task => {
      const fechaCreacion = new Date(task.createdAt);
      return (
        task.estado === "Aceptada" && // Verifica que el estado sea 'Aceptada'
        (fechaActual - fechaCreacion) <= cincoDiasEnMilisegundos && // Creada en los últimos 5 días
        (fechaActual - fechaCreacion) > 0 // Asegúrate de que la fecha de creación no sea futura
      );
    });
    console.log("reserva"+hayReservaAceptada)

    // Verifica si hay reparaciones aceptadas que necesitan cambios
    const hayCambiosRequeridos = reparaciones.some(reparacion => {
      return (
        (!reparacion.aceptacion_cambios || reparacion.aceptacion_cambios === false) // Verifica que aceptacion_cambios sea false o null
      );
    });
    console.log("cambios"+hayReservaAceptada)

    // Si hay una reserva aceptada y no se ha mostrado la notificación de reserva
    if (hayReservaAceptada && !notificacionReservaMostrada) {
      setNotificacionReservaMostrada(true); // Marca la notificación de reserva como mostrada
    }

    // Si hay cambios requeridos y no se ha mostrado la notificación de cambios
    if (hayCambiosRequeridos && !notificacionCambiosMostrada) {
      setNotificacionCambiosMostrada(true); // Marca la notificación de cambios como mostrada
    }
  }, [tasks, reparaciones, notificacionReservaMostrada, notificacionCambiosMostrada]); // Este efecto se ejecuta cada vez que cambian las tareas o reparaciones


  useEffect(() => {
    const fechaActual = new Date();
    const tresDiasEnMilisegundos = 3 * 24 * 60 * 60 * 1000;

    const hayDevolucionProxima = reparaciones.some(reparacion => {
      if (!reparacion.fecha_devolucion) return false;
      const fechaDevolucion = new Date(reparacion.fecha_devolucion);
      return (
        fechaDevolucion - fechaActual <= tresDiasEnMilisegundos &&
        fechaDevolucion - fechaActual > 0 // Asegúrate de que no sea una fecha pasada
      );
    });

    if (hayDevolucionProxima && !notificacionDevolucionMostrada) {
      setNotificacionDevolucionMostrada(true);
    }
  }, [reparaciones, notificacionDevolucionMostrada]);

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);

  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative">

<div 
        style={{
          display: 'flex',
          flexDirection: 'column', // Coloca las notificaciones en columna
          gap: '10px', // Espacio entre las notificaciones
          position: 'absolute', // Ajusta la posición según sea necesario
          top: '20px', // Ajusta la posición vertical
          right: '20px', // Ajusta la posición horizontal
        }}
      >
        {notificacionDevolucionMostrada && (
          <BasicNotifiacion> La fecha de devolución de su equipo está próxima.</BasicNotifiacion>
        )}

        {/* Muestra la notificación de reserva si no ha sido mostrada */}
        {notificacionReservaMostrada && (
          <BasicNotifiacion >Se aceptó una reserva</BasicNotifiacion>
        )}

        {/* Muestra la notificación de cambios si no ha sido mostrada */}
        {notificacionCambiosMostrada && (
          <BasicNotifiacion  >Debe aceptar cambios</BasicNotifiacion>
        )}
      </div>
      <div className="absolute top-7 left-1/3 ml-32">
        <h1 className="text-3xl font-bold">Bienvenido al Servicio Técnico</h1>
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
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 1: Reservación</h2>
          <p style={{ color: 'white' }}>
            Diríjase a la opción de "Reservas" y añada una nueva. Espere la confirmación de su reserva, que puede ser aceptada o rechazada.
          </p>
        </div>

        <div style={{ backgroundColor: '#677978' }} className="p-6 shadow-lg rounded-lg text-center w-1/3 mx-4 transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 2: Llevar el Equipo</h2>
          <p style={{ color: 'white' }}>
            Si su reserva es aceptada, deberá llevar su equipo informático para revisión. Si es rechazada, deberá solicitar una nueva reserva.</p>
        </div>

        <div style={{ backgroundColor: '#ecab0f' }} className="p-6 shadow-lg rounded-lg text-center w-1/3 transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'white' }}>Paso 3: Ver Reparación</h2>
          <p style={{ color: 'white' }}>
            Una vez que el equipo sea recepcionado, podrá visualizar la reparación en la pestaña "Ver Reparación", donde podrá aceptar cambios si es necesario.</p>
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

export default ClientehomePage;