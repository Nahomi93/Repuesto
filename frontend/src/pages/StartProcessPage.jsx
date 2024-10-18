import React, { useState } from 'react';
import { startProcessInstance } from '../api/taskcamunda';

const StartProcessPage = () => {
  const [processInstanceId, setProcessInstanceId] = useState(null);

  const handleStartProcess = async () => {
    try {
      const processDefinitionKey = 'my-process-key'; // Ajusta esto según tu proceso
      const variables = {
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
      <h1>Iniciar Proceso</h1>
      <button onClick={handleStartProcess}>Iniciar Proceso</button>
      {processInstanceId && <p>Proceso Iniciado: {processInstanceId}</p>}
    </div>
  );
};

export default StartProcessPage;
