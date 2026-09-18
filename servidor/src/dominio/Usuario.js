export class Usuario{
    constructor(Usuario,contrasena){
        this.Usuario= Usuario;
        this.contrasena= contrasena;
    }
    ValidarUsuario(usu,contra){
        if(usu===this.usuario && contra ==this.contrasena)
        {
            return true;
        }
        else{
            

        }
    }
}