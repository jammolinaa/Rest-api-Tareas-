const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para trabajar con JSON
app.use(express.json());

// Leer tareas desde tareas.json
const leerTareas = () => {
  const data = fs.readFileSync('tareas.json', 'utf8');
  return JSON.parse(data);
};

// Guardar tareas en tareas.json
const guardarTareas = (tareas) => {
  fs.writeFileSync('tareas.json', JSON.stringify(tareas, null, 2));
};

// Rutas
app.get('/tareas', (req, res) => {
  res.json(leerTareas());
});

app.post('/tareas', (req, res) => {
  const tareas = leerTareas();
  const nuevaTarea = { id: Date.now(), ...req.body };
  tareas.push(nuevaTarea);
  guardarTareas(tareas);
  res.status(201).json(nuevaTarea);
});

app.put('/tareas/:id', (req, res) => {
  const tareas = leerTareas();
  const tareaIndex = tareas.findIndex(t => t.id === parseInt(req.params.id));
  if (tareaIndex === -1) return res.status(404).json({ error: 'Tarea no encontrada' });

  tareas[tareaIndex] = { ...tareas[tareaIndex], ...req.body };
  guardarTareas(tareas);
  res.json(tareas[tareaIndex]);
});

app.delete('/tareas/:id', (req, res) => {
  let tareas = leerTareas();
  tareas = tareas.filter(t => t.id !== parseInt(req.params.id));
  guardarTareas(tareas);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
