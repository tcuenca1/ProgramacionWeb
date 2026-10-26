import { isValidObjectId } from "mongoose";
import { PuertoSalidaUsuarioWeb } from "../../../aplicacion/puerto/salida/PuertoSalidaUsuarioWeb.js";
import { Invitado } from "../../../dominio/Invitado.js";
import { Usuario } from "../../../dominio/Usuario.js";
import { Administrador } from "../../../dominio/Administrador.js";
import { Personal } from "../../../dominio/Personal.js";
import { mgUsuarioModelo, mgModelosPorTipo } from "../../base_dato/modelo/MgModeloUsuario.js";

export class AdapSalida_MongoDbOdm extends PuertoSalidaUsuarioWeb {
    aDominio(documento) {
        return Usuario.crearUsuarioDominio({ ...documento, id: documento._id });
    }

    async leerUsuario(dto) {
        const resultado = await mgUsuarioModelo
            .findOne({ nombre: dto.nombre, contrasena: dto.contrasena })
            .lean();
        if (resultado != null) {
            return this.aDominio(resultado);
        }
        return new Invitado("", "", "");
    }

    async listarUsuarios() {
        const documentos = await mgUsuarioModelo.find().sort({ _id: 1 }).lean();
        return documentos.map((documento) => this.aDominio(documento));
    }

    async crearUsuario(usuario) {
        const modelo = mgModelosPorTipo[usuario.tipo] ?? mgUsuarioModelo;
        const documento = await modelo.create({ ...usuario });
        return this.aDominio(documento.toObject());
    }

    async actualizarUsuario(id, usuario) {
        if (!isValidObjectId(id)) return null;
        const existente = await mgUsuarioModelo.findById(id).lean();
        if (existente == null) return null;
        const modelo = mgModelosPorTipo[existente.tipo] ?? mgUsuarioModelo;
        const { id: _id, tipo, ...campos } = usuario;
        const documento = await modelo
            .findByIdAndUpdate(id, campos, { new: true, runValidators: true })
            .lean();
        return this.aDominio(documento);
    }
}
