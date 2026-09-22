export class Usuario{
    constructor(usuario,contrasena){
        this.usuario= usuario;
        this.contrasena= contrasena;
    }
    validarUsuario(usu,contra){
        if(usu===this.usuario && contra ===this.contrasena)
        {
            return true;
        }
        else{
            return false;
        }
    }
}