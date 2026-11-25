---
name: arquitectura-hexagonal
description: Reglas de arquitectura hexagonal de ProgramacionWeb (Node.js 24 ESM, Express, Sequelize/PostgreSQL, Mongoose/MongoDB, NGINX API Gateway y OpenAPI 3.0.3) con su nomenclatura oficial (PuertoEntrada/PuertoSalida, CasoUso_<Modulo>Lectura/Escritura, AdapEntrada_/AdapSalida_, contenedor/). Usar SIEMPRE antes de crear, mover, evolucionar (V1/V2) o auditar código en servidor/.
---

# Arquitectura hexagonal · ProgramacionWeb

`ProgramacionWeb` implementa arquitectura hexagonal (puertos y adaptadores) en JavaScript ESM (`"type": "module"`), separando el núcleo de negocio de los detalles de transporte HTTP, persistencia (PostgreSQL/Sequelize y MongoDB/Mongoose), serialización y API Gateway.

> Regla de oro: **las dependencias apuntan hacia adentro.**
> `infraestructura → aplicacion → dominio`. El dominio no importa nada externo. La aplicación solo importa dominio, DTOs y sus propios puertos. Solo `contenedor/` conoce simultáneamente adaptadores concretos y casos de uso.

---

## 1. Reglas obligatorias

1. **Nomenclatura oficial** (sección 3). Ningún archivo nuevo usa `Repositorio`, `Servicio`, `Controlador` ni `Router()` como pieza arquitectónica.
2. **Una clase por archivo, con el mismo nombre del archivo** (ej. `DtoRespuestaUsuarioV2.js` exporta `export class DtoRespuestaUsuarioV2`). Sin `export default`.
3. **Los puertos definen el contrato base** (`PuertoEntrada*` / `PuertoSalida*`) lanzando `new Error("Debes implementar …")` en cada método. Los adaptadores y casos de uso hacen `extends` y llaman a `super()`.
4. **Lectura y escritura separadas:** `CasoUso_UsuarioLectura` (consultas y validación) y `CasoUso_UsuarioEscritura` (creación y actualización).
5. **Inyección manual por constructor:** los casos de uso reciben `PuertoSalida*`; los adaptadores de entrada reciben casos de uso / puertos de entrada. Toda composición de adaptadores concretos ocurre exclusivamente en `contenedor/`.
6. **Evolución y versionamiento sin duplicar negocio:** nuevas versiones de interfaz HTTP (ej. `POST /6A/v2/usuario`) crean su propio DTO de salida inmutable (`DtoRespuestaUsuarioV2` con `Object.freeze`) y método de entrada (`autenticaV2`), pero **reutilizan el mismo caso de uso** (`CasoUso_UsuarioLectura.validarUsuario(dto)`) y la misma persistencia transaccional.
7. **Obsolescencia y compatibilidad hacia atrás:** la interfaz heredada (`GET /6A/usuario`) conserva su contrato JSON original y recibe el middleware `obsolescenciaV1` (`Deprecation`, `Sunset`, `Cache-Control: no-store`) sin afectar a V2.
8. **El adaptador de entrada es el único que conoce `req`/`res`:** el dominio y los casos de uso nunca importan `express`, `sequelize` ni `mongoose`.
9. **`app.js` solo configura middlewares, OpenAPI/Swagger y rutas** delegando en `contenedorUsuario.adap.*` o `contenedorUsuarioOdm.adap.*`.

---

## 2. Árbol real del backend (`servidor/src/`)

