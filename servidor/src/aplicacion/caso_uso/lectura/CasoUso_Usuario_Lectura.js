import { Usuario } from '../../../dominio/Usuario.js';
import { AdapSalida_UsuarioWeb } from '../../../infraestructura/adaptadores/salida/AdapSalida_UsuarioWeb.js';

export class CasoUso_Usuario_Lectura {
    constructor(dto) {
        this.dto = dto;
    }
    validarUsuario() {
        const usuarioAdap = new AdapSalida_UsuarioWeb();
        const resul = usuarioAdap.LeerUsuario(); //leer de la BD
        const dominioUsuario = new Usuario(resul.usuario, resul.contrasena);
        return dominioUsuario.validarUsuario(this.dto);
    }
}