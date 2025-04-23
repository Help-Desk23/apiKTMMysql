const db = require('../../config/db');

// Controlador GET para mostrar asesores

const getAsesores = async (socket) => {
    const query = "SELECT * FROM asesores";
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontró ningún asesor"});
        }
        socket.emit('asesores', rows);
    } catch(err){
        console.error("Error al obtener asesores:", err);
        socket.emit('error', {message: "Error al obtener asesores"});
    }
};

// Controlador POST para crear un asesor

const addAsesor = async (req, res) => {
    const {id_sucursal, asesor, usuario, contraseña} = req.body;
    
    try {
        const query = "INSERT INTO asesores (id_sucursal, asesor, usuario, contraseña) VALUES (?, ?, ?, ?)";
        const values = [id_sucursal, asesor, usuario, contraseña];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar un asesor", error);
                return res.status(500).json({error: "Error al registrar el asesor"});
            }
            res.status(201).json({message: "Asesor ingresado correctamente"});
        });
    } catch(err) {
        console.error("Error al encriptar la contraseña", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Controlador PATCH para actualizar campos de asesor

const updateAsesor = async (req, res) => {
    const {id} = req.params;
    const {id_sucursal, asesor, usuario, contraseña} = req.body;

    const update = []
    const values = []

    if(id_sucursal){
        update.push('id_sucursal = ?');
        values.push(id_sucursal);
    }

    if(asesor){
        update.push('asesor = ?');
        values.push(asesor);
    }

    if(usuario){
        update.push('usuario = ?');
        values.push(usuario);
    }

    if(contraseña){
        update.push('contraseña = ?');
        values.push(contraseña);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"});
    }

    const query = `UPDATE asesores SET ${update.join(', ')} WHERE id_asesores = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar el asesor", error);
            return res.status(500).json({error: "Error al actualizar el asesor"});
        }
        res.status(200).json({message: "Asesor actualizado correctamente"});
    });
};

// Controlador DELETE para eliminar un asesor

const deleteAsesor = async (req, res) => {
    const {id} = req.params;
    const query = "DELETE FROM asesores WHERE id_asesores = ?";
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar el asesor", error);
            return res.status(500).json({error: "Error al eliminar el asesor"});
        } else {
            res.status(201).json({message: "Asesor eliminado correctamente"});
        }
    });
};


// Controlador para realizar login de un asesor

const loginAsesor = async (req, res) => {
    const {usuario, contraseña} = req.body;

    try{
        const query = "SELECT * FROM asesores WHERE usuario = ? AND contraseña = ?";
        const values = [usuario, contraseña];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al iniciar sesión", error);
                return res.status(500).json({error: "Error al iniciar sesión"});
            }

            if(result.length === 0){
                return res.status(401).json({error: "Usuario o contraseña incorrectos"});
            }

            const asesor = result[0];
            res.status(200).json({message: "Inicio exitoso", asesor});
        });
    }catch(err){
        console.error("Error al iniciar sesión", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};


module.exports = {
    getAsesores,
    addAsesor,
    updateAsesor,
    deleteAsesor,
    loginAsesor
};