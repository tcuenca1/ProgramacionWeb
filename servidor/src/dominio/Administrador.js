import { Usuario } from './Usuario.js';

export class Administrador extends Usuario {
    constructor(nombre, contrasena, tipo, nivelAcceso = null, departamento = null, ciudad = null, telefono = null) {
        if (arguments.length <= 3) {
            super(nombre, contrasena, null, null, tipo);
            this.nivelAcceso = null;
            this.departamento = null;
        } else {
            super(nombre, contrasena, ciudad, telefono, tipo);
            this.nivelAcceso = nivelAcceso;
            this.departamento = departamento;
        }
    }
}
