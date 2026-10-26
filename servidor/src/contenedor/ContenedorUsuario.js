import { AdapSalida_MongoDb } from "../infraestructura/adaptadores/salida/AdapSalida_MongoDb.js";
import { AdapSalida_Postgresql } from "../infraestructura/adaptadores/salida/AdapSalida_Postgresql.js";
import { AdapSalida_PosgresqlOrm } from "../infraestructura/adaptadores/salida/AdapSalida_PostresqlOrm.js";
import { AdapSalida_MongoDbOdm } from "../infraestructura/adaptadores/salida/AdapSalida_MongoDbOdm.js";
import { CasoUso_UsuarioLectura } from "../aplicacion/caso_uso/lectura/CasoUso_UsuarioLectura.js";
import { CasoUso_UsuarioEscritura } from "../aplicacion/caso_uso/escritura/CasoUso_UsuarioEscritura.js";
import { AdapEntrada_UsuarioWeb } from "../infraestructura/adaptadores/entrada/AdapEntrada_UsuarioWeb.js";

export function crearContenedorUsuario() {
    const adapSalida = new AdapSalida_PosgresqlOrm();
    const cuUsuario = new CasoUso_UsuarioLectura(adapSalida);
    const cuUsuarioEscritura = new CasoUso_UsuarioEscritura(adapSalida);
    const adap = new AdapEntrada_UsuarioWeb(cuUsuario, cuUsuarioEscritura);

    return {
        adapSalida,
        cuUsuario,
        cuUsuarioEscritura,
        adap
    };
}

export function crearContenedorUsuarioOdm() {
    const adapSalida = new AdapSalida_MongoDbOdm();
    const cuUsuario = new CasoUso_UsuarioLectura(adapSalida);
    const cuUsuarioEscritura = new CasoUso_UsuarioEscritura(adapSalida);
    const adap = new AdapEntrada_UsuarioWeb(cuUsuario, cuUsuarioEscritura);

    return {
        adapSalida,
        cuUsuario,
        cuUsuarioEscritura,
        adap
    };
}

export const contenedorUsuario = crearContenedorUsuario();

export const contenedorUsuarioOdm = crearContenedorUsuarioOdm();
