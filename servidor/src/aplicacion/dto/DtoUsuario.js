export class DtoUsuario {
    constructor(nombre, contrasena, valido, ciudad, telefono, tipo, nivelAcceso = null, departamento = null, turno = null, codigoEmpleado = null, motivoVisita = null, fechaExpiracion = null) {
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.valido = valido;
        this.ciudad = ciudad;
        this.telefono = telefono;
        this.tipo = tipo;
        this.nivelAcceso = nivelAcceso;
        this.departamento = departamento;
        this.turno = turno;
        this.codigoEmpleado = codigoEmpleado;
        this.motivoVisita = motivoVisita;
        this.fechaExpiracion = fechaExpiracion;
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

    getTipo() {
        return this.tipo;
    }

    setTipo(tipo) {
        this.tipo = tipo;
    }

    getNivelAcceso() {
        return this.nivelAcceso;
    }

    setNivelAcceso(nivelAcceso) {
        this.nivelAcceso = nivelAcceso;
    }

    getDepartamento() {
        return this.departamento;
    }

    setDepartamento(departamento) {
        this.departamento = departamento;
    }

    getTurno() {
        return this.turno;
    }

    setTurno(turno) {
        this.turno = turno;
    }

    getCodigoEmpleado() {
        return this.codigoEmpleado;
    }

    setCodigoEmpleado(codigoEmpleado) {
        this.codigoEmpleado = codigoEmpleado;
    }

    getMotivoVisita() {
        return this.motivoVisita;
    }

    setMotivoVisita(motivoVisita) {
        this.motivoVisita = motivoVisita;
    }

    getFechaExpiracion() {
        return this.fechaExpiracion;
    }

    setFechaExpiracion(fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }
}
