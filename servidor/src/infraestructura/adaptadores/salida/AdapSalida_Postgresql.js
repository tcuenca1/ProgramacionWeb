import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import { conexionPostgres } from "../../base_dato/ConexionPostgresql.js";

export class AdapSalida_Postgresql extends PuertoSalidaUsuarioWeb {
    async leerUsuario(dto) {
        try {
            await conexionPostgres.query(`
                CREATE TABLE IF NOT EXISTS usuario (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    "contraseña" VARCHAR(100) NOT NULL
                );
            `);
            const check = await conexionPostgres.query("SELECT COUNT(*) FROM usuario");
            if (parseInt(check.rows[0].count) < 2) {
                await conexionPostgres.query("INSERT INTO usuario (nombre, "contraseña") VALUES ('juan', 'perez') ON CONFLICT DO NOTHING");
            }

            const sql = "SELECT * FROM usuario WHERE nombre = $1 AND "contraseña" = $2";
            const resultado = await conexionPostgres.query(sql, [dto.getNombre(), dto.getContrasena()]);
            const fila = resultado.rows[0];
            console.log("Query ejecutada:", sql);
            console.log("Valores:", [dto.getNombre(), dto.getContrasena()]);
            console.log("Resultado filas:", resultado.rows);
            if (!fila) {
                return {
                    usuario: "",
                    contrasena: ""
                };
            } else {
                return {
                    usuario: fila.nombre,
                    contrasena: fila["contraseña"]
                };
            }
        } catch (error) {
            console.error("Error al leer usuario de PostgreSQL:", error);
            return {
                usuario: "",
                contrasena: ""
            };
        }
    }
}
