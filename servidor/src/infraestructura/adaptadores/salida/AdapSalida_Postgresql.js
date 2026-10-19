import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js";
import { conexionPostgres } from "../../base_dato/ConexionPostgresql.js";
import { Administrador } from "../../../dominio/Administrador.js"
import { Invitado } from "../../../dominio/Invitado.js";
import { Personal } from "../../../dominio/Personal.js";
import { Usuario } from "../../../dominio/Usuario.js";

export class AdapSalida_Postgresql extends PuertoSalidaUsuarioWeb {
  async leerUsuario(dto) {
    const resultado = await conexionPostgres.query(
      "SELECT * FROM usuario WHERE nombre = '" + dto.nombre + "'",
    );
    const fila = resultado.rows[0];
    let obj = null;
    if (resultado.rowCount > 0) {
      switch (fila.tipo) {
        case "Administrador":
        case "1":
          obj = new Administrador(fila.nombre, fila.contrasena, fila.tipo, fila.nivel_acceso, fila.departamento, fila.ciudad, fila.telefono);
          break;
        case "Personal":
        case "2":
          obj = new Personal(fila.nombre, fila.contrasena, fila.tipo, fila.turno, fila.codigo_empleado, fila.ciudad, fila.telefono);
          break;
        case "Invitado":
        case "3":
          obj = new Invitado(fila.nombre, fila.contrasena, fila.tipo, fila.motivo_visita, fila.fecha_expiracion, fila.ciudad, fila.telefono);
          break;
        default:
          obj = new Usuario(fila.nombre, fila.contrasena, fila.ciudad, fila.telefono, fila.tipo);
          break;
      }
    } else {
      obj = new Invitado("", "", "");
    }  
    console.log(obj);
    return obj;
  }
}
