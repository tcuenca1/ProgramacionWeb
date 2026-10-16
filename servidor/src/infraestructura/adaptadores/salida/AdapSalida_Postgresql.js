import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import { conexionPostgres } from "../../base_dato/ConexionPostgresql.js";

export class AdapSalida_Postgresql extends PuertoSalidaUsuarioWeb {
    async leerUsuario(dto) {
        const sql = "SELECT * FROM usuario WHERE nombre = '" + dto.getNombre() + "' AND contrasena = '" + dto.getContrasena() + "'";
        const resultado = await conexionPostgres.query(
            sql
        )
        const fila = resultado.rows[0];

        console.log("Query ejecutada:", sql);
        console.log("Valores:", [dto.getNombre(), dto.getContrasena()]);
        console.log("Resultado filas:", resultado.rows);
        
        if (!fila) {
            return {
                usuario: "",
                contrasena: "",
                tipo: ""
            };
        } else {
            return {
                usuario: fila.nombre,
                contrasena: fila.contrasena,
                tipo: fila.tipo || ""
            };
        }
    }
}
