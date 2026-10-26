import { DataTypes } from "sequelize";
import { ormPostgres } from "../OrmPostgresql.js";

const columnasUsuario = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    }
};

export const administradorModelo = ormPostgres.define(
    "Administrador",
    {
        ...columnasUsuario,
        nivelAcceso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "nivel_acceso"
        },
        departamento: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "administrador",
        timestamps: false
    }
);

export const personalModelo = ormPostgres.define(
    "Personal",
    {
        ...columnasUsuario,
        turno: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codigoEmpleado: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "codigo_empleado"
        }
    },
    {
        tableName: "personal",
        timestamps: false
    }
);

export const invitadoModelo = ormPostgres.define(
    "Invitado",
    {
        ...columnasUsuario,
        motivoVisita: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "motivo_visita"
        },
        fechaExpiracion: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "fecha_expiracion"
        }
    },
    {
        tableName: "invitado",
        timestamps: false
    }
);

export const pgModelosPorTipo = {
    Administrador: administradorModelo,
    Personal: personalModelo,
    Invitado: invitadoModelo
};
