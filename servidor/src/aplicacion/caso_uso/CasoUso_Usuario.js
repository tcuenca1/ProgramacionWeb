import { Mensaje } from '../../dominio/Mensaje.js';
import { AdapSalida_UsuarioWeb } from '../../infraestructura/adaptadores/salida/AdapSalida_UsuarioWeb.js';

export class CasoUso_Usuario {
    constructor(nombre,contrasena){
        super();
        this.nombre = nombre;
        this.contraseña=contrasena;
    }

    leerMensaje(){
        return this.mensaje.holaMundo();    
    }
    validarUsuario(){
        const usuario= new AdapSalida_UsuarioWeb();
        const resul= usuario.LeerUsuario();
        const dominioUsuario= new Usuario(resul.usuario,resul.contrasena);
        dominioUsuario.validarUsuario(this.nombre,this.contraseña);
        return dominioUsuario.validarUsuario(this.nombre,this.contraseña);
        
    }
}