import { Usuario } from './Usuario.js';

export class Administrador extends Usuario {
    constructor(usuario, contrasena, ciudad, telefono, nivelAcceso, departamento) {
        super(usuario, contrasena, ciudad, telefono);
        this.nivelAcceso = nivelAcceso;
        this.departamento = departamento;
    }

    validarUsuario(dto) {
        const baseValid = super.validarUsuario(dto);
        return baseValid;
    }
}
