export class DtoUsuario {
    constructor(nombre, contrasena, valido, ciudad, telefono) {
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.valido = valido;
        this.ciudad = ciudad;
        this.telefono = telefono;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    getContrasena() {
        return this.contrasena;
    }

    setContrasena(contrasena) {
        this.contrasena = contrasena;
    }
    
    getValido() {
        return this.valido;
    }

    setValido(estado) {
        this.valido = estado;
    }

    getCiudad() {
        return this.ciudad;
    }

    setCiudad(ciudad) {
        this.ciudad = ciudad;
    }

    getTelefono() {
        return this.telefono;
    }

    setTelefono(telefono) {
        this.telefono = telefono;
    }
}
