const db = require('../../config/db');

// Controlador GET para mostrar costosvarios

const getCostos = async  (socket) => {
    const query = 'SELECT * FROM costovarios';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length ===0){
            return socket.emit('error', {message: "No se encontraron costosvarios"})
        }
        socket.emit('costosvarios', rows);
    } catch(err){
        console.error("Error al obtener costosvarios:", err);
        socket.emit('error', {message: "Error al obtener costosvarios"});
    }
};

// Controlador POST para crear costos varios

const addCosto = async (req, res) => {
    const { interes_anual, tipo_cambio, formulario} = req.body;
    const fecha_actualizacion = new Date();

    try {
        const query = "INSERT INTO costovarios (interes_anual, tipo_cambio, formulario, fecha_actualizacion) VALUES (?, ?, ?, ?)";
        const values = [interes_anual, tipo_cambio, formulario, fecha_actualizacion];

        db.query(query, values, (error, result) => {
            if(error) {
                console.error("Error al ingresar costos varios", error);
                return res.status(500).json({error: "Error al registra costo varios"});
            }
            res.status(201).json({message: "Costo varios ingresado correctamente"});
        });
    } catch(err) {
        console.error("Error al ingresar costos varios", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Controlador PATCH para actualizar campos de costos varios

const updateCosto = async (req, res) => {
    const {id} = req.params;
    const {interes_anual, tipo_cambio, formulario} = req.body;
    const fecha_actualizacion = new Date();

    const update = []
    const values = []

    if(interes_anual){
        update.push('interes_anual = ?');
        values.push(interes_anual);
    }

    if(tipo_cambio){
        update.push('tipo_cambio = ?');
        values.push(tipo_cambio);
    }

    if(formulario){
        update.push('formulario = ?');
        values.push(formulario);
    }

    if(fecha_actualizacion){
        update.push('fecha_actualizacion = ?');
        values.push(fecha_actualizacion);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron cambios para actualizar"});
    }

    const query = `UPDATE costovarios SET ${update.join(',')} WHERE id = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar costos varios", error);
            return res.status(500).json({error: "Error al actualizar costos varios"});
        }
        res.status(200).json({message: "Costo varios actualizado correctamente"});
    });
};


// Controlador DELETE para eliminar costos varios

const deleteCosto = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM costovarios WHERE id = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar costos varios", error);
            return res.status(500).json({error: "Error al eliminar costos varios"});
        } else {
            res.status(200).json({message: "Costo varios eliminado correctamente"});
        }
    });
};


module.exports = {
    getCostos,
    addCosto,
    updateCosto,
    deleteCosto
};