import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js";

export class AdapSalida_UsuarioWeb extends PuertoSalidaUsuarioWeb{
    constructor(casoUso){
        super();
        this.casoUso = casoUso;
    }
    LeerUsuario(){
        return{
            usuario: "juan",
            contrasena: "perez" 
        }
    }
    leerMensaje(req,res){
        res.json({
            mensaje: this.casoUso.leerMensaje()
        })
    }

}