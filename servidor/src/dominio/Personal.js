import { Usuario } from './Usuario.js';

export class Personal extends Usuario {
    constructor(usuario, contrasena, ciudad, telefono, turno, codigoEmpleado) {
        super(usuario, contrasena, ciudad, telefono);
        this.turno = turno;
        this.codigoEmpleado = codigoEmpleado;
    }

    validarUsuario(dto) {
        const baseValid = super.validarUsuario(dto);
        return baseValid;
    }
}
