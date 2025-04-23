const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { getAdmin } = require('./controllers/admin/admin');
const adminRouter = require('./router/admin/adminRouter');
const { getSucursales } = require('./controllers/sucursales/sucursal');
const sucursalRout = require('./router/sucursales/sucursalRouter');
const { getCostos } = require('./controllers/costovarios/costo');
const costoRouter = require('./router/costovarios/costoRouter');
const { getAsesores } = require('./controllers/asesor/asesor');
const asesorRouter = require('./router/asesor/asesorRouter');
const { getMotos } = require('./controllers/motos/motos');
const motosRouter = require('./router/motos/motosRouter');
const path = require('path');
const { getProformas, getCotizacion, getCotizacionAsesor } = require('./controllers/proforma/proforma');
const proformaRout = require('./router/proforma/proformaRouter');
const { getClientes } = require('./controllers/cliente/cliente');
const clienteRouter = require('./router/cliente/clienteRouter');


const app = express();
app.use(express.json());
require('dotenv').config();


// Configuracion inicial WebSocket

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);


    socket.on('obtenerAdmin', () => {getAdmin(socket)});
    socket.on('obtenerSucursales', () => {getSucursales(socket)});
    socket.on('obtenerCosto',() => {getCostos(socket)});
    socket.on('obtenerAsesores', () => {getAsesores(socket)});
    socket.on('obtenerMotos', () => {getMotos(socket)});
    socket.on('obtenerProformas', () => {getProformas(socket)});
    socket.on('obtenerCotizacion', () =>{getCotizacion(socket)});
    socket.on('obtenerCotizacionAsesor', ({id_asesores}) => getCotizacionAsesor(socket, id_asesores));
    socket.on('obtenerClientes', () =>{getClientes(socket)});

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('🚀 API funcionando correctamente desde Render');
  });


app.use("/", adminRouter);
app.use("/", sucursalRout);
app.use("/", costoRouter);
app.use('/', asesorRouter);
app.use('/', motosRouter);
app.use('/', clienteRouter);
app.use('/', proformaRout);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
