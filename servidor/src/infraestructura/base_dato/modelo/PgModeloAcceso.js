import { DataTypes } from "sequelize";
import { ormPostgres } from "../OrmPostgresql.js";
export const accesoModelo = ormPostgres.define(
    "acceso",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.DATE
        },   
        dispositivo: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "acceso",
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        paranoid: true,
        deletedAt:"eliminado_en"
    }
);