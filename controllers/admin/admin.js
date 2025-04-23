const db = require('../../config/db');



// Controlador GET para obtener usuarios admnistadores

const getAdmin = async (socket) => {
    const query = 'SELECT * FROM useradmin';
    try {
        const [rows] = await db.promise().query(query);

        if (!rows || rows.length === 0) {
            return socket.emit('error', { message: "No se encontró ningún usuario administrador" });
        }

        socket.emit('useradmin', rows);
    } catch (err) {
        console.error("Error al obtener usuarios administradores:", err);
        socket.emit('error', { message: "Error al obtener usuarios administradores" });
    }
};


// Controlador POST para crear un usuario administrador

const addAdmin = async (req, res) => {
    const { nombre, usuario, contraseña } = req.body;

    try {
        const query = "INSERT INTO useradmin (nombre, usuario, contraseña) VALUES (?, ?, ?)";
        const values = [nombre, usuario, contraseña];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error("Error al ingresar un usuario administrador", error);
                return res.status(500).json({ error: "Error al registrar el administrador" });
            }
            res.status(201).json({ message: "Usuario administrador ingresado correctamente" });
        });
    } catch (err) {
        console.error("Error al encriptar la contraseña", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador PATCH para actualizar un campo del usuario administrador

const updateAdmin = async(req, res) => {
    const {id} = req.params;
    const {nombre, usuario, contraseña} = req.body;

    const update = []
    const values = []

    if(nombre){
        update.push('nombre = ?');
        values.push(nombre);
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

    const query = `UPDATE useradmin SET ${update.join(',')} WHERE id_admin = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar el usuario", error);
            return res.status(500).json({error: "Error al actualizar el usuario"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Usuario no encontrado"});
        }

        res.status(200).json({message: "Usuario actualizado correctamente"});
    });
};

// Controlador DELETE para eliminar un usuario administrador

const deleteAdmin = (req, res) => {
    const {id} = req.params;
    const query = "DELETE FROM useradmin WHERE id_admin = ?";
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar un usuario", error);
            res.status(500).json({error: "Error en el metodo DELETE"});
        } else{
            res.status(201).json({message: "Usuario eliminado correctamente"});
        }
    });
};

// Controlador para login de un usuario administrador

const loginAdmin = async (req, res) => {
    const {usuario, contraseña} = req.body;

    try{
        const query = "SELECT * FROM useradmin WHERE usuario= ? AND contraseña= ?";
        const values = [usuario, contraseña];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al iniciar sesión", error);
                return res.status(500).json({error: "Error al iniciar sesión"});
            }
            if(result.length === 0){
                return res.status(401).json({error: "Usuario o contraseña incorrecta"});
            }
            const admin = result[0];
            res.status(200).json({message: "Inicio exitoso", admin});
        });
    }catch(err){
        console.error("Error al iniciar sesión", err);
        res.status(500).json({error: "Erro interno del servidor"})
    }
};


module.exports = {
    getAdmin,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin
};


