import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js";

export class AdapSalida_UsuarioWeb extends PuertoSalidaUsuarioWeb {
    constructor() {
        super();
    }

    leerUsuario() {
        return {
            usuario: "juan",
            contrasena: "perez",
            ciudad: "Machala",
            telefono: "0961863035"
        };
    }
}
