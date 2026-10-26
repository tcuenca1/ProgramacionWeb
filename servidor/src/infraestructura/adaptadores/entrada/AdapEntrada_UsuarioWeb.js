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
        const dtoUsuario = new DtoUsuario(req.query.usu, req.query.cont, false, req.query.ciudad, req.query.tel);
        const resultado = await this.casoUso.validarUsuario(dtoUsuario);
        res.json({
            message: resultado
        });
    }

    async listar(req, res) {
        try {
            res.json(await this.casoUso.listarUsuarios());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const creado = await this.casoUsoEscritura.crearUsuario(this.dtoDesdeCuerpo(req.body));
            res.status(201).json(creado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const actualizado = await this.casoUsoEscritura.actualizarUsuario(req.params.id, this.dtoDesdeCuerpo(req.body));
            if (!actualizado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
