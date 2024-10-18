const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Iniciar un proceso en Camunda
app.post('/start-process', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8080/engine-rest/process-definition/key/myProcessKey/start', {
      variables: {
        someVariable: { value: 'value', type: 'String' }
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
