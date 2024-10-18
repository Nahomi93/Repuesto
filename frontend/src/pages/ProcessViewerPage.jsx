import React, { useEffect, useState } from 'react';
import camundaApi from '../api/camunda';

const ProcessViewerPage = ({ processDefinitionKey }) => {
  const [diagram, setDiagram] = useState('');

  useEffect(() => {
    const fetchDiagram = async () => {
      try {
        const response = await camundaApi.get(`/process-definition/key/${processDefinitionKey}/diagram`);
        setDiagram(`data:image/svg+xml;base64,${btoa(response.data)}`);
      } catch (error) {
        console.error('Error al obtener diagrama:', error);
      }
    };

    fetchDiagram();
  }, [processDefinitionKey]);

  return (
    <div>
      <h1>Diagrama del Proceso</h1>
      {diagram ? <img src={diagram} alt="Diagrama BPMN" /> : <p>Cargando diagrama...</p>}
    </div>
  );
};

export default ProcessViewerPage;
