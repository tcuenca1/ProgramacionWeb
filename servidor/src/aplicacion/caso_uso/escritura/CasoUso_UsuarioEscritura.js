import { Usuario } from '../../../dominio/Usuario.js';
import { Administrador } from '../../../dominio/Administrador.js';
import { Personal } from '../../../dominio/Personal.js';
import { Invitado } from '../../../dominio/Invitado.js';
import { usuarioARespuesta } from '../../dto/RespuestaUsuario.js';

const TIPOS = ['Administrador', 'Personal', 'Invitado'];

export class CasoUso_UsuarioEscritura {
    constructor(adaptadorSalida) {
        this.adaptadorSalida = adaptadorSalida;
    }

    limpiarDatos(dto) {
        const { valido, ...datos } = dto;
        for (const campo of Object.keys(datos)) {
            if (datos[campo] === '' || datos[campo] === null || datos[campo] === undefined) {
                delete datos[campo];
            }
        }
        if (datos.nivelAcceso !== undefined) {
            datos.nivelAcceso = Number(datos.nivelAcceso);
        }
        return datos;
    }

    async crearUsuario(dto) {
        const datos = this.limpiarDatos(dto);
        if (!datos.nombre || !datos.contrasena) {
            throw new Error('El nombre y la contraseña son obligatorios');
        }
        if (!TIPOS.includes(datos.tipo)) {
            throw new Error('El tipo debe ser Administrador, Personal o Invitado');
        }
        const usuario = Usuario.crearUsuarioDominio(datos);
        const creado = await this.adaptadorSalida.crearUsuario(usuario);
        return usuarioARespuesta(creado);
    }

    async eliminarUsuario(id) {
        const eliminado = await this.adaptadorSalida.eliminarUsuario(id);
        return eliminado ? usuarioARespuesta(eliminado) : null;
    }

    async actualizarUsuario(id, dto) {
        const datos = this.limpiarDatos(dto);
        const actualizado = await this.adaptadorSalida.actualizarUsuario(id, datos);
        return actualizado ? usuarioARespuesta(actualizado) : null;
    }
}
