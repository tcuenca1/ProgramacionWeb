import { PuertoEntradaUsuarioWeb } from "../../../aplicacion/puerto/entrada/PuertoEntradaUsuarioWeb.js";

export class AdapEntrada_UsuarioWeb extends PuertoEntradaUsuarioWeb{
    constructor(casoUso){
        super();
        this.casoUso = casoUso;
    }
    autentica(req,res){
        res.json({
            mensaje: this.casoUso.leerUsuario()
        })
    }
}