import camundaApi from './axios';

export const startProcessInstance = async (processDefinitionKey, variables) => {
  try {
    const response = await camundaApi.post(`/process-definition/key/${processDefinitionKey}/start`, {
      variables,
    });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar proceso:', error);
    throw error;
  }
};

export const getTaskscamunda = async (assignee) => {
    try {
      const response = await camundaApi.get(`/task?assignee=${assignee}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw error;
    }
};

export const completeTaskcamunda = async (taskId, variables) => {
    try {
      const response = await camundaApi.post(`/task/${taskId}/complete`, {
        variables,
      });
      return response.data;
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      throw error;
    }
  };
  
  export const getProcessDiagram = async (processDefinitionKey) => {
    try {
      const response = await camundaApi.get(`/process-definition/key/${processDefinitionKey}/diagram`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener diagrama BPMN:', error);
      throw error;
    }
  };
   
