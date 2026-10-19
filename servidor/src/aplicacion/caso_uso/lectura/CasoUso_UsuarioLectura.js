import { Administrador } from "../../../dominio/Administrador.js";
import { Personal } from "../../../dominio/Personal.js";
import { Invitado } from "../../../dominio/Invitado.js";

export class CasoUso_UsuarioLectura {
  constructor(adaptadorSalida) {
    this.adaptadorSalida = adaptadorSalida;
  }

  async validarUsuario(dto) {
    const dominioUsuario = await this.adaptadorSalida.leerUsuario(dto);

    const estado = dominioUsuario ? dominioUsuario.validarUsuario(dto) : false;
    dto.setValido(estado);

    let respuesta = {
      usuario: dto.getNombre(),
      esValido: dto.getValido(),
      ciudad: dto.getCiudad(),
      telefono: dto.getTelefono(),
      tipo: dto.getTipo(),
    };

    if (dominioUsuario) {
      dto.setTipo(dominioUsuario.tipo);
      dto.setCiudad(dominioUsuario.ciudad);
      dto.setTelefono(dominioUsuario.telefono);

      if (dominioUsuario instanceof Administrador) {
        dto.setNivelAcceso(dominioUsuario.nivelAcceso);
        dto.setDepartamento(dominioUsuario.departamento);
        respuesta.nivelAcceso = dominioUsuario.nivelAcceso;
        respuesta.departamento = dominioUsuario.departamento;
      } else if (dominioUsuario instanceof Personal) {
        dto.setTurno(dominioUsuario.turno);
        dto.setCodigoEmpleado(dominioUsuario.codigoEmpleado);
        respuesta.turno = dominioUsuario.turno;
        respuesta.codigoEmpleado = dominioUsuario.codigoEmpleado;
      } else if (dominioUsuario instanceof Invitado) {
        dto.setMotivoVisita(dominioUsuario.motivoVisita);
        dto.setFechaExpiracion(dominioUsuario.fechaExpiracion);
        respuesta.motivoVisita = dominioUsuario.motivoVisita;
        respuesta.fechaExpiracion = dominioUsuario.fechaExpiracion;
      }
    }

    return respuesta;
  }
}
