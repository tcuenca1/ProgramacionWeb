import { PuertoEntradaUsuarioWeb } from "../../../aplicacion/puerto/entrada/PuertoEntradaUsuarioWeb.js";
import { DtoUsuario } from "../../../aplicacion/dto/DtoUsuario.js";

export class AdapEntrada_UsuarioWeb extends PuertoEntradaUsuarioWeb {
    constructor(casoUso) {
        super();
        this.casoUso = casoUso;
    }

    async autentica(req, res) {
        const dtoUsuario = new DtoUsuario(req.query.usu, req.query.cont, false, req.query.ciudad, req.query.tel);
        const resultado = await this.casoUso.validarUsuario(dtoUsuario);
        res.json({
            message: resultado
        });
    }
}
