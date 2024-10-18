import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos de toastify

export function BasicNotifiacion({ children }) {
    useEffect(() => {
      // Mostrar la notificación solo cuando el componente se monta
      toast(children);
    }, [children]); // Dependencia para mostrar la notificación solo cuando 'children' cambie
  
    return <ToastContainer />;
  }