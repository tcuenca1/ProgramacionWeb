# ProgramacionWeb - Sistema Backend y Frontend con Arquitectura Hexagonal

Sistema web modular desarrollado con Node.js (Express), Sequelize (PostgreSQL), Mongoose (MongoDB), y Docker. Implementa arquitectura hexagonal, patrones de diseño avanzados, serialización binaria V8 y sistema de auditoría y trazabilidad dual (archivo `.log` y base de datos relacional).

---

## 🚀 Funcionalidades Principales

1. **Gestión de Usuarios (ORM PostgreSQL & ODM MongoDB):**
   - Operaciones CRUD (Listar, Crear, Actualizar) para usuarios.
   - Manejo de roles con herencia en PostgreSQL (`Administrador`, `Personal`, `Invitado`) y modelos dinámicos.
   - Autenticación y validación de usuarios mediante adaptadores de entrada y salida.

2. **Trazabilidad y Auditoría Dual (Logs + Base de Datos):**
   - **Registro en Archivo:** Cada petición HTTP y evento relevante genera un registro estructurado JSON guardado en `servidor/src/logs/auditoria.log`.
   - **Registro en Base de Datos:** Los eventos de auditoría y outbox se persisten simultáneamente en la tabla relacional **`auditoria_evento`**, permitiendo su visualización y monitoreo en tiempo real a través de **Adminer**.
   - Generación automática de `X-Request-ID` (`requestId`) y medición de tiempos de respuesta por cada petición.

3. **Pruebas de Concurrencia y Rendimiento:**
   - Endpoints de prueba bloqueantes y no bloqueantes (`/6A/mensaje-bloqueante`, `/6A/mensaje-no-bloqueante`).

4. **Serialización y Deserialización Binaria:**
   - Conversión de objetos de dominio utilizando serialización binaria nativa de V8 (`/6A/usuario-binario`).

---

## 🗄️ Bases de Datos y Almacenamiento

### 1. PostgreSQL (Relacional - ORM Sequelize)
- **Propósito:** Almacenar datos estructurados de usuarios, roles jerárquicos y registros de auditoría transaccionales.
- **Tablas Principales:**
  - `usuario`: Tabla base para todos los usuarios.
  - `administrador`, `personal`, `invitado`: Tablas con herencia (`INHERITS`) para atributos específicos por rol.
  - `acceso`: Registro de accesos de usuarios.
  - `evento_outbox`: Patrón Outbox para eventos publicados.
  - **`auditoria_evento`**: Tabla donde se almacenan en formato `JSONB` todos los eventos de auditoría, peticiones HTTP y trazabilidad del sistema (sincronizada automáticamente en el arranque para visualización en Adminer).

### 2. MongoDB (NoSQL - ODM Mongoose)
- **Propósito:** Proveer un almacenamiento flexible basado en documentos (ODM) para colecciones de usuarios y datos no relacionales.
- **Colecciones Principales:**
  - `usuarios` / esquemas adaptados para manejo documental de usuarios (`MgModeloUsuario`).

---

## 📡 Endpoints del Servidor (Puerto 3000)

- `GET /` - Bienvenida al servidor backend.
- `GET /api/hola` - Estado del servidor Docker.
- `GET /6A/usuario` - Autenticación / consulta de usuario (PostgreSQL).
- `GET /6A/orm/usuarios` - Listar usuarios (PostgreSQL ORM).
- `POST /6A/orm/usuarios` - Crear usuario (PostgreSQL ORM).
- `PUT /6A/orm/usuarios/:id` - Actualizar usuario (PostgreSQL ORM).
- `GET /6A/odm/usuarios` - Listar usuarios (MongoDB ODM).
- `POST /6A/odm/usuarios` - Crear usuario (MongoDB ODM).
- `PUT /6A/odm/usuarios/:id` - Actualizar usuario (MongoDB ODM).
- `GET /6A/usuario-binario` - Prueba de serialización binaria V8.
- `GET /6A/mensaje-bloqueante` - Prueba síncrona/bloqueante.
- `GET /6A/mensaje-no-bloqueante` - Prueba asíncrona/no bloqueante.

---

## 🐳 Ejecución con Docker Compose

Para levantar el entorno completo (Servidor, Cliente Vite, PostgreSQL, MongoDB, Adminer, Mongo Express):

```bash
docker compose up --build
```

- **Servidor Backend:** `http://localhost:3000`
- **Cliente Frontend:** `http://localhost:5173`
- **Adminer (PostgreSQL):** `http://localhost:8080`
- **Mongo Express (MongoDB):** `http://localhost:8081`
