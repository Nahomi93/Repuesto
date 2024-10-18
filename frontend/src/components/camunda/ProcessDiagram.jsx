import React, { useEffect, useState } from 'react';
import { getProcessDiagram } from '../api/tasks';

const ProcessDiagram = ({ processDefinitionKey }) => {
  const [diagram, setDiagram] = useState('');

  useEffect(() => {
    const fetchDiagram = async () => {
      try {
        const diagramData = await getProcessDiagram(processDefinitionKey);
        setDiagram(`data:image/svg+xml;base64,${btoa(diagramData)}`);
      } catch (error) {
        console.error('Error al obtener diagrama:', error);
      }
    };

    fetchDiagram();
  }, [processDefinitionKey]);

  return (
    <div>
      {diagram ? <img src={diagram} alt="Diagrama BPMN" /> : <p>Cargando diagrama...</p>}
    </div>
  );
};

export default ProcessDiagram;
