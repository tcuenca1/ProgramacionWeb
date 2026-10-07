import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js"
import { conexionPostgres } from "../../base_dato/ConexionPostgresql.js";

export class AdapSalida_Posgresql extends PuertoSalidaUsuarioWeb {
    async leerUsuario(dto) {
        const sql = "SELECT * FROM usuario WHERE nombre = '" + dto.nombre + "' AND contrasena = '" + dto.constrasena + "'"
        const resultado = await conexionPostgres.query(sql);
        const fila = resultado.rows[0];
        console.log(resultado.rows);
        if (fila < 0) {
            return {
                usuario: "",
                contrasena: ""
            }
        } else{
            return {
                usuario: fila.nombre,
                contrasena: fila.contrasena
            }
        }

        /*console.log(resultado.rows);
        const fila = resultado.rows[0];
        if(fila>0)
            return {
                usuario: fila.nombre,
                contrasena: fila.contrasena
            };
        else
            return {
                // ... (código cortado)
            }
        }*/
    }
}
