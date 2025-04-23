const express = require('express');
const { addSucursal, updateSucursal, deleteSucursal } = require('../../controllers/sucursales/sucursal');

const sucursalRout = express.Router();


// Ruta para agregar sucursales

sucursalRout.post('/sucursal', addSucursal);

// Ruta para modificar sucursales

sucursalRout.patch('/sucursal/:id', updateSucursal);

// Ruta para eliminar sucursales

sucursalRout.delete('/sucursal/:id', deleteSucursal)




module.exports = sucursalRout;