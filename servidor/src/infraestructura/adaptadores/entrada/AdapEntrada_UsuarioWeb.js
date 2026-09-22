import { PuertoEntradaUsuarioWeb } from "../../../aplicacion/puerto/entrada/PuertoEntradaUsuarioWeb.js";

export class AdapEntrada_UsuarioWeb extends PuertoEntradaUsuarioWeb{
    constructor(casoUso){
        super();
        this.casoUso = casoUso;
    }
    autentica(req,res){
        const resultado = this.casoUso.validarUsuario();
        res.json({
            message: resultado
        })
    }
}