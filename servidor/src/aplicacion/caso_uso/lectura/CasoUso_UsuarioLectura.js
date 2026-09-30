import { Usuario } from '../../../dominio/Usuario.js';

export class CasoUso_UsuarioLectura {
    constructor(adaptadorSalida) {
        this.adaptadorSalida = adaptadorSalida;
    }

    validarUsuario(dto) {
        const resul = this.adaptadorSalida.leerUsuario(); //simular lectura en bd
        const dominioUsuario = new Usuario(resul.usuario, resul.contrasena);
        const estado = dominioUsuario.validarUsuario(dto);
        dto.setValido(estado);
        dto.setCiudad(resul.ciudad);
        dto.setTelefono(resul.telefono);
        return dto.getNombre() + ', ' + dto.getValido() + ', ' + dto.getCiudad() + ', ' + dto.getTelefono();
    }
}
