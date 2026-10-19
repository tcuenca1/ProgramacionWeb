import express from 'express';
import cors from 'cors';
import { DtoUsuario } from './aplicacion/dto/DtoUsuario.js';
import { AdapSalida_SerializacionBinaria } from './infraestructura/adaptadores/salida/AdapSalida_SerializacionBinaria.js';
import { contenedorUsuario } from './contenedor/ContenedorUsuario.js';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido al servidor backend de ProgramacionWeb' });
});

app.get('/api/hola', (req, res) => {
    res.json({ message: 'Hola desde el servidor con Docker' });
});

app.get('/6A/mensaje-bloqueante', (req, res) => {
    let c = Date.now();
    while (Date.now() - c < 10000) {}
    adapEntrada.leerMensaje(req, res);
});

app.get('/6A/mensaje-no-bloqueante', async (req, res) => {
    await new Promise((promise) => {
        setTimeout(promise, 10000);
        adapEntrada.leerMensaje(req, res);
    });
});

app.get('/6A/usuario', async (req, res) => {
    await contenedorUsuario.adap.autentica(req, res);
});

app.get('/6A/usuario-binario', async (req, res) => {
    const usu = req.query.usu ?? 'juan';
    const cont = req.query.cont ?? 'perez';
    const dtoUsuario = new DtoUsuario(usu, cont, true, 'Machala', '0961863035');
    
    const adapBinario = new AdapSalida_SerializacionBinaria();
    const resultadoBinario = adapBinario.serializarYDeserializar(dtoUsuario);

    res.json({
        mensaje: "Serialización y Deserialización Binaria con V8 exitosa",
        ...resultadoBinario
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
