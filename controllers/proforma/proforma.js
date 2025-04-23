const db = require('../../config/db.js');

// Controlador GET para obtener proformas

const getProformas = async (socket) => {
    const query = "SELECT * FROM proforma";
    try {
        const [rows] = await db.promise().query(query);

        if (!rows || rows.length === 0) {
            return socket.emit('error', { message: "No se encontró ninguna proforma" });
        }
        socket.emit('proformas', rows);
    } catch (err) {
        console.error("Error al obtener proformas:", err);
        socket.emit('error', { message: "Error al obtener proformas" });
    }
};

// Controlador POST para crear una proforma

const addProforma = async (req, res) => {
    const {id_cliente, id_asesores, id_motos, id_sucursal, plazo, precious, inicialbs, cuota_mes} = req.body;
    const fecha = new Date();
    
    try{
        const query = "INSERT INTO proforma (id_cliente, id_asesores, id_motos, id_sucursal, plazo, precious, inicialbs, fecha, cuota_mes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [id_cliente, id_asesores, id_motos, id_sucursal, plazo, precious, inicialbs, fecha, cuota_mes];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error("Error al ingresar una proforma", error);
                return res.status(500).json({ error: "Error al registrar la proforma" });
            }
            res.status(201).json({ message: "Proforma ingresada correctamente" });
        });
    }catch(err){
        console.error("Error al ingresar la proforma", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador DELETE para eliminar una proforma

const deleteProforma = async (req, res) => {
    const {id} = req.params;
    const query = "DELETE FROM proforma WHERE id_proforma = ?";
    const values = [id];

    db.query(query, values, (error, result) => {
        if (error){
            console.error("Error al eliminar la proforma", error);
            return res.status(500).json({ error: "Error al eliminar la proforma" });
        } else{
            res.status(200).json({ message: "Proforma eliminada correctamente" });
        }
    });
};


// Controlador para obtener proforma detallada

const getCotizacion = async (socket) => {
    const query = `SELECT 
                c.id_cliente,
                c.nombre AS nombre_cliente,
                c.telefono,
                p.plazo,
                p.precious,
                p.inicialbs,
                p.fecha,
                p.cuota_mes,
                m.modelo AS modelo,
                a.asesor AS asesor,
                s.sucursal AS sucursal,
                m.img_motos AS img_moto
            FROM 
                clientes AS c
            INNER JOIN 
                proforma AS p ON c.id_cliente = p.id_cliente
            INNER JOIN 
                motos AS m ON p.id_motos = m.id_motos
            INNER JOIN 
                asesores AS a ON p.id_asesores = a.id_asesores
            INNER JOIN 
                sucursales AS s ON p.id_sucursal = s.id_sucursal;
            `;
            try{
                const [rows] = await db.promise().query(query);
                if (!rows || rows.length === 0) {
                    return socket.emit('error', { message: "No se encontró ninguna cotización"});
                }
                socket.emit('proformaData', rows);
            }catch(err){
                console.error("Error al obtener cotización:", err);
                socket.emit('error', { message: "Error al obtener la cotización" });
            }
};

// Controlador para mostrar proformas en base a los id de asesores


const getCotizacionAsesor = async (socket, id_asesores) => {
    const query = `SELECT 
                c.id_cliente,
                c.nombre AS nombre_cliente,
                c.telefono,
                p.plazo,
                p.precious,
                p.inicialbs,
                p.fecha,
                p.cuota_mes,
                m.modelo AS modelo,
                a.asesor AS asesor,
                s.sucursal AS sucursal,
                m.img_motos AS img_moto
            FROM 
                clientes AS c
            INNER JOIN 
                proforma AS p ON c.id_cliente = p.id_cliente
            INNER JOIN 
                motos AS m ON p.id_motos = m.id_motos
            INNER JOIN 
                asesores AS a ON p.id_asesores = a.id_asesores
            INNER JOIN 
                sucursales AS s ON p.id_sucursal = s.id_sucursal
            WHERE
                p.id_asesores = ?;`
                ;
            try{
                const [rows] = await db.promise().query(query, [id_asesores]);
                if(!rows || rows.length === 0) {
                    return socket.emit('error', {message: "No se encontro ninguna cotizacion"});
                }
                socket.emit('proformaData', rows);
            }catch(err){
                console.error("Error al obtener la cotizacion", err);
                socket.emit('error', {message: "Error al obtener la cotizacion"})
            }
};


module.exports = {
    getProformas,
    addProforma,
    deleteProforma,
    getCotizacion,
    getCotizacionAsesor
};