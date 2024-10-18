import React, { useState } from 'react';
import { startProcessInstance } from '../api/tasks';

const StartProcessButton = () => {
  const [processInstanceId, setProcessInstanceId] = useState(null);

  const handleStartProcess = async () => {
    try {
      const processDefinitionKey = 'my-process-key'; // Cambia esto según tu proceso
      const variables = {
        // Variables que tu proceso requiere
        exampleVariable: { value: 'exampleValue', type: 'String' },
      };

      const result = await startProcessInstance(processDefinitionKey, variables);
      setProcessInstanceId(result.id);
    } catch (error) {
      console.error('Error al iniciar el proceso:', error);
    }
  };

  return (
    <div>
      <button onClick={handleStartProcess}>Iniciar Proceso</button>
      {processInstanceId && <p>Proceso Iniciado: {processInstanceId}</p>}
    </div>
  );
};

export default StartProcessButton;
