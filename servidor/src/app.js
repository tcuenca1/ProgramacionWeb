import express from 'express';
import cors from 'cors';
import { AdapEntrada_PeticionWeb } from './infraestructura/adaptadores/entrada/AdapEntrada_PeticionWeb.js';
import { AdapEntrada_UsuarioWeb } from './infraestructura/adaptadores/entrada/AdapEntrada_UsuarioWeb.js';
import { CasoUso_Mensaje } from './aplicacion/caso_uso/CasoUso_Mensaje.js';
import { CasoUso_UsuarioLectura } from './aplicacion/caso_uso/lectura/CasoUso_UsuarioLectura.js';
import { DtoUsuario } from './aplicacion/dto/DtoUsuario.js';
import { AdapSalida_SerializacionBinaria } from './infraestructura/adaptadores/salida/AdapSalida_SerializacionBinaria.js';

const app = express();
app.use(cors());

const msj = new CasoUso_Mensaje();
const adapEntrada = new AdapEntrada_PeticionWeb(msj);

app.get('/api/hola', (req, res) => {
    res.json({ message: 'Hola desde el servidor con Docker' });
});

app.get('/6A/mensaje-bloqueante', (req, res) => {
    let c = Date.now();
    while (Date.now() - c < 10000) {}
    adapEntrada.leerMensaje(req, res);
});

app.get('/6A/mensaje-no-bloqueante', async (req, res) => {
    let c = Date.now();
    await new Promise((promise) => {
        setTimeout(promise, 10000);
        adapEntrada.leerMensaje(req, res);
    });
});

app.get('/6A/usuario', async (req, res) => {
    const usu = req.query.usu;
    const cont = req.query.cont;
    const dtoUsuario = new DtoUsuario(usu, cont, false, 'Machala', '0961863035');
    const cuUsuario = new CasoUso_UsuarioLectura(dtoUsuario);
    const adap = new AdapEntrada_UsuarioWeb(cuUsuario);
    adap.autentica(req, res);
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
