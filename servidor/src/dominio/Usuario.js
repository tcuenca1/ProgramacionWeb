export class Usuario {
    constructor(nombre, contrasena, ciudad, telefono, tipo) {
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.ciudad = ciudad;
        this.telefono = telefono;
        this.tipo = tipo;
    }

    validarUsuario(dto) {
        if (dto.getNombre() === this.nombre && dto.getContrasena() === this.contrasena) {
            return true;
        }
        return false;
    }
}
