export class DtoRespuestaUsuarioV2 {
  constructor(dto) {
    this.autenticado = dto.getValido();
    this.usuario = this.autenticado
      ? Object.freeze({ nombre: dto.getNombre() })
      : null;
    Object.freeze(this);
  }
}
