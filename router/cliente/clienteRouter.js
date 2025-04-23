const express = require('express');
const { addCliente } = require('../../controllers/cliente/cliente');

const clienteRouter = express.Router();

// Ruta para agregar clientes

clienteRouter.post('/clientes', addCliente );


module.exports = clienteRouter;