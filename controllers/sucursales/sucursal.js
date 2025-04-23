const db = require('../../config/db');

// Controlador GET para mostrar sucursales

const getSucursales = async (socket) => {
    const query = 'SELECT * FROM sucursales';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length ===0){
            return socket.emit('error', {message: "No se encontraron sucursales"})
        }
        socket.emit('sucursal', rows);
    } catch(err){
        console.error("Error al obtener sucursales:", err);
        socket.emit('error', {message: "Error al obtener sucursales"});
    }
};


// Controlador POST para crear una sucursal

const addSucursal = async (req, res) => {
    const {sucursal} = req.body;

    try{
        const query = "INSERT INTO sucursales (sucursal) VALUES (?)";
        const values = [sucursal];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar un sucursal", error);
                return res.status(500).json({error: "Error al registrar sucursal"});
            }
            res.status(201).json({message: "Sucursal ingresada correctamente"});
        })
    }catch(err){
        console.error("Error al ingresar una sucursal", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Controlador PATCH para actualizar campos de las sucursales

const updateSucursal = async (req, res) => {
    const {id} = req.params;
    const {sucursal} = req.body;

    const update = []
    const values = []


    if(sucursal){
        update.push('sucursal = ?');
        values.push(sucursal);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron cambios para actualizar"});
    }

    const query = `UPDATE sucursales SET ${update.join(',')} WHERE id_sucursal = ?`;
    values.push(id);
    
    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar sucursal", error);
            return res.status(500).json({error: "Error al actualizar sucursal"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Sucursal no encontrada"});
        }
        res.status(200).json({message: "Sucursal actualizada correctamente"});
    });
};


// Controladro DELETE para eliminar sucursales

const deleteSucursal = async (req, res) => {
    const {id} = req.params;
    const query = "DELETE FROM sucursales WHERE id_sucursal = ?";
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar sucursal", error);
            return res.status(500).json({error: "Error al eliminar sucursal"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Sucursal no encontrada"});
        }
        res.status(200).json({message: "Sucursal eliminada correctamente"});
    });
};

module.exports = {
    getSucursales,
    addSucursal,
    updateSucursal,
    deleteSucursal
};