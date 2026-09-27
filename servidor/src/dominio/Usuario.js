export class Usuario {
    constructor(usuario, contrasena) {
        this.usuario = usuario;
        this.contrasena = contrasena;
    }

    validarUsuario(dto) {
        if (dto.getNombre() === this.usuario && dto.getContrasena() === this.contrasena) {
            return true;
        }
        return false;
    }
}
