# Documentación Técnica y Flujos de Datos

## 🏛️ 1. Visión Global del Sistema
El proyecto implementa un servidor backend modular en Node.js (ES Modules) estructurado bajo los principios de la **Arquitectura Hexagonal (Puertos y Adaptadores)**. Su propósito es separar estrictamente las reglas de negocio (dominio) y los casos de uso de la aplicación de los detalles tecnológicos externos (framework Express, protocolos HTTP y mecanismos de serialización como buffers binarios con V8). La aplicación gestiona peticiones web síncronas/asíncronas, simulación de bloqueo de hilos, validación de credenciales mediante DTOs y serialización binaria de datos.

## 🗃️ 2. Modelos de Datos y Clases Principales
El sistema organiza sus responsabilidades en las siguientes capas y entidades clave:

- **Capa de Dominio (`servidor/src/dominio/`):**
  - `Usuario`: Contiene la lógica de negocio pura para validar las credenciales de un usuario comparando los datos de un DTO con sus atributos internos (`usuario`, `contrasena`).
  - `Mensaje` / `MensajeBuenosDias`: Entidades secundarias que encapsulan la generación de textos de saludo básicos.

- **Capa de Aplicación (`servidor/src/aplicacion/`):**
  - **DTOs (`DtoUsuario`):** Objeto de transferencia de datos que encapsula los atributos del usuario (`nombre`, `contrasena`, `valido`, `ciudad`, `telefono`) y provee métodos de acceso (`get`/`set`).
  - **Casos de Uso:**
    - `CasoUso_UsuarioLectura`: Orquesta la lectura de datos simulados desde la persistencia y ejecuta la validación de negocio a través del dominio, actualizando el estado de validez en el DTO.
    - `CasoUso_UsuarioEscritura`: Estructura base para futuras operaciones de mutación (creación, actualización, eliminación).
    - `CasoUso_Mensaje`: Orquesta la obtención de mensajes desde el dominio.
  - **Puertos de Entrada y Salida (`puerto/`):** Interfaces abstractas que definen los contratos que los adaptadores deben cumplir (ej. `PuertoEntradaUsuarioWeb`, `PuertoSalidaUsuarioWeb`).

- **Capa de Infraestructura (`servidor/src/infraestructura/`):**
  - **Adaptadores de Entrada:**
    - `AdapEntrada_PeticionWeb`: Maneja peticiones web generales y responde con JSON.
    - `AdapEntrada_UsuarioWeb`: Recibe la ejecución del caso de uso de autenticación y emite la respuesta HTTP en formato JSON.
  - **Adaptadores de Salida:**
    - `AdapSalida_UsuarioWeb`: Simula una consulta a base de datos retornando credenciales predefinidas.
    - `AdapSalida_SerializacionBinaria`: Utiliza el módulo nativo `v8` (`v8.serialize()` / `v8.deserialize()`) para transformar estructuras de datos complejas en un `Buffer` binario y reconstruirlas.

## 🔄 3. Flujos de Ejecución Core (Paso a Paso)

### Flujo 1: Petición de Validación de Usuario (`GET /6A/usuario`)
1. **Recepción HTTP:** El servidor Express en `app.js` intercepta la petición GET extrayendo los parámetros `usu` y `cont` del query string.
2. **Construcción del DTO:** Se instancia `DtoUsuario` con las credenciales recibidas y valores por defecto para ciudad y teléfono.
3. **Inyección en el Caso de Uso:** Se instancia `CasoUso_UsuarioLectura` pasando el DTO como dependencia.
4. **Consulta de Persistencia:** El caso de uso invoca a `AdapSalida_UsuarioWeb.leerUsuario()` para obtener las credenciales registradas ("base de datos" simulada).
5. **Regla de Negocio (Dominio):** Se instancia la entidad `Usuario` y se ejecuta `dominioUsuario.validarUsuario(dto)`, el cual evalúa si las credenciales coinciden.
6. **Mutación de Estado:** El resultado booleano de la validación se asigna al DTO mediante `dto.setValido(estado)`.
7. **Respuesta Web:** `AdapEntrada_UsuarioWeb` formatea el resultado en formato JSON y lo envía al cliente.

### Flujo 2: Serialización y Deserialización Binaria (`GET /6A/usuario-binario`)
1. **Recepción HTTP:** Express intercepta la petición y construye el `DtoUsuario`.
2. **Adaptador Binario:** Se instancia el adaptador `AdapSalida_SerializacionBinaria`.
3. **Serialización V8:** El adaptador toma los datos del DTO y ejecuta `v8.serialize()`, generando un `Buffer` binario en memoria.
4. **Deserialización V8:** Inmediatamente se ejecuta `v8.deserialize()` sobre el `Buffer` generado para reconstruir el objeto original en JavaScript.
5. **Respuesta Web:** Se retorna un JSON indicando éxito, junto con la representación hexadecimal del buffer, su tamaño exacto en bytes y el objeto deserializado.

## ⚙️ 4. Diccionario de Funciones Críticas
- `DtoUsuario.toBinary()` / `fromBinary()`: Encapsulan la conversión bidireccional entre objetos DTO y buffers binarios mediante el motor V8.
- `Usuario.validarUsuario(dto)`: Función central de negocio que evalúa la igualdad entre credenciales entrantes y almacenadas.
- `AdapSalida_SerializacionBinaria.serializarYDeserializar(dto)`: Función de infraestructura que empaqueta y desempaqueta estructuras complejas a nivel de bytes utilizando flujos de buffers de Node.js.
- `CasoUso_UsuarioLectura.validarUsuario()`: Orquestador principal de la lectura, consulta y validación de usuarios.

## ⚠️ 5. Zonas Grises y Advertencias Técnicas
- **Simulación de Base de Datos:** Los adaptadores de salida (`AdapSalida_UsuarioWeb`) retornan datos estáticos hardcodeados ("juan" / "perez"), por lo que no existe una conexión real a un motor de base de datos persistente.
- **Acoplamiento en Rutas:** El archivo `app.js` realiza instanciaciones manuales directas de adaptadores, casos de uso y DTOs en cada endpoint; a medida que el proyecto crezca, se recomienda implementar un contenedor de inyección de dependencias centralizado.
- **Manejo de Errores asíncronos:** Algunos endpoints usan `async/await` pero carecen de bloques `try...catch` robustos para interceptar fallos en promesas o errores de serialización binaria en runtime.
