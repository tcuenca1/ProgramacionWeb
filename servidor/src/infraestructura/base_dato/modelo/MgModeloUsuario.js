import { Schema } from "mongoose";
import { odmMongo } from "../OdmMongo.js";

const usuarioEsquema = new Schema(
    {
        nombre: { type: String, required: true },
        contrasena: { type: String, required: true },
        ciudad: { type: String },
        telefono: { type: String }
    },
    {
        collection: "usuario",
        discriminatorKey: "tipo",
        versionKey: false
    }
);

export const mgUsuarioModelo = odmMongo.model("Usuario", usuarioEsquema);

export const mgAdministradorModelo = mgUsuarioModelo.discriminator(
    "Administrador",
    new Schema({
        nivelAcceso: { type: Number },
        departamento: { type: String }
    })
);

export const mgPersonalModelo = mgUsuarioModelo.discriminator(
    "Personal",
    new Schema({
        turno: { type: String },
        codigoEmpleado: { type: String }
    })
);

export const mgInvitadoModelo = mgUsuarioModelo.discriminator(
    "Invitado",
    new Schema({
        motivoVisita: { type: String },
        fechaExpiracion: { type: Date }
    })
);

export const mgModelosPorTipo = {
    Administrador: mgAdministradorModelo,
    Personal: mgPersonalModelo,
    Invitado: mgInvitadoModelo
};
