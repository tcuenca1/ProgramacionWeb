# ProgramacionWeb - Arquitectura Hexagonal, Versionamiento V1/V2 y API Gateway

Sistema web modular desarrollado con **Node.js 24 (ESM)**, **Express**, **Sequelize (PostgreSQL 17)**, **Mongoose (MongoDB 8)**, **React (Vite)**, **NGINX Alpine (API Gateway)** y **Docker Compose**.

Implementa arquitectura hexagonal (puertos y adaptadores), versionamiento de API con compatibilidad hacia atrás, políticas formales de obsolescencia (**RFC 9745** y **RFC 8594**), contrato **OpenAPI 3.0.3** con Swagger UI, persistencia transaccional con patrón Outbox, trazabilidad dual y pruebas automatizadas de regresión.

---

## Arquitectura Hexagonal (`servidor/src/`)

Las dependencias apuntan hacia adentro (`infraestructura → aplicacion → dominio`), y toda composición de adaptadores ocurre únicamente en `contenedor/`:

- `dominio/` — Entidades puras (`Usuario`, `Administrador`, `Personal`, `Invitado`).
- `aplicacion/` — Casos de uso separados en lectura/escritura (`CasoUso_UsuarioLectura`, `CasoUso_UsuarioEscritura`), puertos (`PuertoEntradaUsuarioWeb`, `PuertoSalidaUsuarioWeb`) y DTOs (`DtoUsuario`, `RespuestaUsuario`, `DtoRespuestaUsuarioV2` inmutable con `Object.freeze`).
- `infraestructura/` — Adaptadores HTTP (`AdapEntrada_UsuarioWeb`), adaptadores de persistencia (`AdapSalida_PostresqlOrm`, `AdapSalida_MongoDbOdm`, `AdapSalida_SerializacionBinaria`), modelos Sequelize/Mongoose, seed inicial (`seedPostgres.js`), middleware de obsolescencia (`Obsolescencia.js`), contrato OpenAPI (`doc/openapi.yaml` y respaldo `doc/openapi.v1.bak.yaml`) y auditoría dual (`util/logger.js`).
- `contenedor/` — Inyección manual de dependencias (`ContenedorUsuario.js`).
- `.claude/skills/arquitectura-hexagonal/SKILL.md` — Guía y reglas de auditoría de arquitectura hexagonal para el proyecto.

---

## API Gateway con NGINX (`http://localhost:8082`)

NGINX actúa como punto de entrada único con descubrimiento dinámico mediante el DNS interno de Docker (`127.0.0.11`, `gateway/nginx.conf`):

| Ruta en Gateway (`:8082`) | Método | Destino | Comportamiento |
| --- | --- | --- | --- |
| `/6A/usuario?usu=...&cont=...` | `GET` | `servidor:3000` | **V1 (obsoleta):** `200 OK` con `{mensaje, usuario, esvalido}` + cabeceras `Deprecation`, `Sunset` y `Cache-Control: no-store` |
| `/6A/v2/usuario` | `POST` | `servidor:3000` | **V2 (JSON):** `200` (válido), `403` (inválido), `400` (datos faltantes), `500` (error interno), sin cabeceras de obsolescencia |
| `/estado` | `GET` | `servicio-estado:3000` | `200 OK` con `{"servicio":"estado","disponible":true}` |
| `/api-docs/` y `/openapi.json` | `GET` | `servidor:3000` | Interfaz Swagger UI y contrato OpenAPI 3.0.3 |
| Cualquier otra ruta | `*` | NGINX Gateway | `404 Not Found` directo desde el Gateway |

### Otros endpoints del servidor (`:3000` / `/6A/*`)
- `GET /6A/orm/usuarios`, `POST /6A/orm/usuarios`, `PUT /6A/orm/usuarios/:id` — CRUD PostgreSQL (Sequelize).
- `GET /6A/odm/usuarios`, `POST /6A/odm/usuarios`, `PUT /6A/odm/usuarios/:id` — CRUD MongoDB (Mongoose).
- `GET /6A/usuario-binario` — Serialización y deserialización binaria V8.
- `GET /6A/mensaje-bloqueante` y `GET /6A/mensaje-no-bloqueante` — Pruebas de concurrencia.

---

## Persistencia, Transacciones y Seed Inicial

- **PostgreSQL 17 (ORM Sequelize):**
  - La autenticación en `AdapSalida_PostresqlOrm.leerUsuario()` se ejecuta dentro de una transacción `READ_COMMITTED` con bloqueo `LOCK.UPDATE`, registrando cada acceso válido en `acceso` y el evento `ACCESO_OK_AUTENTICADO_REGISTRADO` en `evento_outbox`.
  - **Seed inicial automática e idempotente (`seedPostgres.js`):** al arrancar el servidor tras `ormPostgres.sync()`, si el usuario de prueba `juan` no existe en PostgreSQL, se crea automáticamente con contraseña `perez1` (rol `Administrador`), permitiendo ejecutar las pruebas de contrato en entornos recién creados sin pasos manuales.
- **Trazabilidad dual:** cada petición HTTP genera `X-Request-ID`, escribe en `servidor/src/logs/auditoria.log` y registra el evento en la tabla `auditoria_evento`.
- **MongoDB 8 (ODM Mongoose):** almacenamiento documental alternativo de usuarios.

---

## Ejecución con Docker Compose

```bash
docker compose up -d --build
```

Servicios disponibles:
- **API Gateway (NGINX):** `http://localhost:8082`
- **Swagger UI (vía Gateway):** `http://localhost:8082/api-docs/`
- **Servidor Backend (directo):** `http://localhost:3000`
- **Cliente Frontend (Vite/React):** `http://localhost:5173`
- **Adminer (PostgreSQL):** `http://localhost:8080`
- **Mongo Express (MongoDB):** `http://localhost:8081`

---

## Pruebas de Regresión y Verificación

Con los contenedores activos, ejecutar desde la raíz del proyecto (requiere Node.js 24):

```bash
node prueba-v1.mjs
node prueba-v2.mjs
```

Salida esperada:
```text
Contrato V1: OK
Contrato V2: OK
```

Verificación del Gateway y DNS interno:
```bash
docker compose exec gateway nginx -t
docker compose exec gateway nslookup servidor
docker compose exec gateway nslookup servicio-estado
```
