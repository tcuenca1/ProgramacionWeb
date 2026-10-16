import {PuertoSalidaUsuarioWeb} from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js";
import { conexionMongo } from "../../base_dato/ConexionMongo.js";

export class AdapSalida_MongoDb extends PuertoSalidaUsuarioWeb {
    async leerUsuario(dto){
        try {
            const resultado = await conexionMongo
                .collection("usuario")
                .findOne({
                    nombre:dto.getNombre(),
                    contrasena:dto.getContrasena()
                });
            if (!resultado) {
                return {
                    usuario:"",
                    contrasena:""
                };
            }
            return {
                usuario:resultado.nombre,
                contrasena:resultado.contrasena
            };
        } catch (error) {
            console.error("Error al leer usuario de MongoDB:", error);
            return {
                usuario:"",
                contrasena:""
            };
        }
    }
}
