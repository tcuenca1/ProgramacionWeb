import { DataTypes } from "sequelize";
import { ormPostgres } from "../OrmPostgresql.js";

export const auditoriaEventoModelo = ormPostgres.define(
    "auditoria_evento",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        publicado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "auditoria_evento",
        timestamps: true,
        createdAt: "creado_en",
        updatedAt: false,
        paranoid: true,
        deletedAt: "eliminado_en"
    }
);
