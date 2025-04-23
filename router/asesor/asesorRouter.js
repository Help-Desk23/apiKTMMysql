const express = require('express');
const { addAsesor, updateAsesor, deleteAsesor, loginAsesor } = require('../../controllers/asesor/asesor');

const asesorRouter = express.Router();

// Ruta para agregar asesores nuevos

asesorRouter.post('/asesores', addAsesor);


// Ruta para modificar un asesor

asesorRouter.patch('/asesores/:id', updateAsesor);

// Ruta para eliminar un asesor

asesorRouter.delete('/asesores/:id', deleteAsesor);


// Ruta para login de usuario

asesorRouter.post('/asesores/login', loginAsesor);

module.exports = asesorRouter;