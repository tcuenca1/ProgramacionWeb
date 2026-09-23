export class DtoUsuario {
    constructor(nombre, contrasena){
        this.nombre = nombre
        this.contrasena = contrasena
    }

    getNombre(){
        return this.nombre
    }

    setNombre(nombre){
        this.nombre = nombre
    }

    getContrasena(){
        return this.contrasena
    }

    setContrasena(contrasena){
        this.contrasena = contrasena
    }
}
