export class Usuario {
    constructor(usuario, contrasena, ciudad, telefono) {
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.ciudad = ciudad;
        this.telefono = telefono;
    }

    validarUsuario(dto) {
        if (dto.getNombre() === this.usuario && dto.getContrasena() === this.contrasena) {
            return true;
        }
        return false;
    }
}
