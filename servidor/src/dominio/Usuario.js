export class Usuario{
    constructor(usuario,contrasena){
        this.usuario= usuario;
        this.contrasena= contrasena;
    }
    validarUsuario(dto){
        if(usu===dto.getNombre() && contra ===dto.getContrasena())
        {
            return true;
        }
        else{
            return false;
        }
    }
}