```text
servidor/src/
├── app.js                                           # Express, Swagger UI (/api-docs, /openapi.json), trazabilidad X-Request-ID y rutas /6A/*
├── contenedor/
│   └── ContenedorUsuario.js                         # Raíz de composición: crearContenedorUsuario() (ORM) y crearContenedorUsuarioOdm() (ODM)
├── dominio/                                         # Entidades y reglas puras (sin imports externos)
│   ├── Usuario.js
│   ├── Administrador.js
│   ├── Personal.js
│   └── Invitado.js
├── aplicacion/
│   ├── dto/
│   │   ├── DtoUsuario.js                            # DTO de entrada/transporte interno
│   │   ├── RespuestaUsuario.js                      # Mapeo seguro a respuesta (usuarioARespuesta)
│   │   └── DtoRespuestaUsuarioV2.js                 # DTO inmutable (Object.freeze) exclusivo de la interfaz V2
│   ├── puerto/
│   │   ├── entrada/
│   │   │   ├── PuertoEntradaUsuarioWeb.js
│   │   │   └── PuertoEntradaMensaje.js
│   │   └── salida/
│   │       └── PuertoSalidaUsuarioWeb.js
│   └── caso_uso/
│       ├── lectura/
│       │   └── CasoUso_UsuarioLectura.js            # Reutilizado por V1 y V2 (validarUsuario, listarUsuarios)
│       └── escritura/
│           └── CasoUso_UsuarioEscritura.js          # crearUsuario, actualizarUsuario
└── infraestructura/
    ├── adaptadores/
    │   ├── entrada/
    │   │   ├── AdapEntrada_UsuarioWeb.js            # autentica (V1), autenticaV2 (V2), listar, crear, actualizar
    │   │   └── AdapEntrada_PeticionWeb.js
    │   └── salida/
    │       ├── AdapSalida_PostresqlOrm.js           # Sequelize + transacción READ_COMMITTED + LOCK.UPDATE + outbox
    │       ├── AdapSalida_Postgresql.js             # Cliente pg directo
    │       ├── AdapSalida_MongoDbOdm.js             # Mongoose ODM
    │       ├── AdapSalida_MongoDb.js                # Driver nativo MongoDB
    │       └── AdapSalida_SerializacionBinaria.js   # Serialización binaria V8
    ├── base_dato/
    │   ├── OrmPostgresql.js · ConexionPostgresql.js · data_postgre.sql
    │   ├── OdmMongo.js · ConexionMongo.js · data_mongo.js
    │   └── modelo/
    │       ├── PgModeloUsuario.js · PgModeloRoles.js · PgModeloAcceso.js
    │       ├── PgModeloOutBox.js · PgModeloAuditoriaEvento.js · PgModeloUsuarioAcceso.js
    │       └── MgModeloUsuario.js
    ├── doc/
    │   ├── openapi.yaml                             # Contrato activo OpenAPI 3.0.3 (V1 deprecated + V2)
    │   └── openapi.v1.bak.yaml                      # Respaldo del contrato V1 anterior
    ├── middleware/
    │   └── Obsolescencia.js                         # obsolescenciaV1 (RFC 9745 Deprecation + RFC 8594 Sunset)
    └── util/
        └── logger.js                                # Auditoría dual (archivo .log + tabla auditoria_evento)
```

En la raíz del proyecto:
- `gateway/nginx.conf` → API Gateway en puerto `8082` con resolución DNS dinámica (`127.0.0.11`) hacia `servidor:3000` y `servicio-estado:3000`.
- `docker-compose.yml` → Orquestación de `servidor`, `cliente`, `postgres`, `adminer`, `mongo`, `mongo-express`, `gateway` y `servicio-estado`.
- `prueba-v1.mjs` y `prueba-v2.mjs` → Pruebas automatizadas de regresión de contrato contra `http://localhost:8082`.

---

## 3. Nomenclatura oficial

