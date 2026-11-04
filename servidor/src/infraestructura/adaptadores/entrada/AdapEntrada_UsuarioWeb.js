import { PuertoEntradaUsuarioWeb } from "../../../aplicacion/puerto/entrada/PuertoEntradaUsuarioWeb.js";
import { DtoUsuario } from "../../../aplicacion/dto/DtoUsuario.js";

export class AdapEntrada_UsuarioWeb extends PuertoEntradaUsuarioWeb {
    constructor(casoUso, casoUsoEscritura = null) {
        super();
        this.casoUso = casoUso;
        this.casoUsoEscritura = casoUsoEscritura;
    }

    dtoDesdeCuerpo(body) {
        return new DtoUsuario(
            body.nombre, body.contrasena, false, body.ciudad, body.telefono, body.tipo,
            body.nivelAcceso, body.departamento, body.turno, body.codigoEmpleado,
            body.motivoVisita, body.fechaExpiracion
        );
    }

    async autentica(req, res) {
        try {
            const dtoUsuario = new DtoUsuario(req.query.usu, req.query.cont, false, req.query.ciudad, req.query.tel);
            const resultado = await this.casoUso.validarUsuario(dtoUsuario);
            return res.status(200).json({
                message: resultado
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async listar(req, res) {
        try {
            return res.status(200).json(await this.casoUso.listarUsuarios());
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const creado = await this.casoUsoEscritura.crearUsuario(this.dtoDesdeCuerpo(req.body));
            return res.status(201).json(creado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const actualizado = await this.casoUsoEscritura.actualizarUsuario(req.params.id, this.dtoDesdeCuerpo(req.body));
            if (!actualizado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.status(200).json(actualizado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async actualizarParcial(req, res) {
        try {
            const actualizado = await this.casoUsoEscritura.actualizarUsuario(req.params.id, req.body);
            if (!actualizado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.status(200).json(actualizado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const eliminado = await this.casoUsoEscritura.eliminarUsuario(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.status(200).json({ message: "Usuario eliminado correctamente", id: req.params.id });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
