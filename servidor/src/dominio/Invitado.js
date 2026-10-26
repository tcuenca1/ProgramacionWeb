import { Usuario } from './Usuario.js';

export class Invitado extends Usuario {
    constructor(nombre, contrasena, tipo, motivoVisita = null, fechaExpiracion = null, ciudad = null, telefono = null) {
        if (arguments.length <= 3) {
            super(nombre, contrasena, null, null, tipo);
            this.motivoVisita = null;
            this.fechaExpiracion = null;
        } else {
            super(nombre, contrasena, ciudad, telefono, tipo);
            this.motivoVisita = motivoVisita;
            this.fechaExpiracion = fechaExpiracion;
        }
    }
}

Usuario.registrarTipo(['Invitado', '3'], (d) =>
    new Invitado(d.nombre, d.contrasena, d.tipo, d.motivoVisita, d.fechaExpiracion, d.ciudad, d.telefono));
