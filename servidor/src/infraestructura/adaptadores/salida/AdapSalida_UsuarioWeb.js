import { PuertoEntradaUsuarioWeb } from "../../../aplicacion/puerto/entrada/PuertoEntradaUsuarioWeb.js";

export class AdapEntrada_UsuarioWeb extends PuertoEntradaMensaje{
    constructor(casoUso){
        super();
        this.casoUso = casoUso;
    }
    leerMensaje(req,res){
        res.json({
            mensaje: this.casoUso.leerMensaje()
        })
    }
}