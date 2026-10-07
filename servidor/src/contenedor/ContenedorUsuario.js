import { AdapSalida_Posgresql } from "../infraestructura/adaptadores/salida/AdapSalida_Postgresql.js";
import { CasoUso_UsuarioLectura } from "../aplicacion/caso_uso/lectura/CasoUso_UsuarioLectura.js";
import { AdapEntrada_UsuarioWeb } from "../infraestructura/adaptadores/entrada/AdapEntrada_UsuarioWeb.js";


export function crearContenedorUsuario() {
    const adapSalida = new AdapSalida_Posgresql();
    const cuUsuario = new CasoUso_UsuarioLectura(adapSalida);
    const adap = new AdapEntrada_UsuarioWeb(cuUsuario);

    return {
        adapSalida,
        cuUsuario,
        adap
    };
}

export const contenedorUsuario = crearContenedorUsuario();
