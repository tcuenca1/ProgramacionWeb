import { Usuario } from './Usuario.js';

export class Personal extends Usuario {
    constructor(nombre, contrasena, tipo, turno = null, codigoEmpleado = null, ciudad = null, telefono = null) {
        if (arguments.length <= 3) {
            super(nombre, contrasena, null, null, tipo);
            this.turno = null;
            this.codigoEmpleado = null;
        } else {
            super(nombre, contrasena, ciudad, telefono, tipo);
            this.turno = turno;
            this.codigoEmpleado = codigoEmpleado;
        }
    }
}

Usuario.registrarTipo(['Personal', '2'], (d) =>
    new Personal(d.nombre, d.contrasena, d.tipo, d.turno, d.codigoEmpleado, d.ciudad, d.telefono));
