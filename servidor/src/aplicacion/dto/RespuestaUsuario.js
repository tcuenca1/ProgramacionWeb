export function usuarioARespuesta(usuario) {
    const { contrasena, ...datos } = usuario;
    return datos;
}
