import { AdapSalida_UsuarioWeb } from '../../../infraestructura/adaptadores/salida/AdapSalida_UsuarioWeb.js';
import { Usuario } from '../../../dominio/Usuario.js';

export class CasoUso_UsuarioLectura {
    constructor(dto) {
        this.dto = dto;
    }

    validarUsuario(req, res) {
        const usuario = new AdapSalida_UsuarioWeb();
        const resul = usuario.leerUsuario(); //simular lectura en bd
        const dominioUsuario = new Usuario(resul.usuario, resul.contrasena);
        const estado = dominioUsuario.validarUsuario(this.dto);
        this.dto.setValido(estado);
        return this.dto.getNombre() + ', ' + this.dto.getValido() + ', ' + this.dto.getCiudad() + ', ' + this.dto.getTelefono();
    }
}
