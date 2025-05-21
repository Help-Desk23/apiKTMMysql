const db = require('../../config/db');
const multer = require('multer');
const path = require('path');


// Configuracion de multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

// Controlador GET para obtener las motos

const getMotos = async (socket) => {
    const query = "SELECT * FROM motos";

    try{
        const [rows] = await db.promise().query(query);
        
        if(!rows || rows.length === 0) {
            return socket.emit('error', { message: "No se encontraron motos" });
        }
        socket.emit('motos', rows);
    } catch (err) {
        console.error("Error al obtener motos:", err);
        socket.emit('error', { message: "Error al obtener motos" });
    }
};

// Controlador POST para agregar una moto

const addMotos = async (req, res) => {
    const {modelo, precious, inicialbs} = req.body;

    const port = req.get('host').split(':')[1];
    const img_motos = req.file ? `http://177.222.114.122:${port}/uploads/${req.file.filename}` : null;

    try {
        const query = "INSERT INTO motos (modelo, precious, inicialbs, img_motos) VALUES (?, ?, ?, ?)";
        const values = [modelo, precious, inicialbs, img_motos];

        
        await db.promise().query(query, values);

        res.status(201).json({message: "Moto añadida exitosamente"});
    } catch (err) {
        console.error("Error al añadir la moto:", err);
        res.status(500).json({error: "Error al añadir la moto"});
    }
};

// Controlador PATCH para actualizar una moto

const updateMoto = async (req, res) => {
    const { id } = req.params;
    const { modelo, precious, inicialbs } = req.body;

    const port = req.get('host').split(':')[1];
    const img_motos = req.file ? `http://177.222.114.122:${port}/uploads/${req.file.filename}` : null;

    const update = [];
    const values = [];

    if(modelo){
        update.push('modelo = ?');
        values.push(modelo);
    }

    if(precious){
        update.push('precious = ?');
        values.push(precious);
    }

    if(inicialbs){
        update.push('inicialbs = ?');
        values.push(inicialbs);
    }

    if(img_motos){
        update.push('img_motos = ?');
        values.push(img_motos);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"})
    }

    const query = `UPDATE motos SET ${update.join(',')} WHERE id_motos = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar la moto", error);
            return res.status(500).json({error: "Error al actualizar la moto"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Moto no encontrada"})
        }
        res.status(200).json({message: "Moto actualizada correctamente"})
    });
};


// Controlador DELETE para eliminar una moto

const deleteMoto = async (req, res) => {
    const {id} = req.params;
    const query = "DELETE FROM motos WHERE id_motos = ?";
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar la moto", error);
            res.status(500).json({error: "Error al eliminar la moto"});
        } else {
            res.status(201).json({message: "Moto eliminada correctamente"})
        }
    });
}

module.exports = {
    getMotos,
    addMotos,
    updateMoto,
    deleteMoto,
    upload
};