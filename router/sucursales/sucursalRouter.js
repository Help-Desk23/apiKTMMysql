const express = require('express');
const { addSucursal, updateSucursal } = require('../../controllers/sucursales/sucursal');

const sucursalRout = express.Router();


// Ruta para agregar sucursales

sucursalRout.post('/sucursal', addSucursal);

// Ruta para modificar sucursales

sucursalRout.patch('/sucursal/:id', updateSucursal);




module.exports = sucursalRout;