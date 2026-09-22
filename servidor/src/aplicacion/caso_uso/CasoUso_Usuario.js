import { Usuario } from '../../dominio/Usuario.js';
import { AdapSalida_UsuarioWeb } from '../../infraestructura/adaptadores/salida/AdapSalida_UsuarioWeb.js';

export class CasoUso_Usuario {
    constructor(nombre,contrasena){
        this.nombre = nombre;
        this.contrasena=contrasena;
    }
    validarUsuario(){
        const usuarioAdap= new AdapSalida_UsuarioWeb();
        const resul= usuarioAdap.LeerUsuario();
        const dominioUsuario= new Usuario(resul.usuario,resul.contrasena);
        return dominioUsuario.validarUsuario(this.nombre,this.contrasena);
    }
}