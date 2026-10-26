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

    static tipos = {};

    static registrarTipo(claves, crear) {
        for (const clave of claves) {
            Usuario.tipos[clave] = crear;
        }
    }

    static crearUsuarioDominio(datos) {
        const crear = Usuario.tipos[datos.tipo];
        const obj = crear
            ? crear(datos)
            : new Usuario(datos.nombre, datos.contrasena, datos.ciudad, datos.telefono, datos.tipo);
        if (datos.id !== undefined && datos.id !== null) {
            obj.id = String(datos.id);
        }
        return obj;
    }
}
