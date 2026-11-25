import { Administrador } from "../../../dominio/Administrador.js";
import { Personal } from "../../../dominio/Personal.js";
import { Invitado } from "../../../dominio/Invitado.js";
import { usuarioARespuesta } from "../../dto/RespuestaUsuario.js";

export class CasoUso_UsuarioLectura {
  constructor(adaptadorSalida) {
    this.adaptadorSalida = adaptadorSalida;
  }

  async validarUsuario(dto) {
    const resultado = await this.adaptadorSalida.leerUsuario(dto);

    if (resultado && typeof resultado.validarUsuario === "function") {
      const estado = resultado.validarUsuario(dto);
      dto.setValido(estado);
    }

    return dto;
  }

  async listarUsuarios() {
    const usuarios = await this.adaptadorSalida.listarUsuarios();
    return usuarios.map(usuarioARespuesta);
  }
}
