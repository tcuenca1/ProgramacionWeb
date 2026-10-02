# DIRECTRICES DE IA PARA EL PROYECTO (SYSTEM CONTEXT)

## 🎯 Instrucciones de Comportamiento
- Genera código técnico, limpio y listo para producción sin explicaciones innecesarias ni preámbulos conversacionales.
- Respeta estrictamente los patrones ECMAScript (ES Modules con `import`/`export`) en JavaScript.
- Cuando crees o modifiques clases, asegúrate de mantener la consistencia con las clases existentes en el repositorio.

## 📁 Estructura del Proyecto y Capas
El proyecto sigue una **Arquitectura Hexagonal (Puertos y Adaptadores)** dividida en los siguientes directorios bajo `servidor/src/`:
- `dominio/`: Contiene exclusivamente las entidades de negocio y reglas de negocio puras. Sin dependencias externas, frameworks ni peticiones HTTP.
- `aplicacion/`:
  - `caso_uso/`: Orquestadores de la lógica de aplicación. Divididos en subcarpetas `lectura/` y `escritura/` cuando aplique.
  - `dto/`: Objetos de transferencia de datos (DTOs) con constructores y métodos `get`/`set`.
  - `puerto/`: Interfaces abstractas de entrada y salida (`entrada/`, `salida/`).
- `infraestructura/`:
  - `adaptadores/`: Implementaciones concretas para la web (`entrada/AdapEntrada_*.js`) y persistencia/servicios externos (`salida/AdapSalida_*.js`, incluyendo adaptadores de serialización binaria con V8).
- `contenedor/`:
  - Contiene los contenedores de inyección de dependencias (ej. `ContenedorUsuario.js`) que centralizan la instanciación y cableado de adaptadores y casos de uso.
- `app.js`: Archivo principal de Express que inicializa el servidor, rutas y consume los contenedores de dependencias.

## 🏛️ Reglas Arquitectónicas y Flujo de Datos
- **Dirección de Dependencias:** Las capas internas (`dominio`, `aplicacion`) NUNCA deben importar ni conocer a las capas externas (`infraestructura`, `contenedor`). Infraestructura e infraestructura de contenedor importan a aplicación y dominio; aplicación importa a dominio.
- **Flujo de una Petición:**
  1. `app.js` recibe la petición HTTP de Express.
  2. Invoca al contenedor de inyección de dependencias (`contenedorUsuario.adap.autentica(req, res)`).
  3. El Adaptador de Entrada invoca al Caso de Uso.
  4. El Caso de Uso invoca al Adaptador de Salida para obtener los datos.
  5. El Caso de Uso instancia la Entidad de Dominio y ejecuta la regla de negocio.
  6. El Adaptador de Entrada responde al cliente usando `res.json()`.

## 📝 Convenciones de Nomenclatura y Código
- **Archivos y Clases:** 
  - PascalCase para clases y archivos de clases (ej. `CasoUso_UsuarioLectura.js`, `AdapEntrada_UsuarioWeb.js`, `DtoUsuario.js`, `Usuario.js`, `ContenedorUsuario.js`).
  - Prefijos estrictos para adaptadores, casos de uso y contenedores: `CasoUso_`, `AdapEntrada_`, `AdapSalida_`, `PuertoEntrada_`, `PuertoSalida_`, `Dto`, `Contenedor`.
- **Métodos y Variables:** camelCase para métodos y variables (ej. `validarUsuario`, `leerMensaje`, `dtoUsuario`, `crearContenedorUsuario`).
- **Módulos:** Uso exclusivo de ES Modules (`export class ...` e `import { ... } from '...'`).

## 🚫 Antipatrones y Restricciones Estrictas
- PROHIBIDO importar frameworks web (Express, `req`, `res`) dentro de las capas de `dominio` o `aplicacion`.
- PROHIBIDO mezclar lógica de infraestructura (como objetos Express) dentro de adaptadores de salida.
- PROHIBIDO saltarse los puertos/interfaces al comunicar casos de uso con adaptadores externos.
- PROHIBIDO instanciar dependencias manualmente de forma dispersa en las rutas cuando debe utilizarse la carpeta `contenedor/`.
- PROHIBIDO utilizar CommonJS (`require` / `module.exports`); usa exclusivamente ES Modules.
