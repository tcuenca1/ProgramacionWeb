import { Usuario } from './Usuario.js';

export class Invitado extends Usuario {
    constructor(usuario, contrasena, ciudad, telefono, motivoVisita, fechaExpiracion) {
        super(usuario, contrasena, ciudad, telefono);
        this.motivoVisita = motivoVisita;
        this.fechaExpiracion = fechaExpiracion;
    }

    validarUsuario(dto) {
        const baseValid = super.validarUsuario(dto);
        return baseValid;
    }
}
