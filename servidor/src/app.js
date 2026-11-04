import express from 'express';
import cors from 'cors';
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { DtoUsuario } from './aplicacion/dto/DtoUsuario.js';
import { AdapSalida_SerializacionBinaria } from './infraestructura/adaptadores/salida/AdapSalida_SerializacionBinaria.js';
import { contenedorUsuario, contenedorUsuarioOdm } from './contenedor/ContenedorUsuario.js';
import { ormPostgres } from './infraestructura/base_dato/OrmPostgresql.js';
import { odmMongo } from './infraestructura/base_dato/OdmMongo.js';
import { registrarLogAuditoria } from './infraestructura/util/logger.js';
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";

const app = express();
app.use(cors());
app.use(express.json());

// 1. Localizar el archivo OpenAPI
const rutaContrato = new URL(
    "./infraestructura/doc/openapi.yaml",
    import.meta.url
);
// 2. Leer y convertir YAML a un objeto JavaScript
const contrato = YAML.parse(
    readFileSync(rutaContrato, "utf8")
);
// 3. Publicar el contrato en formato JSON
app.get("/openapi.json", (req, res) => {
    res.json(contrato);
});
// 4. Configurar Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
        swaggerOptions: {
            url: "/openapi.json"
        }
    })
);

app.use((req, res, next) => {
    req.requestId = randomUUID();
    const inicio = performance.now();
    res.setHeader("X-Request-ID", req.requestId);

    registrarLogAuditoria({
        evento: "PETICION_RECIBIDA",
        requestId: req.requestId,
        metodo: req.method,
        ruta: req.path,
        tiempo: inicio
    });

    res.on("finish", () => {
        registrarLogAuditoria({
            evento: "PETICION_FINALIZADA",
            requestId: req.requestId,
            metodo: req.method,
            ruta: req.path,
            estado: res.statusCode,
            tiempoRespuesta: Math.round(performance.now() - inicio)
        });
    });

    next();
});

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

app.get('/6A/orm/usuarios', async (req, res) => {
    await contenedorUsuario.adap.listar(req, res);
});

app.post('/6A/orm/usuarios', async (req, res) => {
    await contenedorUsuario.adap.crear(req, res);
});

app.put('/6A/orm/usuarios/:id', async (req, res) => {
    await contenedorUsuario.adap.actualizar(req, res);
});

app.get('/6A/odm/usuarios', async (req, res) => {
    await contenedorUsuarioOdm.adap.listar(req, res);
});

app.post('/6A/odm/usuarios', async (req, res) => {
    await contenedorUsuarioOdm.adap.crear(req, res);
});

app.put('/6A/odm/usuarios/:id', async (req, res) => {
    await contenedorUsuarioOdm.adap.actualizar(req, res);
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

try {
    await ormPostgres.authenticate();
    console.log('Conexión ORM (Sequelize) a PostgreSQL establecida');
    await ormPostgres.sync();
    console.log('Modelos sincronizados con PostgreSQL (tabla auditoria_evento lista)');
} catch (error) {
    console.error('No se pudo conectar a PostgreSQL con el ORM:', error.message);
}

try {
    await odmMongo.asPromise();
    console.log('Conexión ODM (Mongoose) a MongoDB establecida');
} catch (error) {
    console.error('No se pudo conectar a MongoDB con el ODM:', error.message);
}

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
