const express = require('express');
const { addCosto, updateCosto, deleteCosto } = require('../../controllers/costovarios/costo');


const costoRouter = express.Router();

// Ruta para agregar costos varios

costoRouter.post('/costovarios', addCosto);

// Ruta para modificar costos varios

costoRouter.patch('/costovarios/:id', updateCosto);


// Ruta para eliminar costos varios

costoRouter.delete('/costovarios/:id', deleteCosto);



module.exports = costoRouter;