import { DataTypes } from "sequelize";
import { ormPostgres } from "../OrmPostgresql.js";

export const outboxModelo = ormPostgres.define(
    "evento_outbox",
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
        playload: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        publicado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "evento_outbox",
        timestamps: true,
        createdAt: "creado_en",
        updatedAt: false,
        paranoid: true,
        deletedAt: "eliminado_en"
    }
);
