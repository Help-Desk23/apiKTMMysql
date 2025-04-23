const express = require('express');
const { deleteProforma, addProforma } = require('../../controllers/proforma/proforma');

const proformaRout = express.Router();


// Ruta para agregar proforma

proformaRout.post('/proforma', addProforma);

// Ruta para eliminar proforma

proformaRout.delete('/proforma/:id', deleteProforma);

module.exports = proformaRout;