const express = require('express');
const { upload, addMotos, updateMoto, deleteMoto } = require('../../controllers/motos/motos');

const motosRouter = express.Router();

// Rutas para agregar motos

motosRouter.post('/motos', upload.single('img_motos'), addMotos);

// Ruta para modificar una moto

motosRouter.patch('/motos/:id', upload.single('img_motos'), updateMoto);

// Ruta para eliminar una moto

motosRouter.delete('/motos/:id', deleteMoto);


module.exports = motosRouter;