| Pieza | Carpeta | Patrón de nombre | Ejemplo |
| --- | --- | --- | --- |
| Entidad de dominio | `dominio/` | Sustantivo singular | `Usuario`, `Administrador` |
| DTO | `aplicacion/dto/` | `Dto<Nombre>.js` | `DtoUsuario`, `DtoRespuestaUsuarioV2` |
| Puerto de entrada | `aplicacion/puerto/entrada/` | `PuertoEntrada<Modulo>Web` | `PuertoEntradaUsuarioWeb` |
| Puerto de salida | `aplicacion/puerto/salida/` | `PuertoSalida<Modulo>Web` | `PuertoSalidaUsuarioWeb` |
| Caso de uso | `aplicacion/caso_uso/lectura\|escritura/` | `CasoUso_<Modulo>Lectura\|Escritura` | `CasoUso_UsuarioLectura` |
| Adaptador de entrada | `infraestructura/adaptadores/entrada/` | `AdapEntrada_<Modulo>Web` | `AdapEntrada_UsuarioWeb` |
| Adaptador de salida | `infraestructura/adaptadores/salida/` | `AdapSalida_<Tecnologia>` | `AdapSalida_PostresqlOrm` |
| Modelo persistencia | `infraestructura/base_dato/modelo/` | `PgModelo*` / `MgModelo*` | `PgModeloAcceso`, `PgModeloOutBox` |
| Middleware HTTP | `infraestructura/middleware/` | Sustantivo en español | `Obsolescencia.js` |
| Contenedor | `contenedor/` | `Contenedor<Modulo>.js` | `ContenedorUsuario.js` |

- Identificadores en español sin tildes ni ñ (`contrasena`, `autenticaV2`, `esvalido`). Mensajes de respuesta sí pueden llevar tildes.

---

## 4. Receta: agregar o evolucionar una funcionalidad

De adentro hacia afuera, un paso por capa:

1. **Dominio:** agregar o ajustar la entidad/regla en `servidor/src/dominio/` sin importar librerías externas.
2. **DTO:** definir/ajustar el DTO en `servidor/src/aplicacion/dto/` (usar `Object.freeze` para respuestas inmutables de versiones nuevas como V2).
3. **Puertos:** declarar el método en `PuertoSalidaUsuarioWeb` y/o `PuertoEntradaUsuarioWeb`.
4. **Caso de uso:** implementar o reutilizar en `CasoUso_UsuarioLectura` o `CasoUso_UsuarioEscritura` sin duplicar lógica entre versiones.
5. **Adaptador de salida:** implementar la persistencia/transacción en `AdapSalida_PostresqlOrm` (y/o `AdapSalida_MongoDbOdm`) y actualizar modelos si aplica.
6. **Adaptador de entrada y ruta:** agregar método en `AdapEntrada_UsuarioWeb`, cablear middleware (si aplica) y ruta en `app.js`.
7. **Gateway y contrato:** verificar enrutamiento en `gateway/nginx.conf` y actualizar `servidor/src/infraestructura/doc/openapi.yaml`.
8. **Verificación:** ejecutar `node prueba-v1.mjs` y `node prueba-v2.mjs` contra el Gateway (`http://localhost:8082`) y comprobar `acceso` y `evento_outbox` en PostgreSQL.

---

## 5. Auditoría rápida (desde la raíz del proyecto)

```bash
# 1. El dominio no importa nada de aplicacion, infraestructura, contenedor ni librerías externas
grep -rnE "from ['\"](\.\./)+(aplicacion|infraestructura|contenedor)|from ['\"](express|sequelize|pg|mongoose|mongodb)" servidor/src/dominio

# 2. La aplicación no importa infraestructura, contenedor ni librerías externas
grep -rnE "from ['\"](\.\./)+(infraestructura|contenedor)|from ['\"](express|sequelize|pg|mongoose|mongodb)" servidor/src/aplicacion

# 3. La infraestructura no importa casos de uso directamente (solo puertos y DTOs)
grep -rn "caso_uso/" servidor/src/infraestructura

# 4. Verificación de sintaxis y pruebas de contrato contra API Gateway (:8082)
node --check servidor/src/app.js
node prueba-v1.mjs
node prueba-v2.mjs
```

---

## 6. Al terminar un cambio, informar

- Capas tocadas y archivos creados/modificados.
- Flujo completo: `Gateway (:8082) → ruta app.js → AdapEntrada_… → CasoUso_… → PuertoSalida… → AdapSalida_…`.
- Resultado de la auditoría de dependencias y de las pruebas de regresión (`prueba-v1.mjs`, `prueba-v2.mjs`).
