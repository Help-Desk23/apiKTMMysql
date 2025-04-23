const express = require('express');
const {addAdmin, updateAdmin, deleteAdmin, loginAdmin} = require('../../controllers/admin/admin');

const adminRouter = express.Router();

// Rutas para agregar usuario administrador

adminRouter.post('/admin', addAdmin);

// Ruta para modificar un usuario administrador

adminRouter.patch('/admin/:id', updateAdmin);

// Ruta para eliminar un usuario administrador

adminRouter.delete('/admin/:id', deleteAdmin);

// Ruta login para administradores

adminRouter.post('/admin/login', loginAdmin);




module.exports = adminRouter;